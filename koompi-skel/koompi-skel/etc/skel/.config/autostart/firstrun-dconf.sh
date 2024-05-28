#!/bin/bash

# Load dconf settings from the configuration file
dconf load / < ~/.config/dconf/firstrun-dconf.ini

# Remove the configuration file after successful execution (use exit code 0)
if [[ $? -eq 0 ]]; then
  rm -f ~/.config/dconf/firstrun-dconf.ini
fi

echo "dconf settings loaded and configuration file removed (if successful)."
