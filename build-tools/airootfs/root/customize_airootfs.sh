#!/usr/bin/env bash
#

bash /root/flatpak.install

set -e -u
chmod +x /usr/bin/satpaper
systemctl enable sddm
systemctl enable satpaper
systemctl set-default graphical.target

export $(dbus-launch)

# chmod +x /usr/local/bin/lock-pacman
# ln -s /usr/local/bin/lock-pacman /usr/local/bin/pacman
