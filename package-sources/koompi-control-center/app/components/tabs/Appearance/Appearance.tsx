'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React, { useState } from 'react';
import LayoutSwitcher from './LayoutSwitcher';

const Appearance = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desktop Layout</CardTitle>
        <CardDescription>
          Switch effortlessly between two desktop layouts of your
          choice.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 flex justify-center">
        <LayoutSwitcher />
      </CardContent>
    </Card>
  );
};

export default Appearance;
