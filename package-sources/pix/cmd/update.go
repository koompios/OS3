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
	"github.com/koompi-os/pix/core"
	"github.com/koompi-os/orchid/cmdr"
)

func NewUpdateCommand() *cmdr.Command {
	cmd := cmdr.NewCommand("update",
		pix.Trans("update.long"),
		pix.Trans("update.short"),
		update).WithBoolFlag(
		cmdr.NewBoolFlag(
			"all",
			"a",
			pix.Trans("pix.allFlag"),
			false,
		)).WithBoolFlag(
		cmdr.NewBoolFlag(
			"assume-yes",
			"y",
			pix.Trans("pix.assumeYes"),
			false,
		))

	return cmd
}

func update(cmd *cobra.Command, args []string) error {
	if cmd.Flag("nix").Changed {
		return errors.New(pix.Trans("pix.notForNix"))

	}
	if cmd.Flag("all").Changed {
		var flags []string
		if cmd.Flag("assume-yes").Changed {
			flags = append(flags, "-y")
		}

		if err := core.ApplyForAll("update", flags); err != nil {
			return err
		}

		return nil
	}

	command := append([]string{}, container.GetPkgCommand("update")...)
	command = append(command, args...)

	if cmd.Flag("assume-yes").Changed {
		command = append(command, "-y")
	}

	container.Run(command...)

	return nil
}
