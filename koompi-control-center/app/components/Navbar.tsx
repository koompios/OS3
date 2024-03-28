import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import Subsystem from './tabs/Subsystem';

import React from 'react';
import Appearance from './tabs/Appearance/Appearance';
import Android from './tabs/Android/Android';
import Driver from './tabs/Driver/Driver';
import Update from './tabs/Update/Update';
// import README from './tabs/README';

const Navbar = () => {
  return (
    <div>
      <Tabs defaultValue="Subsystem" className="w-[600px]">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="Subsystem">Subsystem</TabsTrigger>
          <TabsTrigger value="Android">Android</TabsTrigger>
          <TabsTrigger value="Appearance">Appearance</TabsTrigger>
          <TabsTrigger value="Driver">Driver</TabsTrigger>
          <TabsTrigger value="Update">Update</TabsTrigger>
          {/* <TabsTrigger value="README">README</TabsTrigger> */}
        </TabsList>
        <TabsContent value="Subsystem">
          <Subsystem />
        </TabsContent>
        <TabsContent value="Android">
          <Android />
        </TabsContent>
        <TabsContent value="Appearance">
          <Appearance />
        </TabsContent>
        <TabsContent value="Driver">
          <Driver />
        </TabsContent>
        <TabsContent value="Update">
          <Update />
        </TabsContent>
        {/* <TabsContent value="README">
          <README />
        </TabsContent> */}

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be
                logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Navbar;
