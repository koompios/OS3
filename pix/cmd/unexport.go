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

func NewUnexportCommand() *cmdr.Command {
	cmd := cmdr.NewCommand("unexport",
		pix.Trans("unexport.long"),
		pix.Trans("unexport.short"),
		unexport).WithBoolFlag(
		cmdr.NewBoolFlag(
			"bin",
			"",
			pix.Trans("unexport.binFlag"),
			false,
		),
	)

	cmd.Args = cobra.ExactArgs(1)
	cmd.Example = "pix unexport code"
	return cmd
}

func unexport(cmd *cobra.Command, args []string) error {
	if cmd.Flag("nix").Changed {
		return errors.New(pix.Trans("pix.notForNix"))

	}
	if cmd.Flag("bin").Changed {
		bin_name := args[0]
		if err := container.RemoveBinary(bin_name, false); err != nil {
			return err
		}
		return nil
	} else {

		return container.RemoveDesktopEntry(args[0])
	}
}
