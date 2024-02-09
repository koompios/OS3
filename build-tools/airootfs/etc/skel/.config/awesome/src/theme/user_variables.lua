local awful = require("awful")
local dpi = require("beautiful").xresources.apply_dpi
local home = os.getenv("HOME")

-- If you want different default programs, wallpaper path or modkey; edit this file.
user_vars = {

  -- Autotiling layouts
  layouts = {
    awful.layout.suit.tile,
    awful.layout.suit.floating,
    -- awful.layout.suit.tile.left,
    -- awful.layout.suit.tile.bottom,
    awful.layout.suit.tile.top,
    -- awful.layout.suit.fair,
    awful.layout.suit.fair.horizontal,
    awful.layout.suit.spiral,
    awful.layout.suit.spiral.dwindle,
    awful.layout.suit.max,
    -- awful.layout.suit.max.fullscreen,
    awful.layout.suit.magnifier,
    awful.layout.suit.corner.nw,
    -- awful.layout.suit.corner.ne,
    -- awful.layout.suit.corner.sw,
    -- awful.layout.suit.corner.se,
  },

  icon_theme = "Papirus-Dark",

  -- Write the terminal command to start anything here
  autostart = {
  	"nm-applet",
    "picom",
  },

  network = {
    wlan = "wlan0",
    ethernet = "eno1"
  },
  font = {
    regular = "Delugia Mono, 14",
    bold = "Delugia Mono, Bold 14",
    extrabold = "JetBrainsMono Nerd Font, ExtraBold 14",
    specify = "Delugia Mono"
  },
  terminal = "kitty",
  -- This is the modkey 'mod4' = Super/Mod/WindowsKey, 'mod3' = alt...
  modkey = "Mod4",
  -- place your wallpaper at this path with this name, you could also try to change the path
  wallpaper = home .. "/.config/awesome/src/assets/mojave.jpg",
  namestyle = "",
  kblayout = { "us" },
  file_manager = "nautilus",
  screenshot_program = "flameshot gui",

  -- If you use the dock here is how you control its size
  dock_icon_size = dpi(45),

  -- Add your programs exactly like in this example.
  -- First entry is for icon selection
  -- Second entry has to be how you would start the program in the terminal (just try it if you dont know yahoo it)
  -- Third can be anything (will be the displayed name if you hover over it)
  -- Fourth is the file to the icon, if its failing
  dock_programs = {
  	{ "app-launcher", "rofi -show drun -theme ~/.config/rofi/rofi.rasi", "App launcher (meta+d)" },
    { "Kitty", "kitty", "Kitty (meta+enter)" },
    { "Firefox", "firefox", "Firefox" },
    { "Nautilus", "nautilus", "Files (meta+e)" },
    { "Telegram", "telegram-desktop", "Telegram" },
    -- { "Calculator", "gnome-calculator", "Calculator" },
    -- { "Inkscape", "inkscape", "Inkscape" },
    -- { "vlc", "vlc", "vlc" },
    -- { "elisa", "elisa", "Elisa music player" },
    -- { "kate", "kate", "Kate text editor" },
    { "gnome-tweak-tool", "gnome-tweaks", "Tweaks" },
    { "koompi-control-center", "control-center", "Control Center", "/usr/share/icons/Papirus-Dark/64x64/apps/xfce4-settings.svg" },
    { "system-monitor", "gnome-system-monitor", "System Monitor" },
    { "help-browser", "firefox " .. home .. "/docs.html", "How to use awesomewm" },
  }
}
