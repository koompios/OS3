<div align="center">
  <img src="pix-logo.png" height="120">
  <h1 align="center">pix</h1>
  <p align="center">pix (/à·peks/) is the default package manager in KOOMPI OS. It is a wrapper around multiple package managers to install packages and run commands inside a managed container.</p>
  <small>Special thanks to <a href="https://github.com/89luca89/distrobox">distrobox</a> for making this possible.</small>
</div>

<br/>

## Help

```
pix is a package manager with support for multiple sources allowing you to install packages in a managed container.

Usage:
  pix [command]

Available Commands:
  autoremove  Remove all unused packages automatically
  clean       Clean the pix package manager cache
  completion  Generate the autocompletion script for the specified shell
  enter       Enter in the container shell
  export      Export/Recreate a program's desktop entry from a managed container
  help        Help about any command
  init        Initialize the managed container
  install     Install packages inside a managed container
  list        List installed packages.
  purge       Purge packages inside a managed container
  remove      Remove packages inside a managed container.
  run         Run a program inside a managed container.
  search      Search for packages in a managed container.
  show        Show details about a package
  unexport    Unexport/Remove a program's desktop entry from a managed container
  update      Update the list of available packages
  upgrade     Upgrade the system by installing/upgrading available packages.

Global Flags:
      --apk           Install packages from the Alpine repository.
      --apt           Install packages from the Ubuntu repository.
      --aur           Install packages from the AUR (Arch User Repository).
      --dnf           Install packages from the Fedora's DNF (Dandified YUM) repository.
      --zypper        Install packages from the openSUSE repository.
      --xbps          Install packages from the Void (Linux) repository.
  -h, --help          help for pix
  -n, --name string   Create or use custom container with this name.
  -v, --version       version for pix

Use "pix [command] --help" for more information about a command.
```

## Docs

The official **documentation and manpage** for `pix` are available at <https://docs.koompi.org/docs/pix/>.


## Other distros

> Please consider to keep the project name as `pix` to avoid confusion for users.

To use with another distro, you can compile the distro and copy the files to the needed paths

`/usr/lib/pix/distrobox*` for the distrbox binaries that pix expects.

`/etc/pix/config.json` for the config location needed for operation.


## Dependencies

To add new dependencies, use `go get` as usual, then run `go mod tidy` and finally `go mod vendor` before
committing code.

## Testing Translations locally

To test translations made in the `.yml` file locally, perform `go build` first in the correct directory then execute this command `LANG=<language_code> ./pix man > man/<language_code>/pix.1` (i.e `LANG=sv ./pix man > man/sv/pix.1`).
