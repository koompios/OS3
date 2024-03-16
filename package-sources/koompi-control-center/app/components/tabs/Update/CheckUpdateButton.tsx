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

const CheckUpdateButton = () => {
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

    let response = '';

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
        // Check for updates
        const updateResponse = (await invoke('execute_command', {
          command: `echo ${password} | sudo -S /usr/bin/pacman -Sy --noconfirm koompi-os`,
        })) as string;

        if (updateResponse.includes('is up to date')) {
          console.log('No newer version available');
          toast.info('No newer version available.');
          // Handle case when no newer version is available (e.g., show toast message)
        } else {
          console.log('Newer version available');
          // Proceed with the installation/update logic
          const installResponse = (await invoke('execute_command', {
            command: `echo ${password} | sudo -S /usr/bin/pacman -Sy --noconfirm koompi-os`,
          })) as string;

          if (installResponse.includes('error')) {
            console.log('Installation failed');
            toast.error('Installation failed. Please try again.');
            // Handle installation failure here (e.g., show error message)
          } else {
            console.log('Installation successful');
            toast.success(
              // 'The update has been installed/updated successfully.'
              'You have successfully upgraded your system into the latest version.'
            );
            // Add any additional logic or handling here
          }
        }
      } else {
        console.log('Incorrect sudo password');
        // Clear the input field
        passwordInput.value = '';
      }
    } catch (error) {
      console.error(`Error executing Linux command: ${error}`);
      toast.error(
        'Encountered an issue while checking. Please retry.'
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
            <DialogTitle>Enter Your Password</DialogTitle>
            <DialogDescription>
              To proceed with the operation, your password is
              required. Upon pressing Enter, the system will initiate
              the update process if a newer version is available.
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

export default CheckUpdateButton;
