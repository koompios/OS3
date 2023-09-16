#!/usr/bin/env bash
#

bash /root/flatpak.install

set -e -u
systemctl enable gdm
systemctl set-default graphical.target

