#!/usr/bin/env bash

set -e -u
systemctl enable gdm
systemctl set-default graphical.target

./root/add-flatpak-remote.sh
