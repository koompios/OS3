#!/bin/bash

case $1 in

"userPfp")
    iconPath="/var/lib/AccountsService/icons/$USER"

    userIconPath="$HOME/.config/awesome/src/assets/userpfp/"

    if [[ -f "$userIconPath" ]]; then
        if [[ -f "$iconPath" ]]; then
            if ! cmp --silent "$userIconPath.png" "$iconPath"; then
                cp "$iconPath" "$userIconPath$USER.png"
            fi
            printf "$userIconPath.png"
        else
            printf "$userIconPath.png"
        fi
        exit
    else
        if [[ -f "$iconPath" ]]; then
            cp "$iconPath" "$userIconPath$USER.png"
            printf "$userIconPath$USER.png"
            exit
        fi
    fi
    ;;

"userName")
    user="$(whoami)"
    printf "$user"
    ;;

esac
