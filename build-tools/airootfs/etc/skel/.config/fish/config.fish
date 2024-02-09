
if not status is-interactive
exit
end
# source /opt/esp-idf/export.fish 
# source /usr/share/doc/find-the-command/ftc.fish
oh-my-posh init fish --config /usr/share/oh-my-posh/themes/glowsticks.omp.yaml | source
enable_poshtransientprompt
oh-my-posh completion fish | source
alias la='ls -AlGh --color=auto'
alias lc='colorls -lxS --gs --dark'
alias ..='cd .. ; ls -laGh --color=auto'
alias h='cd ~ ; pwd'
alias r='cd / ; ls -laGh --color=auto'
alias reboot="systemctl reboot -i"
alias c='clear'
alias cl='c & ls'
alias xcclip='xclip -sel clip'

fish_add_path /usr/local/bin
fish_add_path "$HOME/.local/bin"
fish_config theme choose 'Solarized Dark'
# gh completion -s fish | source
set -gx EDITOR "micro"
set -gx VISUAL "micro"

