#!/bin/bash
# navigation
alias ls='ls -lGh --color=auto'
alias la='ls -alGh --color=auto'
alias ..='cd .. ; ls -laGh --color=auto'
alias h='cd ~ ; pwd'
alias r='cd / ; ls -laGh --color=auto'
alias reboot="systemctl reboot -i"
alias c='clear'
alias cl='c & ls'
alias vi="nvim"
alias vim="nvim"

function update-ui() {
	echo "Updating KOOMPI OS Interface..."
	echo "Kindly please wait a few moments."
	sleep 1;
	echo "Updating Gnome extension..."
	sudo pacman -Sy koompi-skel --noconfirm --overwrite="*"
	cp -r /etc/skel/.local/share/gnome-shell/extensions/* $HOME/.local/share/gnome-shell/extensions/
	echo "Backing up previous Gnome UI..."
	echo "In case something goes wrong, we can revert back"
	mv $HOME/.config/dconf/user $HOME/.config/dconf/user.bk
	sleep 1;
	dconf dump / > ~/.config/dconf/dconf-settings.ini.bk
	echo "Updating KOOMPI Config..."
	sleep 1;
	cp /etc/skel/.config/dconf/user $HOME/.config/dconf/
	sleep 1;
	cp /etc/skel/.config/dconf/dconf-settings.ini $HOME/.config/dconf/
	echo "Applying the config..."
	sleep 1;
	dconf load / < ~/.config/dconf/dconf-settings.ini
	echo "Please Logout or Restart your machine to properly finished the update"

}

function revert-ui() {
	echo "Reverting to previous KOOMPI Interface"
	mv $HOME/.config/dconf/user.bk $HOME/.config/dconf/user
	mv $HOME/.config/dconf/dconf-settings.bk $HOME/.config/dconf/dconf-settings.ini
	dconf load / < ~/.config/dconf/dconf-settings.ini
}



function cwp() {
        cargo watch -x "run --package ${1}"
}

# unalias sudo
function sudo() {
        # improve pacman experience
        if [[ $1 == "pacman" ]]; then
                find /var/cache/pacman/pkg/ -name "*.part" -exec sudo rm -rf {} \;
                [[ -f /var/lib/pacman/db.lck ]] && sudo rm -rf /var/lib/pacman/db.lck
                command sudo pacman ${@:2}
        else
                command sudo $@
        fi
}
