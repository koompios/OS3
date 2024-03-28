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

	"github.com/spf13/cobra"
	"github.com/koompi-os/orchid/cmdr"
)

func NewListCommand() *cmdr.Command {
	cmd := cmdr.NewCommand(
		"list",
		pix.Trans("list.long"),
		pix.Trans("list.short"),
		list,
	).WithBoolFlag(
		cmdr.NewBoolFlag(
			"upgradable",
			"u",
			pix.Trans("list.upgradable"),
			false,
		)).WithBoolFlag(
		cmdr.NewBoolFlag(
			"installed",
			"i",
			pix.Trans("list.installed"),
			false,
		))

	cmd.Flags().SetInterspersed(false)

	return cmd
}

func list(cmd *cobra.Command, args []string) error {
	if cmd.Flag("nix").Changed {
		return errors.New(pix.Trans("pix.notForNix"))

	}
	command := append([]string{}, container.GetPkgCommand("list")...)

	if cmd.Flag("upgradable").Changed {
		command = append(command, "--upgradable")
	}
	if cmd.Flag("installed").Changed {
		command = append(command, "--installed")
	}

	command = append(command, args...)

	container.Run(command...)

	return nil
}
