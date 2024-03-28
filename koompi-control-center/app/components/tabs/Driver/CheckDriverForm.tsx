'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import CheckNvidiaButton from './CheckNvidiaButton';
import CheckAMDButton from './CheckAMDButton';

const FormSchema = z.object({
  nvidia_driver: z.boolean().default(false).optional(),
  amd_driver: z.boolean().default(false).optional(),
});

export function CheckDriverForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nvidia_driver: false,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(data, null, 2)}
          </code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6"
      >
        <div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nvidia_driver"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      NVIDIA
                    </FormLabel>
                    <FormDescription>
                      Install or Update the driver
                    </FormDescription>
                  </div>
                  <FormControl>
                    <CheckNvidiaButton />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amd_driver"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">AMD</FormLabel>
                    <FormDescription>
                      Install or Update the driver
                    </FormDescription>
                  </div>
                  <FormControl>
                    <CheckAMDButton />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
