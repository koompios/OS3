'use client';
import { Button } from '@/components/ui/button';

import React, { useState, useEffect } from 'react';

import { invoke } from '@tauri-apps/api/tauri';

const initialize = () => {
  const [buttonText, setButtonText] = useState('Initialize');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check the initialization state when the component mounts
    const storedInitialization =
      localStorage.getItem('isInitialized');
    if (storedInitialization === 'true') {
      setIsInitialized(true);
      setButtonText('Initialized');
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
      setButtonText('Initializing');

      const initializationSuccess = await executeCommand(cmd);

      setTimeout(() => {
        setIsInitialized(initializationSuccess);
        setButtonText(
          initializationSuccess ? 'Initialized' : 'Failed'
        );
        // Save the initialization state to localStorage
        localStorage.setItem(
          'isInitialized',
          initializationSuccess.toString()
        );
      }, 15000); // 15 seconds
    }
  };
  return (
    <Button
      onClick={() => handleButtonClick('gnome-terminal -e wpm init')}
      className="bg-orange-500"
    >
      {buttonText}
      {isInitialized}
    </Button>
  );
};

export default initialize;
