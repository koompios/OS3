#!/usr/bin/env bash
#

#bash /root/flatpak.install

set -e -u
systemctl enable gdm
systemctl enable zramd
systemctl set-default graphical.target

export $(dbus-launch)

chmod +x /usr/local/bin/lock-pacman
ln -s /usr/local/bin/lock-pacman /usr/local/bin/pacman

gsettings set org.gnome.software.sources flatpak-url 'flatpak:remote=flathub'

