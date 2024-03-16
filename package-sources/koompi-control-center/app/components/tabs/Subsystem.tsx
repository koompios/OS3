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

const Subsystem = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Linux Subsystem</CardTitle>
        <CardDescription>
          You have the freedom to select the container based on your
          personal preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Table>
          <TableCaption>
            lists of your installed applications.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center">
                Container
              </TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead className="text-end justify-end "></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">ArchLinux</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">
                <Button
                  className="bg-green-900"
                  onClick={() =>
                    executeCommand(
                      'gnome-terminal -e /usr/lib/pix/distrobox enter pix_managed_aur'
                    )
                  }
                >
                  Launch
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Debian</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">
                <Button
                  className="bg-orange-400"
                  onClick={() =>
                    executeCommand(
                      'gnome-terminal -e /usr/lib/pix/distrobox enter pix_managed_apt'
                    )
                  }
                >
                  Launch
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Fedora</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">
                <Button
                  className="bg-slate-900"
                  onClick={() =>
                    executeCommand(
                      'gnome-terminal -e /usr/lib/pix/distrobox enter pix_managed_dns'
                    )
                  }
                >
                  Launch
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Alpine</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">
                <Button
                  className="bg-sky-700"
                  onClick={() =>
                    executeCommand(
                      'gnome-terminal -e /usr/lib/pix/distrobox enter pix_managed_apk'
                    )
                  }
                >
                  Launch
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Subsystem;
