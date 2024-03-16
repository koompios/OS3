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

func NewPurgeCommand() *cmdr.Command {
	cmd := cmdr.NewCommand("purge",
		pix.Trans("purge.long"),
		pix.Trans("purge.short"),
		purge)

	cmd.Example = "pix purge htop"
	cmd.Args = cobra.MinimumNArgs(1)
	return cmd
}

func purge(cmd *cobra.Command, args []string) error {
	if cmd.Flag("nix").Changed {
		return errors.New(pix.Trans("pix.notForNix"))

	}
	command := append([]string{}, container.GetPkgCommand("purge")...)
	command = append(command, args...)

	container.Run(command...)

	return nil
}
