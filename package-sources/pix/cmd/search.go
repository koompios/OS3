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

func NewSearchCommand() *cmdr.Command {
	cmd := cmdr.NewCommand("search",
		pix.Trans("search.long"),
		pix.Trans("search.short"),
		search)

	cmd.Example = "pix search neovim"
	return cmd
}

func search(cmd *cobra.Command, args []string) error {
	if cmd.Flag("nix").Changed {
		//return errors.New(pix.Trans("pix.notForNix"))
		return core.NixSearchPackage(args[0])

	}
	command := append([]string{}, container.GetPkgCommand("search")...)
	command = append(command, args...)

	container.Run(command...)

	return nil
}
