'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { invoke } from '@tauri-apps/api/tauri';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import CheckUpdateButton from './CheckUpdateButton';
import { useEffect } from 'react';

const FormSchema = z.object({
  auto_update: z.boolean().default(false).optional(),
  beta_update: z.boolean(),
});

export function SwitchForm() {
  const storedAutomaticUpdate = localStorage.getItem(
    'automaticUpdateEnabled'
  );
  const defaultValues = {
    auto_update: storedAutomaticUpdate
      ? storedAutomaticUpdate === 'true'
      : false,
    beta_update: false,
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  // Update local storage when the form value changes
  useEffect(() => {
    const autoUpdateValue = form.getValues('auto_update');
    if (autoUpdateValue !== undefined) {
      localStorage.setItem(
        'automaticUpdateEnabled',
        autoUpdateValue.toString()
      );
    }
  }, [form.getValues('auto_update')]);

  function handleAutomaticUpdateToggle(checked: boolean) {
    form.setValue('auto_update', checked);
    const command = checked
      ? 'systemctl --user enable automatic-update.service --now'
      : 'systemctl --user disable automatic-update.service';
    invoke('execute_command', { command });
    console.log('Running command:', command);
  }

  function handleBetaUpdateToggle(checked: boolean) {
    form.setValue('beta_update', checked);
    const command = checked
      ? 'systemctl --user enable beta-update.service --now'
      : 'systemctl --user disable beta-update.service';
    invoke('execute_command', { command });
    console.log('Running command:', command);
  }

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
              name="auto_update"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-bold">
                      Automatic Update
                    </FormLabel>
                    <FormDescription>
                      Receive software updates automatically and
                      update in the background.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        handleAutomaticUpdateToggle(checked);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="beta_update"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-bold">
                      Beta Update
                    </FormLabel>
                    <FormDescription>
                      Receive upcoming feature updates before release
                      to stable.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        handleBetaUpdateToggle(checked);
                      }}
                      disabled
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="auto_update"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-bold">
                      Check for Update
                    </FormLabel>
                    <FormDescription>
                      Check the latest version of KOOMPI OS and
                      upgrade.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <CheckUpdateButton />
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
