KOOMPI OS Live USB with Gnome
===========================

About
-----
TODO!

Usage
-----
Clone repo and create ISO with mkarchiso:

```bash
git clone https://github.com/koompi/OS3/
cd OS3
git checkout gnome-edition-z11
mkarchiso -v -o ./ iso-builder
```

Add more packages to [packages.x86_64](packages.x86_64) if needed.