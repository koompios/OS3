package core

import (
	// "encoding/json"
	"errors"
	"fmt"
	// "io"
	// "log"
	// "net/http"
	// "os"
	"regexp"
	"strconv"
	"strings"

	"github.com/koompi-os/pix/settings"
)

func (c *Container) GetPkgCommand(command string) []string {
	switch c.containerType {
	case AUR:
		return GetAurPkgCommand(command)
	case APT:
		return GetAptPkgCommand(command)
	case DNF:
		return GetDnfPkgCommand(command)
	case APK:
		return GetApkPkgCommand(command)
	case ZYPPER:
		return GetZypperPkgCommand(command)
	case XBPS:
		return GetXbpsPkgCommand(command)
	default:
		return nil
	}
}

func GetDefaultPkgCommand(command string) []string {
	pkgmanager := settings.Cnf.PkgManager

	switch pkgmanager {
	case "aur":
		return GetAurPkgCommand(command)
	case "apt":
		return GetAurPkgCommand(command)
	case "dnf":
		return GetDnfPkgCommand(command)
	case "apk":
		return GetApkPkgCommand(command)
	case "zypper":
		return GetZypperPkgCommand(command)
	case "xbps":
		return GetXbpsPkgCommand(command)
	default:
		return []string{"echo", pkgmanager + " is not implemented yet!"}
	}
}

func GetAptPkgCommand(command string) []string {
	bin := "apt"

	switch command {
	case "autoremove":
		return []string{"sudo", bin, "autoremove"}
	case "clean":
		return []string{"sudo", bin, "clean"}
	case "install":
		return []string{"sudo", bin, "install"}
	case "list":
		return []string{"sudo", bin, "list"}
	case "purge":
		return []string{"sudo", bin, "purge"}
	case "remove":
		return []string{"sudo", bin, "remove"}
	case "search":
		return []string{"sudo", bin, "search"}
	case "show":
		return []string{"sudo", bin, "show"}
	case "update":
		return []string{"sudo", bin, "update"}
	case "upgrade":
		return []string{"sudo", bin, "upgrade"}
	default:
		return nil
	}
}

func GetAurPkgCommand(command string) []string {
	bin := "yay"

	switch command {
	// defaults
	case "autoremove":
		return []string{"echo", "Not implemented yet! "}
	case "clean":
		return []string{bin, "-Yc"}
	case "install":
		return []string{bin, "-S"}
	case "list":
		return []string{bin, "-Qm"}
	case "purge":
		return []string{bin, "-R"}
	case "remove":
		return []string{bin, "-Rs"}
	case "search":
		return []string{bin, "-Ss"}
	case "show":
		return []string{bin, "-Si"}
	case "update":
		return []string{bin, "-Syu"}
	case "upgrade":
		return []string{bin, "-Su"}

	// specials
	// case "install-yay-deps":
	// 	return []string{
	// 		// Also updates base packages because it would have to be done anyway
	// 		"bash", "-c", "sudo pacman -Syu --noconfirm wget git base-devel binutils",
	// 	}
	default:
		return nil
	}
}

func GetDnfPkgCommand(command string) []string {
	bin := "dnf"

	switch command {
	case "autoremove":
		return []string{"sudo", bin, "autoremove"}
	case "clean":
		return []string{"sudo", bin, "clean"}
	case "install":
		return []string{"sudo", bin, "install"}
	case "list":
		return []string{"sudo", bin, "list"}
	case "purge":
		return []string{"sudo", bin, "remove"}
	case "remove":
		return []string{"sudo", bin, "remove"}
	case "search":
		return []string{"sudo", bin, "search"}
	case "show":
		return []string{"sudo", bin, "info"}
	case "update":
		return []string{"sudo", bin, "upgrade", "--refresh"}
	case "upgrade":
		return []string{"sudo", bin, "upgrade"}
	default:
		return nil
	}
}

func GetApkPkgCommand(command string) []string {
	bin := "apk"

	switch command {
	case "autoremove":
		return []string{"echo", "Not implemented yet! "}
	case "clean":
		return []string{"echo", "Not implemented yet! "}
	case "install":
		return []string{"sudo", bin, "add"}
	case "list":
		return []string{"sudo", bin, "list"}
	case "purge":
		return []string{"sudo", bin, "del"}
	case "remove":
		return []string{"sudo", bin, "del"}
	case "search":
		return []string{"sudo", bin, "search"}
	case "show":
		return []string{"sudo", bin, "info"}
	case "update":
		return []string{"sudo", bin, "update"}
	case "upgrade":
		return []string{"sudo", bin, "upgrade", "--available"}
	default:
		return nil
	}
}

func GetZypperPkgCommand(command string) []string {
	bin := "zypper"

	switch command {
	case "autoremove":
		return []string{"echo", "Not implemented yet! "}
	case "clean":
		return []string{"sudo", bin, "clean"}
	case "install":
		return []string{"sudo", bin, "install"}
	case "list":
		return []string{"sudo", bin, "pa"}
	case "purge":
		return []string{"sudo", bin, "remove"}
	case "remove":
		return []string{"sudo", bin, "remove"}
	case "search":
		return []string{"sudo", bin, "search"}
	case "show":
		return []string{"sudo", bin, "info"}
	case "update":
		return []string{"sudo", bin, "update"}
	case "upgrade":
		return []string{"sudo", bin, "update"}
	default:
		return nil
	}
}

func GetXbpsPkgCommand(command string) []string {

	switch command {
	case "autoremove":
		return []string{"sudo", "xbps-remove", "-oO"}
	case "clean":
		return []string{"sudo", "xbps-remove", "-O"}
	case "install":
		return []string{"sudo", "xbps-install", "-S"}
	case "list":
		return []string{"sudo", "xbps-query", "-l"}
	case "purge":
		return []string{"sudo", "xbps-remove", "-R"}
	case "remove":
		return []string{"sudo", "xbps-remove"}
	case "search":
		return []string{"sudo", "xbps-query", "-Rs"}
	case "show":
		return []string{"sudo", "xbps-query", "-RS"}
	case "update":
		return []string{"sudo", "xbps-install", "-Su"}
	case "upgrade":
		return []string{"sudo", "xbps-install", "-Su"}
	default:
		return nil
	}
}

func (c *Container) IsPackageInstalled(pkgname string) (bool, error) {
	var query_cmd string
	switch c.containerType {
	case APT:
		query_cmd = "dpkg -s"
	case AUR:
		query_cmd = "yay -Qi"
	case DNF:
		query_cmd = "rpm -q"
	case APK:
		query_cmd = "apk -e info"
	case ZYPPER:
		query_cmd = "rpm -q"
	case XBPS:
		query_cmd = "xbps-query"
	default:
		return false, errors.New("Cannot query package from unknown container")
	}

	query_check_str := fmt.Sprintf("if $(%s %s >/dev/null 2>/dev/null); then echo true; else echo false; fi", query_cmd, pkgname)

	result, err := c.Output("sh", "-c", query_check_str)
	if err != nil {
		return false, err
	}

	result_bool, err := strconv.ParseBool(string(result[:len(result)-1]))
	if err != nil {
		return false, err
	}

	return result_bool, nil
}

func (c *Container) BinariesProvidedByPackage(pkgname string) ([]string, error) {
	var query_cmd string
	switch c.containerType {
	case AUR:
		query_cmd = "pacman -Ql %s | grep /usr/bin/. | cut -f 4 -d /"
	case APT:
		query_cmd = "dpkg -L %s | grep /usr/bin/ | cut -f 4 -d /"
	case DNF:
		query_cmd = "rpm -ql %s | grep /usr/bin/ | cut -f 4 -d /"
	case APK:
		query_cmd = "apk info -L %s | grep usr/bin/ | cut -f 3 -d /"
	case ZYPPER:
		query_cmd = "rpm -ql %s | grep /usr/bin/ | cut -f 4 -d /"
	case XBPS:
		query_cmd = "xbps-query -f %s | grep /usr/bin/ | cut -f 4 -d /"
	default:
		return []string{}, errors.New("Cannot query package from unknown container")
	}

	query_check_str := fmt.Sprintf(query_cmd, pkgname)
	result, err := c.Output("sh", "-c", query_check_str)
	if err != nil {
		return []string{}, err
	}

	binaries := []string{}
	for _, line := range strings.Split(result, "\n") {
		if line != "" {
			binaries = append(binaries, line)
		}
	}

	return binaries, nil
}

func GetArchLocales(c *Container) ([]string, error) {
	var locales []string

	out, err := c.Output("locale")
	if err != nil {
		return nil, err
	}

	// Find all unique entries given by the output
	lines := strings.Split(out, "\n")
	for _, line := range lines {
		_, locale, found := strings.Cut(line, "=")
		if !found {
			continue
		}

		trimmed_locale := strings.Trim(locale, "\"")
		unique := true
		for _, loc := range locales {
			if loc == trimmed_locale {
				unique = false
				break
			}
		}

		if unique {
			locales = append(locales, trimmed_locale)
		}
	}

	return locales, nil
}

func InstallArchLocales(c *Container, locales []string) error {
	// Modify /etc/locale.gen to uncomment all entries
	for _, locale := range locales {
		if locale == "" {
			continue
		}

		escaped_locale := regexp.QuoteMeta(locale)
		replace_pattern := fmt.Sprintf("'s/#%s/%s/'", escaped_locale, escaped_locale)

		if err := c.Run("sh", "-c", fmt.Sprintf("sudo sed -r -i %s /etc/locale.gen", replace_pattern)); err != nil {
			return err
		}
	}

	if _, err := c.Output("sudo", "locale-gen"); err != nil {
		return err
	}

	return nil
}
