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

func NewEnterCommand() *cmdr.Command {
	cmd := cmdr.NewCommand(
		"enter",
		pix.Trans("enter.long"),
		pix.Trans("enter.short"),
		enter,
	)
	return cmd
}

func enter(cmd *cobra.Command, args []string) error {
	if cmd.Flag("nix").Changed {
		return errors.New(pix.Trans("pix.notForNix"))

	}
	if err := container.Enter(); err != nil {
		cmdr.Error.Println(pix.Trans("enter.failedEnter"), err)
		return err
	}

	cmdr.Info.Println(pix.Trans("enter.outside"))
	return nil
}
