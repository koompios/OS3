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
	"github.com/koompi-os/orchid/cmdr"
)

func NewRunCommand() *cmdr.Command {
	cmd := cmdr.NewCommand("run",
		pix.Trans("run.long"),
		pix.Trans("run.short"),
		run)
	cmd.Flags().SetInterspersed(false)
	cmd.Example = "pix run htop"
	cmd.Args = cobra.MinimumNArgs(1)
	return cmd
}

func run(cmd *cobra.Command, args []string) error {
	if cmd.Flag("nix").Changed {
	    cmdr.Info.Println(pix.Trans("run.nixMsg"))
        return nil
	}
	container.Run(args...)

	return nil
}
