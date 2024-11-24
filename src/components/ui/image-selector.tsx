// File: src/components/qr-code/image-selector.tsx
'use client';

import {useState } from 'react';
import {Card } from '@/components/ui/card';
import {Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {Button } from '@/components/ui/button';
import {Input } from '@/components/ui/input';
import {Label } from '@/components/ui/label';
import {ScrollArea } from '@/components/ui/scroll-area';
import {socialIcons, IconCategory } from '@/lib/data/social-icons';
import {motion } from 'framer-motion';
import {Upload, Image as ImageIcon } from 'lucide-react';
import {IconLoader } from '@/components/ui/icon-loader';

interface ImageSelectorProps {
  onImageSelect: (image: string) => void;
  selectedImage?: string;
}

export function ImageSelector({ onImageSelect, selectedImage }: ImageSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<IconCategory>('social');
  const categories: { value: IconCategory; label: string }[] = [
    { value: 'social', label: 'Social' },
    { value: 'business', label: 'Business' },
    { value: 'messaging', label: 'Messaging' },
    { value: 'payment', label: 'Payment' },
    { value: 'media', label: 'Media' },
    { value: 'store', label: 'Stores&apos; },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="p-4">
      <Tabs defaultValue="gallery" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery">
            <ImageIcon className="mr-2 h-4 w-4" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                type="button"
                variant={selectedCategory === category.value ? &apos;default' : 'outline'}
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory(category.value);
                }}
              >
                {category.label}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="grid grid-cols-4 gap-4">
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
                        selectedImage === icon.icon ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        onImageSelect(icon.icon);
                      }}
                    >
                      <IconLoader
                        icon={icon.icon}
                        color={icon.color}
                        size={32}
                        className="h-full w-full object-contain"
                      />
                    </Button>
                    <p className="mt-1 text-center text-xs text-muted-foreground">{icon.name}</p>
                  </motion.div>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="upload">
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors hover:border-primary/50">
              <Label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center">
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">Upload Image</span>
                <span className="mt-1 text-xs text-muted-foreground">SVG, PNG, JPG up to 2MB</span>
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {selectedImage && selectedImage.startsWith('data:&apos;) && (
              <div className="relative mx-auto aspect-square w-24">
                <img
                  src={selectedImage}
                  alt="Uploaded image"
                  className="rounded-lg object-contain"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -right-2 -top-2"
                  onClick={(e) => {
                    e.preventDefault();
                    onImageSelect(&apos;');
                  }}
                >
                  ✕
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
