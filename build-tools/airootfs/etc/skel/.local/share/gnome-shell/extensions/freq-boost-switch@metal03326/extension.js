const {
	      gi  : { GLib },
	      ui  : {
		      main         : {
			      sessionMode,
			      extensionManager,
			      panel: { statusArea: { quickSettings: { menu } } }
		      },
		      quickSettings: { QuickMenuToggle }
	      },
	      misc: {
		      extensionUtils: {
			      gettext: _,
			      getCurrentExtension,
			      getSettings,
			      initTranslations
		      }
	      }
      } = imports;

const { imports: { common }, dir, metadata } = getCurrentExtension();


class BoostExtension {
	constructor()
	{
		initTranslations();
	}

	enable()
	{
		// GNOME calls enable on every unlock. This code here needs to run only the first time, on user log-in
		if ( typeof this.cpuType === 'undefined' )
		{
			// Things depend on CPU type, so get it before everything else
			this.cpuType = common.getMyCpuType();

			// Give time for Power Profiles menu to appear. Also, the same timeout is used for persistent boost set
			this.initialBoostTimeout = GLib.timeout_add( GLib.PRIORITY_DEFAULT, 5000, _ =>
			{
				if ( this.cpuType !== common.CPU_NOT_SUPPORTED )
				{
					const state    = common.getBoostState( this.cpuType );
					const settings = getSettings();

					// Turn off if it is on now, user has opted-in for persistence and the last time he turned off Boost
					if ( state && settings.get_boolean( 'persist' ) && !settings.get_boolean( 'boost' ) )
					{
						this.setBoostState( false );
					}
					else
					{
						// Always set state. This clears use cases of this sort:
						// 1. Disable Boost
						// 2. Reboot (this will enable Boost)
						// 3. Enable Persist (while Boost is on)
						// User will be prompted to disable Boost since setting is remembered from the last time he
						// clicked the switch. Clear it here, so that doesn't happen.
						settings.set_boolean( 'boost', state );
					}
				}
			} );
		}

		if ( this.cpuType !== common.CPU_NOT_SUPPORTED )
		{
			this.toggle = new QuickMenuToggle( {
				label     : _( 'GHz Boost' ),
				toggleMode: true
			} );

			this.toggle.menu.addAction( _( 'Preferences' ), _ => extensionManager.openExtensionPrefs( metadata.uuid, '', {} ) );

			this.toggleClickedConnection = this.toggle.connect( 'clicked', item => this.setBoostState( item.get_checked() ) );

			// Get boost state every time user opens the quick menu, to ensure we are in sync
			this.menuConnection = menu.connect( 'open-state-changed', ( menu, isOpen ) => isOpen && this.setToggleState( common.getBoostState( this.cpuType ) ) );

			menu.addItem( this.toggle, 1 );
		}
	}

	disable()
	{
		this.toggle?.disconnect( this.toggleClickedConnection );
		this.toggle?.destroy();

		if ( this.menuConnection )
		{
			menu.disconnect( this.menuConnection );
		}

		GLib.Source.remove( this.initialBoostTimeout );

		this.toggle = this.menuConnection = this.initialBoostTimeout = this.toggleClickedConnection = null;

		// If user disabled the extension, bring back Boost to on (and save boolean)
		if ( this.cpuType !== common.CPU_NOT_SUPPORTED && sessionMode.currentMode === 'user' && !common.getBoostState( this.cpuType ) )
		{
			this.setBoostState( true );
		}
	}

	setToggleState( state )
	{
		if ( this.toggle )
		{
			this.toggle.iconName = {
				true : 'power-profile-performance-symbolic',
				false: 'power-profile-power-saver-symbolic'
			}[ state ];

			this.toggle.set_checked( state );

			this.toggle.menu.setHeader(
				this.toggle.iconName,
				_( 'Frequency Boost' ),
				_( 'Your {{CPU}} CPU boost is currently {{STATE}}' )
					.replace( '{{CPU}}', this.cpuType === common.CPU_INTEL ? 'Intel' : 'AMD' )
					.replace( '{{STATE}}', state ? _( 'ON' ) : _( 'OFF' ) )
			);
		}
	}

	setBoostState( state )
	{
		const settings = getSettings();
		// Moved to the set_boost file. Reason - more meaningful pkexec message
		/*const [ setting, value ] = [
		 [ 'intel_pstate/no_turbo', Number( !state ) ],
		 [ 'cpufreq/boost', Number( state ) ]
		 ][ cpuType ];

		 GLib.spawn_command_line_async( `pkexec bash -c "echo ${value} > /sys/devices/system/cpu/${setting}"` );*/

		common.pkexecCommand(
			[
				dir.get_child( 'set_boost' ).get_path(),
				// Subprocess is not happy if we leave those as numbers
				this.cpuType.toString(),
				Number( state ).toString(),
				settings.get_string( `epp-${state ? 'on' : 'off'}` ),
				settings.get_int( `epb-${state ? 'on' : 'off'}` ).toString()
			] )
			.then( _ =>
			{
				this.setToggleState( state );

				settings.set_boolean( 'boost', state );
			} )
			// We come here if something goes wrong inside the set_boost - we now have 3 things going on there
			// for Intel CPUs. Setting the Boost is actually last, so if any error occurs, boost will not be changed.
			// Reflect that on the UI (which is still visible if Polkit rules are added and no dialog appeared)
			.catch( _ => this.toggle?.set_checked( !this.toggle.get_checked() ) );

		// Destroy init timeout
		return false;
	}
}

function init()
{
	return new BoostExtension();
}