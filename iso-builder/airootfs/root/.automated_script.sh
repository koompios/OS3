#!/usr/bin/env bash

script_cmdline ()
{
    local param
    for param in $(< /proc/cmdline); do
        case "${param}" in
            script=*) echo "${param#*=}" ; return 0 ;;
        esac
    done
}


systemd_service() {
	systemctl enable --now liveuser-password.service
	systemctl enable --now dhcpcd.service
}

if [[ $(tty) == "/dev/tty1" ]]; then
    systemd_service;
fi
