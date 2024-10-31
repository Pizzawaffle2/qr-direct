// File: src/lib/types/qr-styles.ts
export interface QRStyle {
  backgroundColor: string;
  foregroundColor: string;
  cornerSquareStyle?: 'dot' | 'square' | 'extra-rounded';
  cornerDotStyle?: 'dot' | 'square';
  pattern?: 'squares' | 'dots' | 'rounded';
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number;
  size: number;
}

export interface TemplateStyle extends QRStyle {
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
}

// File: src/components/qr-code/style-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Save, Template, Palette } from 'lucide-react';
import { TemplateDialog } from '../template/template-dialog';
import { useToast } from '@/components/ui/use-toast';
import type { QRStyle, TemplateStyle } from '@/lib/types/qr-styles';

interface StyleFormProps {
  initialStyle?: QRStyle;
  onStyleChange: (style: QRStyle) => void;
}

export default function StyleForm({ initialStyle, onStyleChange }: StyleFormProps) {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<QRStyle>({
    defaultValues: {
      backgroundColor: '#FFFFFF',
      foregroundColor: '#000000',
      cornerSquareStyle: 'square',
      cornerDotStyle: 'square',
      pattern: 'squares',
      errorCorrectionLevel: 'M',
      margin: 20,
      size: 300,
      ...initialStyle
    }
  });

  const { watch, setValue } = form;
  const currentStyle = watch();

  useEffect(() => {
    onStyleChange(currentStyle);
  }, [currentStyle, onStyleChange]);

  const handleSaveTemplate = async (templateData: Partial<TemplateStyle>) => {
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...templateData,
          style: currentStyle,
        }),
      });

      if (!response.ok) throw new Error('Failed to save template');

      toast({
        title: 'Success',
        description: 'Template saved successfully',
      });
      setIsTemplateDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save template',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>QR Code Style</CardTitle>
        <CardDescription>
          Customize the appearance of your QR code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic">
          <TabsList>
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label>Background Color</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={currentStyle.backgroundColor}
                    onChange={(e) => setValue('backgroundColor', e.target.value)}
                    className="w-12 h-12 p-1"
                  />
                  <Input
                    type="text"
                    value={currentStyle.backgroundColor}
                    onChange={(e) => setValue('backgroundColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label>Foreground Color</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={currentStyle.foregroundColor}
                    onChange={(e) => setValue('foregroundColor', e.target.value)}
                    className="w-12 h-12 p-1"
                  />
                  <Input
                    type="text"
                    value={currentStyle.foregroundColor}
                    onChange={(e) => setValue('foregroundColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label>Size</label>
                <Slider
                  value={[currentStyle.size]}
                  onValueChange={([value]) => setValue('size', value)}
                  min={100}
                  max={1000}
                  step={10}
                />
                <span className="text-sm text-muted-foreground">
                  {currentStyle.size}px
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label>Corner Square Style</label>
                <Select
                  value={currentStyle.cornerSquareStyle}
                  onValueChange={(value) => setValue('cornerSquareStyle', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dot">Dot</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label>Pattern</label>
                <Select
                  value={currentStyle.pattern}
                  onValueChange={(value) => setValue('pattern', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="squares">Squares</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label>Error Correction</label>
                <Select
                  value={currentStyle.errorCorrectionLevel}
                  onValueChange={(value) => setValue('errorCorrectionLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">High (25%)</SelectItem>
                    <SelectItem value="H">Highest (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label>Margin</label>
                <Slider
                  value={[currentStyle.margin]}
                  onValueChange={([value]) => setValue('margin', value)}
                  min={0}
                  max={50}
                  step={1}
                />
                <span className="text-sm text-muted-foreground">
                  {currentStyle.margin}px
                </span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          variant="outline"
          onClick={() => setIsTemplateDialogOpen(true)}
        >
          <Template className="w-4 h-4 mr-2" />
          Save as Template
        </Button>
      </CardFooter>

      <TemplateDialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        onSave={handleSaveTemplate}
        style={currentStyle}
      />
    </Card>
  );
}