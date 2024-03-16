'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { invoke } from '@tauri-apps/api/tauri';

const executeCommand = async (command: string) => {
  try {
    const result = await invoke('execute_command', {
      command: command,
    });
    console.log('Command result:', result);
  } catch (error) {
    console.error('Error executing command:', error);
  }
};

const Open_Settings = () => {
  return (
    <Button
      className="bg-green-600 my-3"
      onClick={() => executeCommand('waydroid-settings')}
    >
      Open Settings
    </Button>
  );
};

export default Open_Settings;
