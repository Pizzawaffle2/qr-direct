// src/components/qr/forms/wifi-form.tsx
'use client';

import {useForm } from 'react-hook-form';
import {zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {Input } from '@/components/ui/input';
import {Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Switch } from '@/components/ui/switch';
import {QRCodeData } from '@/types/qr';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  ssid: z.string().min(1, 'Network name is required'),
  password: z.string(),
  networkType: z.enum(['WEP', 'WPA', 'nopass']),
  hidden: z.boolean().default(false),
});

interface WifiFormProps {
  value: Partial<QRCodeData>;
  onChange: (value: Partial<QRCodeData>) => void;
}

export function WifiForm({ value, onChange }: WifiFormProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: value.title || '',
      ssid: value.ssid || '',
      password: value.password || '',
      networkType: (value.networkType as 'WEP' | 'WPA' | 'nopass') || 'WPA',
      hidden: value.hidden || false,
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    onChange(data);
  };

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="WiFi Network" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ssid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network Name (SSID)</FormLabel>
              <FormControl>
                <Input placeholder="MyWiFiNetwork" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Network password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="networkType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Security Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select security type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">No Password</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hidden"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Hidden Network</FormLabel>
                <FormDescription>Enable if this is a hidden network</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
