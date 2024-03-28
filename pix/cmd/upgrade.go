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

func NewUpgradeCommand() *cmdr.Command {
	cmd := cmdr.NewCommand(
		"upgrade",
		pix.Trans("upgrade.long"),
		pix.Trans("upgrade.short"),
		upgrade).WithBoolFlag(
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
	cmd.Example = "pix upgrade"

	return cmd
}

func upgrade(cmd *cobra.Command, args []string) error {
	if cmd.Flag("nix").Changed {
		return upgradePackage(cmd, args)

	}
	if cmd.Flag("all").Changed {
		var flags []string
		if cmd.Flag("assume-yes").Changed {
			flags = append(flags, "-y")
		}

		if err := core.ApplyForAll("upgrade", flags); err != nil {
			return err
		}

		return nil
	}

	command := append([]string{}, container.GetPkgCommand("upgrade")...)
	command = append(command, args...)

	if cmd.Flag("assume-yes").Changed {
		command = append(command, "-y")
	}

	container.Run(command...)

	return nil
}

func upgradePackage(cmd *cobra.Command, args []string) error {
	if len(args) < 1 {
		return errors.New(pix.Trans("nixupgrade.atleastone"))
	}
	err := core.NixUpgradePackage(args[0])
	if err != nil {
		return err
	}
	cmdr.Success.Println(pix.Trans("nixupgrade.success"))
	return nil

}
