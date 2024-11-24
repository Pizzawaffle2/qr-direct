// File: src/components/forms/wifi-form.tsx
'use client';

import * as z from 'zod';
import {useForm } from 'react-hook-form';
import {zodResolver } from '@hookform/resolvers/zod';
import {Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input } from '@/components/ui/input';
import {Button } from '@/components/ui/button';
import {Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Switch } from '@/components/ui/switch';
import {useState } from 'react';
import {useToast } from '@/components/ui/use-toast';
import {useHistoryStore } from '@/lib/store/history-store';
import {motion } from 'framer-motion';
import {Loader2, Download, RefreshCcw, Save, Wifi, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import {TemplateDialog } from '../ui/template-dialog';
import {UnifiedStyleForm } from '../ui/unified-style-form';
import {QRStyleSchema, defaultStyleValues } from '@/lib/types/qr-styles';
import {QRPreview } from '@/components/ui/preview';
import {QRGenerator } from '@/components/ui/qr-generator';
import {Card } from '@/components/ui/card';
import {Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// WiFi Form
const getPreviewData = () => {
  const title = form.watch('title');
  const ssid = form.watch('ssid');
  const encryption = form.watch('encryption');
  const password = form.watch('password');
  const hidden = form.watch('hidden');

  if (!ssid) {
    return null;
  }

  return {
    type: 'wifi' as const,
    title: title || 'WiFi QR Code',
    ssid,
    encryption,
    password,
    hidden,
  };
};

// WiFi Form Schema
const wifiFormSchema = z.object({
  title: z.string().optional(),
  ssid: z.string().min(1, 'Network name is required'),
  encryption: z.enum(['WPA2', 'WPA', 'WEP', 'nopass']),
  password: z.string().optional(),
  hidden: z.boolean().default(false),
  style: QRStyleSchema,
});

type WiFiFormValues = z.infer<typeof wifiFormSchema>;

const defaultValues: WiFiFormValues = {
  title: '',
  ssid: '',
  encryption: 'WPA2',
  password: '',
  hidden: false,
  style: defaultStyleValues,
};

interface WiFiFormProps {
  onSubmit?: (data: WiFiFormValues) => void;
}

export function WiFiForm({ onSubmit: externalSubmit }: WiFiFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { addToHistory } = useHistoryStore();

  const form = useForm<WiFiFormValues>({
    resolver: zodResolver(wifiFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: WiFiFormValues) => {
    if (externalSubmit) {
      externalSubmit(data);
      return;
    }

    try {
      setIsGenerating(true);
      const qrCodeData = {
        id: crypto.randomUUID(),
        type: 'wifi' as const,
        title: data.title,
        ssid: data.ssid,
        encryption: data.encryption,
        password: data.password,
        hidden: data.hidden,
        created: new Date(),
      };

      const qrCodeUrl = await QRGenerator.generateQR(qrCodeData, data.style);
      setQrCode(qrCodeUrl);

      addToHistory({
        ...qrCodeData,
        url: qrCodeUrl,
      });

      toast({
        title: 'Success',
        description: 'WiFi QR code generated successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate QR code',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    form.reset(defaultValues);
    setQrCode(null);
  };

  const handleDownload = () => {
    if (!qrCode) return;
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `${form.getValues().title || 'wifi-qr-code'}.png`;
    link.click();

    toast({
      title: 'Downloaded!',
      description: 'QR code has been downloaded successfully.',
    });
  };

  const showPasswordField = form.watch('encryption') !== 'nopass';

  return (
    <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-[1fr,400px]">
      <div className="space-y-8">
        <Card className="border-slate-800/50 bg-slate-900/50">
          <div className="space-y-8 p-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <Wifi className="h-5 w-5" />
              <h2 className="text-lg font-medium">WiFi QR Code</h2>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="QR Code Title"
                          {...field}
                          className="border-slate-800 bg-slate-900/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="ssid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Network Name (SSID)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Wifi className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Your WiFi Network"
                              {...field}
                              className="border-slate-800 bg-slate-900/50 pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="encryption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security Type</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="border-slate-800 bg-slate-900/50">
                              <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                              <SelectValue placeholder="Select security type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="WPA2">WPA/WPA2</SelectItem>
                            <SelectItem value="WPA">WPA</SelectItem>
                            <SelectItem value="WEP">WEP</SelectItem>
                            <SelectItem value="nopass">No Security</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {showPasswordField && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Network Password"
                              {...field}
                              className="border-slate-800 bg-slate-900/50 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="hidden"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0 rounded-lg border border-slate-800 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Hidden Network</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Enable if your WiFi network is hidden
                        </p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 gap-4 bg-slate-900/50 p-1">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="style">Style</TabsTrigger>
                    <TabsTrigger value="logo">Logo</TabsTrigger>
                  </TabsList>

                  <div className="mt-4 space-y-4">
                    <UnifiedStyleForm
                      value={form.watch('style')}
                      onChange={(style) => form.setValue('style&apos;, style)}
                    />
                  </div>
                </Tabs>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      &apos;Generate QR Code'
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleReset}>
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <QRPreview
          data={{
            type: 'wifi',
            title: form.watch('title'),
            ssid: form.watch('ssid'),
            encryption: form.watch('encryption'),
            password: form.watch('password'),
            hidden: form.watch('hidden'),
          }}
          style={form.watch('style')}
          isGenerating={isGenerating}
        />

        {qrCode && !externalSubmit && (
          <Card className="border-slate-800/50 bg-slate-900/50 p-4">
            <div className="flex gap-3">
              <Button onClick={handleDownload} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" onClick={() => setIsTemplateDialogOpen(true)}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}
      </div>

      <TemplateDialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        onSave={async (template) => {
          try {
            // Save template logic here
            toast({
              title: 'Success',
              description: 'Template saved successfully!',
            });
            setIsTemplateDialogOpen(false);
          } catch (_error) {
            toast({
              title: 'Error',
              description: 'Failed to save template',
              variant: 'destructive',
            });
          }
        }}
        style={form.watch(&apos;style&apos;)}
      />
    </div>
  );
}
