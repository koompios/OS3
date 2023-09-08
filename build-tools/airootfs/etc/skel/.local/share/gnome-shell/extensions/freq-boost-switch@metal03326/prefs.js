const {
	      gi  : {
		      GLib: { Variant },
		      Gtk : { Builder },
		      Adw : { Toast },
		      Gdk : { Display },
		      Gio : { SettingsBindFlags, DBus: { session }, DBusCallFlags }
	      },
	      misc: {
		      extensionUtils: {
			      gettext: _,
			      initTranslations,
			      getSettings,
			      getCurrentExtension
		      }
	      }
      }                                      = imports;
const { imports: { common }, dir, metadata } = getCurrentExtension();

function init()
{
	initTranslations();
}

function fillPreferencesWindow( window )
{
	const builder = Builder.new();

	builder.set_translation_domain( metadata[ 'gettext-domain' ] );

	builder.add_from_file( dir.get_child( 'general.ui' ).get_path() );
	builder.add_from_file( dir.get_child( 'debug.ui' ).get_path() );

	const freqBoostPolkitVersion = builder.get_object( 'freqBoostPolkitVersion' );
	const pkexecVersion          = common.bashSyncCommand( 'pkexec --version' );
	const myCpuType              = common.getMyCpuType();
	const cpuSupported           = myCpuType !== common.CPU_NOT_SUPPORTED;
	const isIntel                = myCpuType === common.CPU_INTEL;
	const onLogsClicked          = ( { name } ) =>
	{
		const content = `journalctl -o cat -f /usr/bin/${name}`;

		Display.get_default().get_clipboard().set( content );

		window.add_toast( new Toast( { title: _( 'Copied: {{content}}' ).replace( '{{content}}', content ) } ) );
	};

	setExecutableOption( builder );

	if ( cpuSupported )
	{
		builder.get_object( 'freqBoostCpuDetected' ).set_subtitle( isIntel ? 'Intel' : 'AMD' );
	}

	builder.get_object( 'freqBoostMyVersion' ).set_subtitle( metadata.version.toString() );

	builder.get_object( 'freqBoostLogsPreferences' ).connect( 'clicked', onLogsClicked );
	builder.get_object( 'freqBoostLogsExtension' ).connect( 'clicked', onLogsClicked );

	if ( pkexecVersion && cpuSupported )
	{
		const freqBoostPersistSwitch = builder.get_object( 'freqBoostPersistSwitch' );
		const settings               = getSettings();
		const version                = pkexecVersion.slice( pkexecVersion.search( /\d/ ) );

		// Time to add the General tab - extension should be able to work properly, so some preferences will be nice
		window.add( builder.get_object( 'freqBoostGeneralTab' ) );
		window.set_visible_page_name( 'freqBoostGeneralTab' );

		// Show Polkit version in the Debug tab
		freqBoostPolkitVersion.set_subtitle( version );

		settings.bind( 'persist', freqBoostPersistSwitch, 'active', SettingsBindFlags.DEFAULT );

		if ( Number( version ) >= 0.106 )
		{
			setPolkitOption( builder, settings );
		}

		// Test if we have Intel EPP and EPB. Add Intel tab if we have at least one. Also show debug items
		if ( isIntel )
		{
			setIntelOptions( window, builder, settings );
		}
	}
	else
	{
		// Hide, if we came here because of CPU not supported
		freqBoostPolkitVersion.visible = cpuSupported;

		window.set_visible_page_name( 'freqBoostDebugTab' );
	}

	window.add( builder.get_object( 'freqBoostDebugTab' ) );
}

function setExecutableOption( builder )
{
	const freqBoostExecutableBit    = builder.get_object( 'freqBoostExecutableBit' );
	const freqBoostExecutableBitSet = builder.get_object( 'freqBoostExecutableBitSet' );
	const setExecutableUi           = () =>
	{
		if ( dir.get_child( 'set_boost' ).query_info( 'access::can-execute', null, null ).get_attribute_boolean( 'access::can-execute' ) )
		{
			freqBoostExecutableBit.set_subtitle( _( 'Yes' ) );

			freqBoostExecutableBitSet.visible = false;
		}
	};

	freqBoostExecutableBit.visible = true;

	freqBoostExecutableBitSet.connect( 'clicked', _ =>
	{
		common.bashSyncCommand( `chmod +xx ${dir.get_child( 'set_boost' ).get_path()}` );

		setExecutableUi();
	} );

	builder.get_object( 'freqBoostExecutableBitLocate' ).connect( 'clicked', _ => session.call(
		'org.freedesktop.FileManager1',
		'/org/freedesktop/FileManager1',
		'org.freedesktop.FileManager1',
		'ShowItems',
		new Variant(
			'(ass)',
			[ [ `file://${dir.get_child( 'set_boost' ).get_path()}` ], '' ]
		),
		null,
		DBusCallFlags.NONE,
		-1,
		null,
		// We do not care of the response
		null
	) );

	setExecutableUi();
}

function setPolkitOption( builder, settings )
{
	const freqBoostPolkitSwitch   = builder.get_object( 'freqBoostPolkitSwitch' );
	const freqBoostRulesDebugItem = builder.get_object( 'freqBoostRulesDebugItem' );

	// Hide Outdated message and show action row
	builder.get_object( 'freqBoostPolkitOk' ).visible       = true;
	builder.get_object( 'freqBoostOutdatedPolkit' ).visible = false;

	freqBoostPolkitSwitch.set_active( settings.get_boolean( 'polkit-rules' ) );
	freqBoostPolkitSwitch.connect( 'notify::active', ( { active } ) =>
	{
		// This if filters out 2 cases:
		// 1. Initial switch set
		// 2. If user denies permissions, we set the switch back to previous state, which comes here again
		if ( settings.get_boolean( 'polkit-rules' ) !== active )
		{
			common.pkexecCommand( active ? `cp ${dir.get_child( 'freq-boost-switch.rules' ).get_path()} /etc/polkit-1/rules.d/` : 'rm -f /etc/polkit-1/rules.d/freq-boost-switch.rules', true )
				.then( _ => settings.set_boolean( 'polkit-rules', active ) )
				.catch( _ => freqBoostPolkitSwitch.set_active( !active ) );
		}
	} );

	// Setup debug item for Polkit
	freqBoostRulesDebugItem.visible = true;

	builder.get_object( 'freqBoostExecutableBitTest' ).connect( 'clicked', () => common.pkexecCommand( 'ls /etc/polkit-1/rules.d/freq-boost-switch.rules', true )
		.then( () => freqBoostRulesDebugItem.set_subtitle( _( 'Yes' ) ) )
		.catch( () => freqBoostRulesDebugItem.set_subtitle( _( 'No' ) ) )
	);
}

function setIntelOptions( window, builder, settings )
{
	let intelTabVisibility = false;
	const myCpuType        = common.CPU_INTEL;
	const onIntelChange    = ( {
		                           'active-id': activeId,
		                           name
	                           } ) => settings[ `set_${name.startsWith( 'epp' ) ? 'string' : 'int'}` ]( name, activeId );

	builder.add_from_file( dir.get_child( 'intel.ui' ).get_path() );

	// EPB is supported
	if ( common.bashSyncCommand( 'cat /sys/devices/system/cpu/cpu0/power/energy_perf_bias' ) )
	{
		const freqBoostEpbOn        = builder.get_object( 'freqBoostEpbOn' );
		const freqBoostEpbOff       = builder.get_object( 'freqBoostEpbOff' );
		const freqBoostEpbDebugItem = builder.get_object( 'freqBoostEpbDebugItem' );
		const epbMap                = new Map( [
			[ '0', 'performance' ],
			[ '4', 'balance-performance' ],
			[ '6', 'normal' ],
			[ '8', 'balance-power' ],
			[ '15', 'power' ]
		] );
		const onTestEpbClicked      = _ =>
		{
			const epb = common.bashSyncCommand( 'cat /sys/devices/system/cpu/cpu0/power/energy_perf_bias' );

			if ( epb )
			{
				freqBoostEpbDebugItem.set_subtitle( epbMap.get( epb ) || epb );
			}
		};

		intelTabVisibility = true;

		freqBoostEpbDebugItem.visible = true;

		epbMap.forEach( ( value, key ) =>
		{
			freqBoostEpbOn.append( key, value );
			freqBoostEpbOff.append( key, value );
		} );

		freqBoostEpbOn[ 'active-id' ]  = settings.get_int( 'epb-on' ).toString();
		freqBoostEpbOff[ 'active-id' ] = settings.get_int( 'epb-off' ).toString();

		freqBoostEpbOn.connect( 'changed', onIntelChange );
		freqBoostEpbOff.connect( 'changed', onIntelChange );

		// Update Debug item
		onTestEpbClicked();

		builder.get_object( 'freqBoostEpbSet' ).connect( 'clicked', _ =>
		{
			const state = common.getBoostState( myCpuType );

			common.pkexecCommand(
				[
					dir.get_child( 'set_boost' ).get_path(),
					// Subprocess is not happy if we leave those as numbers
					myCpuType.toString(),
					Number( state ).toString(),
					'-1',
					settings.get_int( `epb-${state ? 'on' : 'off'}` ).toString()
				] )
				.then( onTestEpbClicked );
		} );
		builder.get_object( 'freqBoostEpbRefresh' ).connect( 'clicked', onTestEpbClicked );
	}
	else
	{
		builder.get_object( 'freqBoostEpbFrame' ).visible = false;
	}

	const epp = common.bashSyncCommand( 'cat /sys/devices/system/cpu/cpu0/cpufreq/energy_performance_available_preferences' );

	// EPP is supported
	if ( epp )
	{
		const freqBoostEppOn        = builder.get_object( 'freqBoostEppOn' );
		const freqBoostEppOff       = builder.get_object( 'freqBoostEppOff' );
		const freqBoostEppDebugItem = builder.get_object( 'freqBoostEppDebugItem' );
		const onTestEppClicked      = _ =>
		{
			const epp = common.bashSyncCommand( 'cat /sys/devices/system/cpu/cpu0/cpufreq/energy_performance_preference' );

			if ( epp )
			{
				freqBoostEppDebugItem.set_subtitle( epp );
			}
		};

		intelTabVisibility = true;

		freqBoostEppDebugItem.visible = true;

		// Set dropdown items
		epp.split( ' ' ).forEach( value =>
		{
			freqBoostEppOn.append( value, value );
			freqBoostEppOff.append( value, value );
		} );

		freqBoostEppOn[ 'active-id' ]  = settings.get_string( 'epp-on' );
		freqBoostEppOff[ 'active-id' ] = settings.get_string( 'epp-off' );

		freqBoostEppOn.connect( 'changed', onIntelChange );
		freqBoostEppOff.connect( 'changed', onIntelChange );

		// Update Debug item
		onTestEppClicked();

		builder.get_object( 'freqBoostEppSet' ).connect( 'clicked', _ =>
		{
			const state = common.getBoostState( myCpuType );

			common.pkexecCommand(
				[
					dir.get_child( 'set_boost' ).get_path(),
					// Subprocess is not happy if we leave those as numbers
					myCpuType.toString(),
					Number( state ).toString(),
					settings.get_string( `epp-${state ? 'on' : 'off'}` ),
					'-1'
				] )
				.then( onTestEppClicked );
		} );
		builder.get_object( 'freqBoostEppRefresh' ).connect( 'clicked', onTestEppClicked );
	}
	else
	{
		builder.get_object( 'freqBoostEppFrame' ).visible = false;
	}

	if ( intelTabVisibility )
	{
		window.add( builder.get_object( 'freqBoostIntelTab' ) );
	}
}