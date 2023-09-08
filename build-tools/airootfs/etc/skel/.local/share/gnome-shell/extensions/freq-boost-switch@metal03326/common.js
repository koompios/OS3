const {
	      byteArray,
	      gi: {
		      GLib,
		      Gio: { Subprocess, SubprocessFlags }
	      }
      } = imports;

// ES6 mandates var to be used when exporting
// intel_pstate/intel_cpufreq
var CPU_INTEL         = 0;
// acpi-cpufreq/amd-pstate
var CPU_AMD           = 1;
var CPU_NOT_SUPPORTED = 2;

function getMyCpuType()
{
	const driver = bashSyncCommand( 'cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_driver' );

	if ( driver )
	{
		if ( [ 'intel_pstate', 'intel_cpufreq' ].includes( driver ) && bashSyncCommand( 'cat /sys/devices/system/cpu/intel_pstate/no_turbo' ) )
		{
			return CPU_INTEL;
		}
		else if ( [ 'amd-pstate', 'acpi-cpufreq' ].includes( driver ) && bashSyncCommand( 'cat /sys/devices/system/cpu/cpufreq/boost' ) )
		{
			return CPU_AMD;
		}
	}

	return CPU_NOT_SUPPORTED;
}

function getBoostState( myCpuType = getMyCpuType() )
{
	const [ setting, enabledValue ] = [
		// 0 means Boost is on, 1 means it is off
		[ 'intel_pstate/no_turbo', '0' ],
		// 0 means Boost is off, 1 means it is on
		[ 'cpufreq/boost', '1' ]
	][ myCpuType ];
	const out                       = bashSyncCommand( `cat /sys/devices/system/cpu/${setting}` );

	if ( out )
	{
		return out === enabledValue;
	}

	return null;
}

function pkexecCommand( command, inBash )
{
	const params = [ 'pkexec' ].concat( inBash ? [ '/bin/sh', '-c', command ] : command );

	return new Promise( ( resolve, reject ) => Subprocess.new( params, SubprocessFlags.NONE )
		.communicate_utf8_async( null, null, proc =>
		{
			try
			{
				if ( !proc.get_successful() )
				{
					throw new Error();
				}

				resolve();
			}
			catch ( e )
			{
				reject( e );
			}
		} ) );
}

function bashSyncCommand( command )
{
	const out = GLib.spawn_command_line_sync( `bash -c "${command}"` )[ 1 ];

	if ( out.length )
	{
		return byteArray.toString( out ).trim();
	}

	return false;
}