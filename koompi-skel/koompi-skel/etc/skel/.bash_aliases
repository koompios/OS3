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

# improve pi experience
alias pi='[[ -f /var/lib/pacman/db.lck ]] && sudo rm -rf /var/lib/pacman/db.lck; find /var/cache/pacman/pkg/ -name *.part -exec sudo rm -rf {} \;; pi'

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

pi() {
  # Validate arguments (ensure at least one package name is provided)
  if [[ $# -eq 0 ]]; then
    echo "Error: Please specify a package name and an action (install, remove, update)."
    return 1
  fi

  # Get the action (install, remove, or update)
  action="$1"
  shift  # Remove the action from arguments

  # Validate the action
  if [[ ! ( "$action" == "install" || "$action" == "remove" || "$action" == "update" ) ]]; then
    echo "Error: Invalid action. Choose from 'install', 'remove', or 'update'."
    return 1
  fi

  # Package names (handle multiple packages)
  packages=("$@")

  # Perform the action based on the user's choice
  case "$action" in
    install)
      # Attempt installation with sudo pacman -Sy (quiet mode)
      yay -Sy --noconfirm "${packages[@]}" 2>&1 | grep -E 'error|warning' > /tmp/pi_install.log
      echo "Installing: {packages[@}"

      # Check for successful installation
      if [[ $? -eq 0 ]]; then
        echo "Successfully installed packages: ${packages[@]}"
      else
        echo "Failed to install packages. Analyzing logs..."
        cat /tmp/pi_install.log
        # ... (rest of error handling logic from previous response)
      fi
      rm /tmp/pi_install.log
      ;;
    remove)
      # Remove packages with sudo yay -R
      yay -R "${packages[@]}"

      # Check for successful removal
      if [[ $? -eq 0 ]]; then
        echo "Successfully removed packages: ${packages[@]}"
      else
        echo "Failed to remove packages."
      fi
      ;;
    update)
      # Update packages with sudo yay -Syu
      yay -Syu --noconfirm

      # Inform the user about updates
      echo "Updated system and packages."
      ;;
  esac
}
