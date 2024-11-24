// File: src/components/template/tag-manager.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';

interface Tag {
  id: string;
  name: string;
}

interface TagManagerProps {
  onSelect: (tagIds: string[]) => void;
  selected: string[];
}

export function TagManager({ onSelect, selected }: TagManagerProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/templates/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load tags',
        variant: 'destructive',
      });
    }
  };

  const handleCreateTag = async () => {
    if (!newTag) return;

    try {
      const response = await fetch('/api/templates/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTag }),
      });

      if (!response.ok) throw new Error('Failed to create tag');

      toast({
        title: 'Success',
        description: 'Tag created successfully',
      });

      setNewTag('');
      fetchTags();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create tag',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      const response = await fetch(`/api/templates/tags/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete tag');

      toast({
        title: 'Success',
        description: 'Tag deleted successfully',
      });

      onSelect(selected.filter((tagId) => tagId !== id));
      fetchTags();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete tag',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selected.map((tagId) => {
          const tag = tags.find((t) => t.id === tagId);
          if (!tag) return null;
          return (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
              <button
                type="button"
                title="Remove tag"
                className="ml-1 hover:text-destructive"
                onClick={() => onSelect(selected.filter((id) => id !== tag.id))}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
      </div>

      <div className="flex items-center space-x-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex-1 justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Add Tags
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="bottom" align="start">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandEmpty>
                <div className="flex items-center space-x-2 p-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="New tag name"
                    className="flex-1"
                  />
                  <Button onClick={handleCreateTag}>Add</Button>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {tags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    onSelect={() => {
                      onSelect(
                        selected.includes(tag.id)
                          ? selected.filter((id) => id !== tag.id)
                          : [...selected, tag.id]
                      );
                    }}
                  >
                    <div className="flex w-full items-center justify-between">
                      {tag.name}
                      {selected.includes(tag.id) && <X className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
