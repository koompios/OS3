#!/bin/bash

ID=$(rfkill -n -o ID,DEVICE | grep hci0 | sed "s/\ hci0//g" | sed "s/\ //")
rfkill block $ID