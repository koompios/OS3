--------------------------------------------------------------------------------------------------------------
-- This is the statusbar, every widget, module and so on is combined to all the stuff you see on the screen --
--------------------------------------------------------------------------------------------------------------
local awful = require("awful")

awful.screen.connect_for_each_screen(
-- For each screen this function is called once
-- If you want to change the modules per screen use the indices
-- e.g. 1 would be the primary screen and 2 the secondary screen.
  function(s)
    -- Create 9 tags
    awful.layout.layouts = user_vars.layouts
    awful.tag(
      { "1", "2", "3", "4", "5", "6", "7", "8", "9" },
      s,
      user_vars.layouts[1]
    )

    require("src.modules.powermenu")(s)
    require("src.modules.volume_osd")(s)
    require("src.modules.brightness_osd")(s)
    require("src.modules.titlebar")
    require("src.modules.volume_controller")(s)

    -- Widgets
    s.battery = require("src.widgets.battery")()
    s.audio = require("src.widgets.audio")(s)
    s.date = require("src.widgets.date")()
    s.clock = require("src.widgets.clock")()
    s.bluetooth = require("src.widgets.bluetooth")()
    s.layoutlist = require("src.widgets.layout_list")(s)
    s.powerbutton = require("src.widgets.power")()
    s.taglist = require("src.widgets.taglist")(s)
    s.tasklist = require("src.widgets.tasklist")(s)

    s.systray = require("src.widgets.systray")(s)
    -- you can enable these if you wish
    -- then you can put them in the initialization below
    -- you can also reorder things that way

    -- s.kblayout = require("src.widgets.kblayout")(s)
    -- s.cpu_freq = require("src.widgets.cpu_info")("freq", "average")
    -- s.cpu_usage = require("src.widgets.cpu_info")("usage")
    -- s.cpu_temp = require("src.widgets.cpu_info")("temp")
    -- s.ram_info = require("src.widgets.ram_info")()
    -- s.network = require("src.widgets.network")()
    -- s.gpu_usage = require("src.widgets.gpu_info")("usage")
    -- s.gpu_temp = require("src.widgets.gpu_info")("temp")

    require("crylia_bar.left_bar")(s, { s.layoutlist, s.battery, s.bluetooth, s.systray, s.taglist })
    require("crylia_bar.center_bar")(s, { s.tasklist })
    require("crylia_bar.right_bar")(s, { s.audio, s.date, s.clock, s.powerbutton })
    require("crylia_bar.dock")(s, user_vars.dock_programs)
  end
)
