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
import {useState } from 'react';
import {useToast } from '@/components/ui/use-toast';
import {useHistoryStore } from '@/lib/store/history-store';
import {Loader2, Download, RefreshCcw, Save, Globe, Link } from 'lucide-react';
import {TemplateDialog } from '../ui/template-dialog';
import {UnifiedStyleForm } from '../ui/unified-style-form';
import {QRStyleSchema, defaultStyleValues } from '@/lib/types/qr-styles';
import {QRPreview } from '@/components/ui/preview';
import {QRGenerator } from '@/components/ui/qr-generator';
import {Card } from '@/components/ui/card';
import {Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const QR_TYPE = 'url' as const;

const urlFormSchema = z.object({
  title: z.string().optional(),
  url: z
    .string()
    .min(1, 'URL is required')
    .transform((url) => {
      let cleanUrl = url.replace(/^(https?:\/\/)/, '');
      cleanUrl = cleanUrl.replace(/^\/+/, '');
      return `https://${cleanUrl}`;
    }),
  style: QRStyleSchema,
});

type URLFormValues = z.infer<typeof urlFormSchema>;

const defaultValues: URLFormValues = {
  title: '',
  url: '',
  style: defaultStyleValues,
};

interface URLFormProps {
  onSubmit?: (data: URLFormValues) => void;
}

export function URLForm({ onSubmit: externalSubmit }: URLFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const { toast } = useToast();
  const { addToHistory } = useHistoryStore();

  const form = useForm<URLFormValues>({
    resolver: zodResolver(urlFormSchema),
    defaultValues,
  });

  const getPreviewData = () => {
    const title = form.watch('title');
    const url = form.watch('url');

    if (!url) {
      return null;
    }

    return {
      type: QR_TYPE,
      title: title || 'Website QR Code',
      url,
    };
  };

  const onSubmit = async (data: URLFormValues) => {
    if (externalSubmit) {
      externalSubmit(data);
      return;
    }

    try {
      setIsGenerating(true);
      const qrCodeData = {
        id: crypto.randomUUID(),
        type: QR_TYPE,
        title: data.title || 'Website QR Code',
        url: data.url,
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
        description: 'URL QR code generated successfully!',
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
    link.download = `${form.getValues().title || 'website-qr-code'}.png`;
    link.click();

    toast({
      title: 'Downloaded!',
      description: 'QR code has been downloaded successfully.&apos;,
    });
  };

  return (
    <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-[1fr,400px]">
      <div className="space-y-8">
        <Card className="border-slate-800/50 bg-slate-900/50">
          <div className="space-y-8 p-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <Globe className="h-5 w-5" />
              <h2 className="text-lg font-medium">URL QR Code</h2>
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
                          placeholder="Website QR Code"
                          {...field}
                          className="border-slate-800 bg-slate-900/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="example.com"
                            {...field}
                            className="border-slate-800 bg-slate-900/50 pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
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

                  <TabsContent value="basic" className="mt-4">
                    <UnifiedStyleForm
                      value={form.watch(&apos;style')}
                      onChange={(style) => form.setValue('style', style)}
                    />
                  </TabsContent>

                  <TabsContent value="colors" className="mt-4">
                    <UnifiedStyleForm
                      value={form.watch('style')}
                      onChange={(style) => form.setValue('style&apos;, style)}
                    />
                  </TabsContent>

                  <TabsContent value="style" className="mt-4">
                    <UnifiedStyleForm
                      value={form.watch(&apos;style')}
                      onChange={(style) => form.setValue('style', style)}
                    />
                  </TabsContent>

                  <TabsContent value="logo" className="mt-4">
                    <UnifiedStyleForm
                      value={form.watch('style')}
                      onChange={(style) => form.setValue('style&apos;, style)}
                    />
                  </TabsContent>
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
          data={getPreviewData()}
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
