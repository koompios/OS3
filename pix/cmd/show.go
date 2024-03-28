package cmd

/*	License: GPLv3
	Authors:
		Mirko Brombin <send@mirko.pm>
		Pietro di Caprio <pietro@fabricators.ltd>
	Copyright: 2023
	Description: pix is a wrapper around multiple package managers to install packages and run commands inside a managed container.
*/

import (
	"errors"
	"os"

	"github.com/spf13/cobra"
	"github.com/koompi-os/orchid/cmdr"
)

func NewShowCommand() *cmdr.Command {
	cmd := cmdr.NewCommand("show <package>",
		pix.Trans("show.long"),
		pix.Trans("show.short"),
		show).WithBoolFlag(
		cmdr.NewBoolFlag(
			"isinstalled",
			"i",
			pix.Trans("show.isInstalled"),
			false,
		),
	)

	cmd.Example = "pix show htop\npix show -i neovim"
	cmd.Args = cobra.ExactArgs(1)
	return cmd
}

func show(cmd *cobra.Command, args []string) error {
	if cmd.Flag("nix").Changed {
		return errors.New(pix.Trans("pix.notForNix"))

	}
	if cmd.Flag("isinstalled").Changed {
		result, err := container.IsPackageInstalled(args[0])
		if err != nil {
			return err
		}

		if result {
			cmdr.Info.Printf(pix.Trans("show.found", args[0]))
			os.Exit(0)
		} else {
			cmdr.Info.Printf(pix.Trans("show.notFound", args[0]))
			os.Exit(1)
		}

		return nil
	}

	command := append([]string{}, container.GetPkgCommand("show")...)
	command = append(command, args...)

	container.Run(command...)

	return nil
}
