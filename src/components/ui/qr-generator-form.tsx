'use client';

import {useState } from 'react';
import {useForm } from 'react-hook-form';
import {zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {useQRCode } from '@/hooks/use-qr-code';
import {Button } from '@/components/ui/button';
import {Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input } from '@/components/ui/input';
import {Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {QRCodeType } from '@/lib/types/qr-code';

const formSchema = z.object({
  type: z.enum(['url', 'text', 'email', 'phone', 'wifi', 'vcard']),
  content: z.string().min(1, 'Content is required'),
  title: z.string().optional(),
  backgroundColor: z.string().optional(),
  foregroundColor: z.string().optional(),
});

export function QRCodeGeneratorForm() {
  const { generateQRCode, isGenerating, error, qrCode } = useQRCode();
  const [selectedType, setSelectedType] = useState<QRCodeType>('url');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'url',
      content: '',
      backgroundColor: '#ffffff',
      foregroundColor: '#000000',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await generateQRCode({
        id: crypto.randomUUID(),
        created: new Date(),
        ...values,
      });
    } catch (err) {
      console.error('Error generating QR code:&apos;, err);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>QR Code Type</FormLabel>
                <Select
                  onValueChange={(value: QRCodeType) => {
                    field.onChange(value);
                    setSelectedType(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select QR code type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="wifi">WiFi</SelectItem>
                    <SelectItem value="vcard">vCard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Input placeholder={getPlaceholder(selectedType)} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="backgroundColor"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Background Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="foregroundColor"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Foreground Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isGenerating}>
            {isGenerating ? &apos;Generating...' : 'Generate QR Code'}
          </Button>
        </form>
      </Form>

      {error && <div className="mt-4 rounded bg-red-50 p-4 text-red-600">{error}</div>}

      {qrCode && (
        <div className="mt-6 flex flex-col items-center">
          <img src={qrCode} alt="Generated QR Code" className="max-w-xs" />
          <Button onClick={() => window.open(qrCode, &apos;_blank&apos;)} className="mt-4">
            Download QR Code
          </Button>
        </div>
      )}
    </div>
  );
}

function getPlaceholder(type: QRCodeType): string {
  switch (type) {
    case 'url':
      return 'https://example.com';
    case 'email':
      return 'example@email.com';
    case 'phone':
      return '+1234567890';
    case 'wifi':
      return 'Enter WiFi details';
    case 'vcard':
      return 'Enter contact details';
    default:
      return 'Enter content';
  }
}
