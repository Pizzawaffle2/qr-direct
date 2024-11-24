// File: src/components/template/template-dialog.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
import { CategoryManager } from './category-manager';
import { TagManager } from './tag-manager';
import { Switch } from '@/components/ui/switch';
import type { QRStyle, TemplateStyle } from '@/lib/types/qr-styles';
import * as z from 'zod';

const templateFormSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  style: z.object({
    backgroundColor: z.string(),
    foregroundColor: z.string(),
    margin: z.number(),
    errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']),
    pattern: z.string().optional(),
    cornerSquareStyle: z.string().optional(),
    cornerDotStyle: z.string().optional(),
  }),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: Partial<TemplateStyle>) => Promise<void>;
  style: QRStyle;
}

export function TemplateDialog({ open, onOpenChange, onSave, style }: TemplateDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: '',
      description: '',
      isPublic: false,
      style,
    },
  });

  const onSubmit = async (data: TemplateFormValues) => {
    await onSave({
      ...data,
      categoryId: selectedCategory,
      tagIds: selectedTags,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
          <DialogDescription>
            Create a reusable template from your current QR code style
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Template" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your template..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Make Public</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Category</FormLabel>
              <CategoryManager onSelect={setSelectedCategory} selected={selectedCategory} />
            </div>

            <div className="space-y-2">
              <FormLabel>Tags</FormLabel>
              <TagManager onSelect={setSelectedTags} selected={selectedTags} />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Template</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
