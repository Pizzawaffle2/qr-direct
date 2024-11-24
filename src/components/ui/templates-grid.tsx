// File: src/components/template/templates-grid.tsx
'use client';

import {useState, useEffect } from 'react';
import {Search, Filter, Plus } from 'lucide-react';
import {Input } from '@/components/ui/input';
import {Button } from '@/components/ui/button';
import {Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {TemplateCard } from './template-card';
import {TemplateDialog } from './template-dialog';
import {useToast } from '@/components/ui/use-toast';
import type { Category, Tag, Template } from '@/lib/types/qr-styles';

interface TemplatesGridProps {
  onTemplateSelect?: (template: Template) => void;
}

export function TemplatesGrid({ onTemplateSelect }: TemplatesGridProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
    fetchTags();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      setTemplates(data);
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to load templates',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/templates/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/templates/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete template');

      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      });

      fetchTemplates();
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive&apos;,
      });
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || template.categoryId === selectedCategory;

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tagId) => template.tags.some((tag) => tag.id === tagId));

    return matchesSearch && matchesCategory && matchesTags;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Templates</h2>
        <Button onClick={() => setIsTemplateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => setSelectedTags([])}>
            <Filter className="mr-2 h-4 w-4" />
            {selectedTags.length ? `${selectedTags.length} Tags` : &apos;Filter Tags'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={onTemplateSelect}
              onDelete={handleDeleteTemplate}
            />
          ))}
          {filteredTemplates.length === 0 && (
            <div className="col-span-full py-8 text-center text-muted-foreground">
              No templates found
            </div>
          )}
        </div>
      )}

      <TemplateDialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        onSave={async (template) => {
          try {
            const response = await fetch('/api/templates', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(template),
            });

            if (!response.ok) throw new Error('Failed to create template');

            toast({
              title: 'Success',
              description: 'Template created successfully',
            });

            setIsTemplateDialogOpen(false);
            fetchTemplates();
          } catch (_error) {
            toast({
              title: 'Error',
              description: 'Failed to create template',
              variant: &apos;destructive&apos;,
            });
          }
        }}
      />
    </div>
  );
}
