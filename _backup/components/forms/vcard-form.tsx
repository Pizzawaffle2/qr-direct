'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useHistoryStore } from '@/lib/store/history-store';
import {
  Loader2,
  Download,
  RefreshCcw,
  Save,
  User,
  Briefcase,
  Phone,
  Mail,
  Globe,
  MapPin,
  FileText,
} from 'lucide-react';
import { TemplateDialog } from '../template/template-dialog';
import { UnifiedStyleForm } from '../qr-code/unified-style-form';
import { QRStyleSchema, defaultStyleValues } from '@/lib/types/qr-styles';
import { QRPreview } from '@/components/qr-code/preview';
import { QRGenerator } from '@/components/qr-code/qr-generator';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const QR_TYPE = 'vcard' as const;

const vcardFormSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  organization: z.string().optional(),
  jobTitle: z.string().optional(),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  address: z.string().optional(),
  note: z.string().optional(),
  style: QRStyleSchema,
});

type VCardFormValues = z.infer<typeof vcardFormSchema>;

const defaultValues: VCardFormValues = {
  title: '',
  firstName: '',
  lastName: '',
  organization: '',
  jobTitle: '',
  email: '',
  phone: '',
  mobile: '',
  website: '',
  address: '',
  note: '',
  style: defaultStyleValues,
};

interface VCardFormProps {
  onSubmit?: (data: VCardFormValues) => void;
}

export function VCardForm({ onSubmit: externalSubmit }: VCardFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const { toast } = useToast();
  const { addToHistory } = useHistoryStore();

  const form = useForm<VCardFormValues>({
    resolver: zodResolver(vcardFormSchema),
    defaultValues,
  });

  const getPreviewData = () => {
    const title = form.watch('title');
    const firstName = form.watch('firstName');
    const lastName = form.watch('lastName');

    if (!firstName && !lastName) {
      return null;
    }

    return {
      type: QR_TYPE,
      title: title || 'Contact QR Code',
      firstName,
      lastName,
      organization: form.watch('organization'),
      jobTitle: form.watch('jobTitle'),
      email: form.watch('email'),
      phone: form.watch('phone'),
      mobile: form.watch('mobile'),
      website: form.watch('website'),
      address: form.watch('address'),
      note: form.watch('note'),
    };
  };

  const onSubmit = async (data: VCardFormValues) => {
    if (externalSubmit) {
      externalSubmit(data);
      return;
    }

    try {
      setIsGenerating(true);
      const qrCodeData = {
        id: crypto.randomUUID(),
        type: QR_TYPE,
        title: data.title || 'Contact QR Code',
        firstName: data.firstName,
        lastName: data.lastName,
        organization: data.organization,
        jobTitle: data.jobTitle,
        email: data.email,
        phone: data.phone,
        mobile: data.mobile,
        website: data.website,
        address: data.address,
        note: data.note,
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
        description: 'Contact QR code generated successfully!',
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
    link.download = `${form.getValues().title || 'contact-qr-code'}.png`;
    link.click();

    toast({
      title: 'Downloaded!',
      description: 'QR code has been downloaded successfully.',
    });
  };

  const formContent = (
    <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-[1fr,400px]">
      <div className="space-y-8">
        <Card className="border-slate-800/50 bg-slate-900/50">
          <div className="space-y-8 p-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <User className="h-5 w-5" />
              <h2 className="text-lg font-medium">Contact QR Code</h2>
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
                          placeholder="Contact QR Code"
                          {...field}
                          className="border-slate-800 bg-slate-900/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 p-1">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="business">Business</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="additional">Additional</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="mt-4">
                    <Card className="border-slate-800">
                      <div className="space-y-4 p-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="John"
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
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Doe"
                                    {...field}
                                    className="border-slate-800 bg-slate-900/50"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="business" className="mt-4">
                    <Card className="border-slate-800">
                      <div className="space-y-4 p-6">
                        <FormField
                          control={form.control}
                          name="organization"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company/Organization (Optional)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                  <Input
                                    placeholder="Company Name"
                                    {...field}
                                    className="border-slate-800 bg-slate-900/50 pl-10"
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="jobTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Software Engineer"
                                  {...field}
                                  className="border-slate-800 bg-slate-900/50"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="contact" className="mt-4">
                    <Card className="border-slate-800">
                      <div className="space-y-4 p-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Work Phone (Optional)</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                      type="tel"
                                      placeholder="+1234567890"
                                      {...field}
                                      className="border-slate-800 bg-slate-900/50 pl-10"
                                    />
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="mobile"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mobile Phone (Optional)</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                      type="tel"
                                      placeholder="+1234567890"
                                      {...field}
                                      className="border-slate-800 bg-slate-900/50 pl-10"
                                    />
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email (Optional)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                  <Input
                                    type="email"
                                    placeholder="john@example.com"
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
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website (Optional)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                  <Input
                                    placeholder="https://example.com"
                                    {...field}
                                    className="border-slate-800 bg-slate-900/50 pl-10"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="additional" className="mt-4">
                    <Card className="border-slate-800">
                      <div className="space-y-4 p-6">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address (Optional)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Textarea
                                    placeholder="Enter address"
                                    {...field}
                                    className="min-h-[100px] resize-none border-slate-800 bg-slate-900/50 pl-10"
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="note"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes (Optional)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Textarea
                                    placeholder="Add additional notes"
                                    {...field}
                                    className="min-h-[100px] resize-none border-slate-800 bg-slate-900/50 pl-10"
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>

                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 gap-4 bg-slate-900/50 p-1">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="style">Style</TabsTrigger>
                    <TabsTrigger value="logo">Logo</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="mt-4">
                    <UnifiedStyleForm
                      value={form.watch('style')}
                      onChange={(style) => form.setValue('style', style)}
                    />
                  </TabsContent>

                  <TabsContent value="colors" className="mt-4">
                    <UnifiedStyleForm
                      value={form.watch('style')}
                      onChange={(style) => form.setValue('style', style)}
                    />
                  </TabsContent>

                  <TabsContent value="style" className="mt-4">
                    <UnifiedStyleForm
                      value={form.watch('style')}
                      onChange={(style) => form.setValue('style', style)}
                    />
                  </TabsContent>

                  <TabsContent value="logo" className="mt-4">
                    <UnifiedStyleForm
                      value={form.watch('style')}
                      onChange={(style) => form.setValue('style', style)}
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
                      'Generate QR Code'
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
          } catch (error) {
            toast({
              title: 'Error',
              description: 'Failed to save template',
              variant: 'destructive',
            });
          }
        }}
        style={form.watch('style')}
      />
    </div>
  );

  return formContent;
}
