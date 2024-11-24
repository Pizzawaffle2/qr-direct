// File: src/components/qr-code/unified-style-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { QRStyleSchema, type QRStyle } from '@/lib/types/qr-styles';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageSelector } from './image-selector';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Palette, Grid, Image as ImageIcon, Sliders } from 'lucide-react';

interface UnifiedStyleFormProps {
  value: QRStyle;
  onChange: (value: QRStyle) => void;
}

export function UnifiedStyleForm({ value, onChange }: UnifiedStyleFormProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm<QRStyle>({
    resolver: zodResolver(QRStyleSchema),
    defaultValues: value,
  });

  const handleFormChange = () => {
    const values = form.getValues();
    onChange(values);
  };

  return (
    <Form {...form}>
      <form onChange={handleFormChange} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Sliders className="h-4 w-4" />
              <span className="hidden sm:inline">Basic</span>
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Colors</span>
            </TabsTrigger>
            <TabsTrigger value="style" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              <span className="hidden sm:inline">Style</span>
            </TabsTrigger>
            <TabsTrigger value="logo" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Logo</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Slider
                            min={100}
                            max={1000}
                            step={10}
                            value={[field.value]}
                            onValueChange={([value]) => field.onChange(value)}
                          />
                          <div className="text-right text-sm text-muted-foreground">
                            {field.value}px
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="margin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Margin</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Slider
                            min={0}
                            max={50}
                            step={1}
                            value={[field.value]}
                            onValueChange={([value]) => field.onChange(value)}
                          />
                          <div className="text-right text-sm text-muted-foreground">
                            {field.value} blocks
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="errorCorrectionLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Error Correction</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select error correction level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="L">Low (7%)</SelectItem>
                          <SelectItem value="M">Medium (15%)</SelectItem>
                          <SelectItem value="Q">Quartile (25%)</SelectItem>
                          <SelectItem value="H">High (30%)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Higher levels make the code more reliable but larger
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle>Color Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="colorScheme.background"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background Color</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input type="color" className="h-10 w-12 p-1" {...field} />
                            <Input
                              type="text"
                              value={field.value}
                              onChange={field.onChange}
                              className="font-mono"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="colorScheme.foreground"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>QR Code Color</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input type="color" className="h-10 w-12 p-1" {...field} />
                            <Input
                              type="text"
                              value={field.value}
                              onChange={field.onChange}
                              className="font-mono"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="colorScheme.gradient"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel>Use Gradient</FormLabel>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              checked
                                ? {
                                    type: 'linear',
                                    start: form.getValues('colorScheme.foreground'),
                                    end: '#000000',
                                    direction: 90,
                                  }
                                : undefined
                            )
                          }
                        />
                      </div>

                      {field.value && (
                        <div className="space-y-4">
                          <Select
                            value={field.value.type}
                            onValueChange={(value) =>
                              field.onChange({
                                ...field.value,
                                type: value as 'linear' | 'radial',
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gradient type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="linear">Linear</SelectItem>
                              <SelectItem value="radial">Radial</SelectItem>
                            </SelectContent>
                          </Select>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <Label>Start Color</Label>
                              <div className="mt-2 flex gap-2">
                                <Input
                                  type="color"
                                  value={field.value.start}
                                  onChange={(e) =>
                                    field.onChange({
                                      ...field.value,
                                      start: e.target.value,
                                    })
                                  }
                                  className="h-10 w-12 p-1"
                                />
                                <Input
                                  type="text"
                                  value={field.value.start}
                                  onChange={(e) =>
                                    field.onChange({
                                      ...field.value,
                                      start: e.target.value,
                                    })
                                  }
                                  className="font-mono"
                                />
                              </div>
                            </div>

                            <div>
                              <Label>End Color</Label>
                              <div className="mt-2 flex gap-2">
                                <Input
                                  type="color"
                                  value={field.value.end}
                                  onChange={(e) =>
                                    field.onChange({
                                      ...field.value,
                                      end: e.target.value,
                                    })
                                  }
                                  className="h-10 w-12 p-1"
                                />
                                <Input
                                  type="text"
                                  value={field.value.end}
                                  onChange={(e) =>
                                    field.onChange({
                                      ...field.value,
                                      end: e.target.value,
                                    })
                                  }
                                  className="font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          {field.value.type === 'linear' && (
                            <FormItem>
                              <FormLabel>Direction</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Slider
                                    min={0}
                                    max={360}
                                    step={1}
                                    value={[field.value.direction || 0]}
                                    onValueChange={([value]) =>
                                      field.onChange({
                                        ...field.value,
                                        direction: value,
                                      })
                                    }
                                  />
                                  <div className="text-right text-sm text-muted-foreground">
                                    {field.value.direction || 0}°
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="style">
            <Card>
              <CardHeader>
                <CardTitle>Style Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="pattern"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pattern Style</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pattern style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="squares">Squares</SelectItem>
                          <SelectItem value="dots">Dots</SelectItem>
                          <SelectItem value="rounded">Rounded</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cornerSquareStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corner Style</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select corner style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="dot">Dot</SelectItem>
                          <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cornerDotStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corner Dot Style</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select corner dot style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="dot">Dot</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logo">
            <Card>
              <CardHeader>
                <CardTitle>Logo Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel>Add Logo</FormLabel>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              checked
                                ? {
                                    image: '',
                                    size: 50,
                                    margin: 5,
                                  }
                                : undefined
                            )
                          }
                        />
                      </div>

                      {field.value && (
                        <div className="space-y-6">
                          <ImageSelector
                            selectedImage={field.value.image}
                            onImageSelect={(image) =>
                              field.onChange({
                                ...field.value,
                                image,
                              })
                            }
                          />

                          <div className="grid gap-6">
                            <FormItem>
                              <FormLabel>Logo Size</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Slider
                                    min={20}
                                    max={150}
                                    step={1}
                                    value={[field.value.size]}
                                    onValueChange={([size]) =>
                                      field.onChange({
                                        ...field.value,
                                        size,
                                      })
                                    }
                                  />
                                  <div className="text-right text-sm text-muted-foreground">
                                    {field.value.size}px
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>

                            <FormItem>
                              <FormLabel>Logo Margin</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Slider
                                    min={0}
                                    max={20}
                                    step={1}
                                    value={[field.value.margin]}
                                    onValueChange={([margin]) =>
                                      field.onChange({
                                        ...field.value,
                                        margin,
                                      })
                                    }
                                  />
                                  <div className="text-right text-sm text-muted-foreground">
                                    {field.value.margin}px
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
