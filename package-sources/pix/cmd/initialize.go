package cmd

/*	License: GPLv3
	Authors:
		Mirko Brombin <send@mirko.pm>
		Pietro di Caprio <pietro@fabricators.ltd>
	Copyright: 2023
	Description: pix is a wrapper around multiple package managers to install packages and run commands inside a managed container.
*/

import (
	"github.com/spf13/cobra"
	"github.com/koompi-os/pix/core"
	"github.com/koompi-os/orchid/cmdr"
)

func NewInitializeCommand() *cmdr.Command {
	cmd := cmdr.NewCommand(
		"init",
		pix.Trans("init.long"),
		pix.Trans("init.short"),
		initialize,
	)

	cmd.Example = "pix init"
	return cmd
}

func initialize(cmd *cobra.Command, args []string) error {
	if cmd.Flag("nix").Changed {
		return initNix(cmd, args)
	}
	if container.Exists() {

		b, err := cmdr.Confirm.Show(pix.Trans("init.confirm"))

		if err != nil {
			return err
		}

		if !b {
			cmdr.Info.Println(pix.Trans("pix.cxl"))
			return nil
		}
	}

	if err := container.Remove(); err != nil {
		cmdr.Error.Printf(pix.Trans("init.remove"), err)
		return err
	}
	if err := container.Create(); err != nil {
		cmdr.Error.Printf(pix.Trans("init.create"), err)
		return err
	}

	return nil
}
func initNix(cmd *cobra.Command, args []string) error {
	// prompt for confirmation

	b, err := cmdr.Confirm.Show(pix.Trans("nixinit.confirm"))

	if err != nil {
		return err
	}

	if !b {
		cmdr.Info.Println(pix.Trans("pix.cxl"))
		return nil
	}
	err = core.NixInit()
	if err != nil {
		return err
	}
	cmdr.Success.Println(pix.Trans("nixinit.success"))
	return nil

}
