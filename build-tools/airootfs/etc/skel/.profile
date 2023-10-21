# ~/.profile: executed by the command interpreter for login shells.
# This file is not read by bash(1), if ~/.bash_profile or ~/.bash_login
# exists.
# see /usr/share/doc/bash/examples/startup-files for examples.
# the files are located in the bash-doc package.

# the default umask is set in /etc/profile; for setting the umask
# for ssh logins, install and configure the libpam-umask package.
#umask 022

# if running bash
if [ -n "$BASH_VERSION" ]; then
    # include .bashrc if it exists
    if [ -f "$HOME/.bashrc" ]; then
	. "$HOME/.bashrc"
    fi
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/bin" ] ; then
    PATH="$HOME/bin:$PATH"
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/.local/bin" ] ; then
    PATH="$HOME/.local/bin:$PATH"
fi


# Get the public IP address
#ip_address=$(curl -s https://ip.me)
#
#if [[ -n $ip_address ]]; then
#    # Get the public IP address
#    ip_address=$(curl -s https://ip.me)
#
#    # Get the timezone based on the IP address
#    timezone=$(curl -s "http://ip-api.com/line/$ip_address?fields=timezone")
#
#
#    if [[ -n $timezone && $timezone != "null" ]]; then
#        # Set the system timezone based on the IP address
#        timedatectl set-timezone "$timezone"
#    #    echo "System timezone set to $timezone."
#    else
#        # Set the default timezone as fallback
#        timedatectl set-timezone "Asia/Phnom_Penh"
#    #    echo "Failed to determine the system timezone based on IP address. Setting the default timezone (Asia/Phnom_Penh)."
#    fi
#else
#    # Set the default timezone when there is no internet connection
#    timedatectl set-timezone "Asia/Phnom_Penh"
#    #echo "No internet connection. Setting the default timezone (Asia/Phnom_Penh)."
#fi

#dconf load / < ~/.dconf_settings.ini
