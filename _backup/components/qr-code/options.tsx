// File: src/components/qr-code/options.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ImageSelector } from './image-selector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QRCodeOptions } from '@/lib/types/qr-code';
import { motion } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface OptionsProps {
  options: QRCodeOptions;
  onChange: (options: QRCodeOptions) => void;
}

const patterns = [
  { value: 'squares', label: 'Squares' },
  { value: 'dots', label: 'Dots' },
  { value: 'rounded', label: 'Rounded' },
];

const cornerStyles = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
];

export function QROptions({ options, onChange }: OptionsProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleChange = (key: keyof QRCodeOptions, value: any) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Colors */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={options.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="h-12 w-12 p-1"
              />
              <Input
                type="text"
                value={options.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="flex-1 font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Foreground Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={options.foregroundColor}
                onChange={(e) => handleChange('foregroundColor', e.target.value)}
                className="h-12 w-12 p-1"
              />
              <Input
                type="text"
                value={options.foregroundColor}
                onChange={(e) => handleChange('foregroundColor', e.target.value)}
                className="flex-1 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Size and Margin */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Size</Label>
            <Slider
              value={[options.size || 300]}
              onValueChange={([value]) => handleChange('size', value)}
              min={100}
              max={1000}
              step={10}
              className="my-4"
            />
            <div className="text-right text-sm text-muted-foreground">{options.size}px</div>
          </div>

          <div className="space-y-2">
            <Label>Margin</Label>
            <Slider
              value={[options.margin || 4]}
              onValueChange={([value]) => handleChange('margin', value)}
              min={0}
              max={20}
              step={1}
              className="my-4"
            />
            <div className="text-right text-sm text-muted-foreground">{options.margin} blocks</div>
          </div>
        </div>

        {/* Advanced Options */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen} className="space-y-4">
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <Label>Advanced Options</Label>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            <div className="space-y-2">
              <Label>Pattern Style</Label>
              <Select
                value={options.pattern}
                onValueChange={(value) => handleChange('pattern', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pattern style" />
                </SelectTrigger>
                <SelectContent>
                  {patterns.map((pattern) => (
                    <SelectItem key={pattern.value} value={pattern.value}>
                      {pattern.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Corner Style</Label>
              <Select
                value={options.cornerSquareStyle}
                onValueChange={(value) => handleChange('cornerSquareStyle', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select corner style" />
                </SelectTrigger>
                <SelectContent>
                  {cornerStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Logo / Image</Label>
              <ImageSelector
                selectedImage={options.imageUrl}
                onImageSelect={(image) => handleChange('imageUrl', image)}
              />

              {options.imageUrl && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Image Size</Label>
                    <Slider
                      value={[options.imageSize || 50]}
                      onValueChange={([value]) => handleChange('imageSize', value)}
                      min={20}
                      max={150}
                      step={1}
                      className="my-4"
                    />
                    <div className="text-right text-sm text-muted-foreground">
                      {options.imageSize}px
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Image Margin</Label>
                    <Slider
                      value={[options.imageMargin || 5]}
                      onValueChange={([value]) => handleChange('imageMargin', value)}
                      min={0}
                      max={20}
                      step={1}
                      className="my-4"
                    />
                    <div className="text-right text-sm text-muted-foreground">
                      {options.imageMargin}px
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Error Correction Level</Label>
              <Select
                value={options.errorCorrectionLevel}
                onValueChange={(value) => handleChange('errorCorrectionLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select error correction level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
