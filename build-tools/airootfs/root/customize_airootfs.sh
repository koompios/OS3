#!/usr/bin/env bash
#

bash /root/my_custom.install

set -e -u
systemctl enable gdm
systemctl set-default graphical.target

