'use client';
import { Button } from '@/components/ui/button';

import React, { useState, useEffect } from 'react';

import { invoke } from '@tauri-apps/api/tauri';

const Install_Fdroid = () => {
  const [buttonText, setButtonText] = useState('Install');
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check the installation state when the component mounts
    const storedInstallation = localStorage.getItem('isInstalled');
    if (storedInstallation === 'true') {
      setIsInstalled(true);
      setButtonText('Installed');
    }
  }, []);

  const executeCommand = async (command: string) => {
    try {
      const result = await invoke('execute_command', {
        command: command,
      });
      console.log('Command result:', result);
      return true; // Indicate success
    } catch (error) {
      console.error('Error executing command:', error);
      return false; // Indicate failure
    }
  };

  const checkInternetConnection = () => {
    // You can replace this logic with your own check for internet connection
    const isConnected = navigator.onLine;

    if (!isConnected) {
      alert(
        'No internet connection. Please connect to the internet.'
      );
      return false;
    }

    return true;
  };

  const handleButtonClick = async (cmd: string) => {
    if (checkInternetConnection()) {
      setButtonText('Installing');

      const initializationSuccess = await executeCommand(cmd);

      setTimeout(() => {
        setIsInstalled(initializationSuccess);
        setButtonText(initializationSuccess ? 'Installed' : 'Failed');
        // Save the initialization state to localStorage
        localStorage.setItem(
          'isInstalled',
          initializationSuccess.toString()
        );
      }, 15000); // 15 seconds
    }
  };
  return (
    <Button
      onClick={() => handleButtonClick('bash -c wpm install fdroid')}
      className="bg-green-700"
    >
      {buttonText}
      {isInstalled}
    </Button>
  );
};

export default Install_Fdroid;
