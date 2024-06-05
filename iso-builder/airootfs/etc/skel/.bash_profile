dconf write /org/gnome/desktop/sound/event-sounds "false"
dconf load / < ~/.dconf_settings.ini
xdg-mime default org.gnome.Nautilus.desktop inode/directory
dconf write /org/gnome/shell/disable-user-extensions false
gsettings set org.gnome.settings-daemon.peripherals.keyboard numlock-state off
