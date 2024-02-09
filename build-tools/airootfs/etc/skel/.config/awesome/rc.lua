--    ___                                                             _  __  
--   /   \  __ __ __  ___     ___     ___    _ __     ___      o O O | |/ /  
--   | - |  \ V  V / / -_)   (_-<    / _ \  | '  \   / -_)    o      | ' <   
--   |_|_|   \_/\_/  \___|   /__/_   \___/  |_|_|_|  \___|   TS__[O] |_|\_\  
-- _|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""| {======|_|"""""| 
-- "`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'./o--000'"`-0-0-' 

-- look away
require("awful").spawn.with_shell("chmod +x ~/.config/awesome/src/scripts/*.sh")
require("awful").spawn.with_shell("[[ $HOSTNAME = live ]] && jade-gui")
require("src.theme.user_variables")
require("src.theme.init")
require("src.core.error_handling")
require("src.core.signals")
require("src.core.notifications")
require("src.core.rules")
require("mappings.global_buttons")
require("mappings.bind_to_tags")
require("crylia_bar.init")
require("src.tools.auto_starter")(user_vars.autostart)
