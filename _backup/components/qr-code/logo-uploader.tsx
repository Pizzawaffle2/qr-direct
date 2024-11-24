// File: src/components/qr-code/logo-uploader.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { Upload, ImageIcon } from 'lucide-react';
import { IconLoader } from '../ui/icon-loader';
import { socialIcons, IconCategory } from '@/lib/data/social-icons';
import { motion } from 'framer-motion';

interface LogoUploaderProps {
  onLogoSelect: (logo: string) => void;
  selectedLogo?: string;
  onLogoSizeChange?: (size: number) => void;
  onLogoMarginChange?: (margin: number) => void;
  logoSize?: number;
  logoMargin?: number;
}

export function LogoUploader({
  onLogoSelect,
  selectedLogo,
  onLogoSizeChange,
  onLogoMarginChange,
  logoSize = 50,
  logoMargin = 5,
}: LogoUploaderProps) {
  const [selectedCategory, setSelectedCategory] = useState<IconCategory>('social');
  const { toast } = useToast();

  const categories = [
    { value: 'social' as const, label: 'Social' },
    { value: 'business' as const, label: 'Business' },
    { value: 'messaging' as const, label: 'Messaging' },
    { value: 'payment' as const, label: 'Payment' },
    { value: 'media' as const, label: 'Media' },
    { value: 'store' as const, label: 'Stores' },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File',
          description: 'Please upload a valid image file (PNG, JPG, SVG)',
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onLogoSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="gallery">
          <TabsList className="mb-4 grid grid-cols-2 gap-4">
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery">
            <div className="space-y-4">
              <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.value}
                      type="button"
                      variant={selectedCategory === category.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>
              </ScrollArea>

              <ScrollArea className="h-[300px] rounded-md border">
                <div className="grid grid-cols-4 gap-4 p-4">
                  {socialIcons
                    .filter((icon) => icon.categories.includes(selectedCategory))
                    .map((icon) => (
                      <motion.div
                        key={icon.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          className={`aspect-square w-full p-2 ${
                            selectedLogo === icon.icon ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => onLogoSelect(icon.icon)}
                        >
                          <IconLoader
                            icon={icon.icon}
                            color={icon.color}
                            size={32}
                            className="h-full w-full object-contain"
                          />
                        </Button>
                        <p className="mt-1 text-center text-xs text-muted-foreground">
                          {icon.name}
                        </p>
                      </motion.div>
                    ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8">
              <Label htmlFor="logo-upload" className="flex cursor-pointer flex-col items-center">
                <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                <span className="text-sm font-medium">Upload Logo</span>
                <span className="mt-1 text-xs text-muted-foreground">SVG, PNG, JPG up to 2MB</span>
              </Label>
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </TabsContent>
        </Tabs>

        {selectedLogo && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative h-24 w-24">
                {selectedLogo.startsWith('data:') ? (
                  <img
                    src={selectedLogo}
                    alt="Selected logo"
                    className="h-full w-full rounded-lg object-contain"
                  />
                ) : (
                  <IconLoader
                    icon={selectedLogo}
                    color={socialIcons.find((i) => i.icon === selectedLogo)?.color}
                    size={96}
                  />
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -right-2 -top-2"
                  onClick={() => onLogoSelect('')}
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Logo Size</Label>
                <Slider
                  value={[logoSize]}
                  onValueChange={(value) => onLogoSizeChange?.(value[0])}
                  min={20}
                  max={150}
                  step={1}
                  className="mt-2"
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">{logoSize}px</p>
              </div>

              <div>
                <Label>Logo Margin</Label>
                <Slider
                  value={[logoMargin]}
                  onValueChange={(value) => onLogoMarginChange?.(value[0])}
                  min={0}
                  max={20}
                  step={1}
                  className="mt-2"
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">{logoMargin}px</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
