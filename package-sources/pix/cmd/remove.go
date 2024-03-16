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

func NewRemoveCommand() *cmdr.Command {
	cmd := cmdr.NewCommand("remove <packages>",
		pix.Trans("remove.long"),
		pix.Trans("remove.short"),
		remove).WithBoolFlag(
		cmdr.NewBoolFlag(
			"assume-yes",
			"y",
			pix.Trans("pix.assumeYes"),
			false,
		))

	cmd.Example = "pix remove htop"
	cmd.Args = cobra.MinimumNArgs(1)
	cmd.Flags().SetInterspersed(false)
	return cmd
}

func remove(cmd *cobra.Command, args []string) error {
	if cmd.Flag("nix").Changed {
		return removePackage(args)
	}
	command := append([]string{}, container.GetPkgCommand("remove")...)
	command = append(command, args...)

	if cmd.Flag("assume-yes").Changed {
		command = append(command, "-y")
	}

	for _, pkg := range args {
        binaries, err := container.BinariesProvidedByPackage(pkg)
        if err != nil {
            return err
        }

        for _, binary := range binaries {
            container.RemoveDesktopEntry(binary)

            err := container.RemoveBinary(binary, false)
            if err != nil {
                cmdr.Error.Printf("Error unexporting binary: %s\n", err)
                return err
            }
        }
	}

	err := container.Run(command...)
	if err != nil {
		return err
	}

	return nil
}

func removePackage(args []string) error {
	err := core.NixRemovePackage(args)
	if err != nil {
		return err
	}
	cmdr.Success.Println(pix.Trans("nixremove.success"))
	return nil

}
