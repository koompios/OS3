if [ -d "$HOME/.local/bin" ] ; then
    PATH="$HOME/.local/bin:$PATH"
fi


systemctl enable --now dhcpcd.service
systemctl enable --now liveuser-password.service

systemctl mask --now sleep.target suspend.target hibernate.target hybrid-sleep.target
