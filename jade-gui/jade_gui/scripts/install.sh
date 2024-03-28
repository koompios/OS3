#!/usr/bin/bash
echo | tee /tmp/jade-gui-output.txt &>/dev/null
echo "Starting installation with pibee..." | tee -a /tmp/jade-gui-output.txt
sudo pibee config ~/.config/jade.json 2>/dev/null | tee -a /tmp/jade-gui-output.txt
