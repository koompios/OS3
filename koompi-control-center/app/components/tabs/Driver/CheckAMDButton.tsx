import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CheckAMDButton = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleButtonClick = () => {
    setIsDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog
  };

  const handleSubmit = async () => {
    setIsChecking(true);

    let response: string = '';

    try {
      // Get the entered password from the input field
      const passwordInput = document.getElementById(
        'password'
      ) as HTMLInputElement;
      const password = passwordInput.value;

      // Execute Linux command using Tauri
      const command = `echo ${password} | sudo -kS echo "password correct"`;
      response = (await invoke('execute_command', {
        command,
      })) as string;

      if (response.includes('password correct')) {
        console.log('Correct sudo password');
        // Proceed with the installation/update logic
        const installResponse = (await invoke('execute_command', {
          command:
            'echo ${password} | sudo -S /usr/bin/pacman -Sy --noconfirm mesa vulkan-radeon vulkan-tools',
        })) as string;

        if (installResponse.includes('error')) {
          console.log('Installation failed');
          toast.error('Installation failed. Please try again.');
          // Handle installation failure here (e.g., show error message)
        } else {
          console.log(password);
          toast.success(
            'The driver has been installed/updated successfully.'
          );
          // Add any additional logic or handling here
        }
      } else {
        console.log('Incorrect sudo password');
        // Clear the input field
        passwordInput.value = '';
      }
    } catch (error) {
      console.error(`Error executing Linux command: ${error}`);
      toast.error(
        'Encountered an issue while performing the installation check. Please retry.'
      );
      // Handle command execution failure here (e.g., show error message)
    } finally {
      setIsChecking(false);

      // Clear the input field
      const passwordInput = document.getElementById(
        'password'
      ) as HTMLInputElement;
      passwordInput.value = '';

      // Close the dialog if the password is correct
      if (response.includes('password correct')) {
        setIsDialogOpen(false);
      } else {
        toast.error('Incorrect password. Please try again.');
      }
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-blue-950 text-white"
            variant="outline"
            onClick={handleButtonClick}
          >
            {isChecking ? 'Checking...' : 'Check'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter sudo password</DialogTitle>
            <DialogDescription>
              In order to continue the operation, it does require your
              password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                className="col-span-3"
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="bg-blue-950"
              type="submit"
              onClick={handleSubmit}
              disabled={isChecking}
            >
              {isChecking ? 'Checking...' : 'Enter'}
            </Button>
            <Button
              className="text-gray-600"
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isChecking}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default CheckAMDButton;
