'use client';
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
  TableCell,
  TableRow,
} from '@/components/ui/table';

import Initialize from './Initialize';
import Install_Fdroid from './Install_Fdroid';
import Install_Aurora from './Install_Aurora';
import Open_Settings from './Open_Setting';

const Android = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Android Support</CardTitle>
        <CardDescription>
          With the utilization of Waydroid, you have the flexibility
          to install Android applications according to your
          preference.
          <p className="text-2xl font-bold mt-4 text-black ">
            Initialize
          </p>
          <Table>
            <TableBody className="rounded-full border-red-500 bg-black text-white">
              <TableRow>
                <TableCell className="font-bold">Waydroid</TableCell>
                <p className="mt-7 ml-10 text-xs text-slate-500">
                  Initialize the android support
                </p>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">
                  <Initialize />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <p className="text-2xl font-bold mt-4 text-black ">
            Install a store
          </p>
        </CardDescription>
        <Table>
          <TableBody className="rounded-full border-red-500 bg-black text-white">
            <TableRow>
              <TableCell className="font-bold">
                Aurora Store
              </TableCell>
              <p className="mt-7 ml-10 text-xs text-slate-500">
                An opensource Google Play Store Client
              </p>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">
                <Install_Aurora />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">F-Droid</TableCell>
              <p className="mt-7 ml-10 text-xs text-slate-500">
                An installable catalogue of FOSS Android Applications.
              </p>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">
                <Install_Fdroid />
              </TableCell>
            </TableRow>
          </TableBody>

          {/* <Button className="bg-blue-500 mt-5 mb-5">
            Open Settings
          </Button> */}
          <Open_Settings />
        </Table>
        {/* <p className="text-2xl text-medium font-bold mt-10">
          Useful Information
        </p>
        <p className="text-xs text-slate-500 font-bold mt-2">
          Arm translation support is coming soon.
        </p> */}
      </CardHeader>
      <CardContent className="space-y-2"></CardContent>
    </Card>
  );
};

export default Android;
