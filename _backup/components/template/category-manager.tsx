// File: src/components/template/category-manager.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

interface CategoryManagerProps {
  onSelect: (categoryId: string | null) => void;
  selected: string | null;
}

export function CategoryManager({ onSelect, selected }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/templates/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    }
  };

  const handleSaveCategory = async () => {
    if (!editingCategory?.name) return;

    try {
      const method = editingCategory.id ? 'PUT' : 'POST';
      const url = editingCategory.id
        ? `/api/templates/categories/${editingCategory.id}`
        : '/api/templates/categories';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory),
      });

      if (!response.ok) throw new Error('Failed to save category');

      toast({
        title: 'Success',
        description: `Category ${editingCategory.id ? 'updated' : 'created'} successfully`,
      });

      setIsEditing(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save category',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/templates/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete category');

      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });

      if (selected === id) onSelect(null);
      fetchCategories();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Select value={selected || ''} onValueChange={onSelect}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center space-x-2">
                  {category.color && (
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                  )}
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" onClick={() => setEditingCategory({})}>
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory?.id ? 'Edit Category' : 'New Category'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label>Name</label>
                <Input
                  value={editingCategory?.name || ''}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  placeholder="Category name"
                />
              </div>
              <div className="space-y-2">
                <label>Description</label>
                <Input
                  value={editingCategory?.description || ''}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      description: e.target.value,
                    })
                  }
                  placeholder="Category description"
                />
              </div>
              <div className="space-y-2">
                <label>Color</label>
                <div className="flex space-x-2">
                  <Input
                    type="color"
                    value={editingCategory?.color || '#000000'}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        color: e.target.value,
                      })
                    }
                    className="h-12 w-12 p-1"
                  />
                  <Input
                    value={editingCategory?.color || ''}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        color: e.target.value,
                      })
                    }
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveCategory}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {selected && (
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const category = categories.find((c) => c.id === selected);
              setEditingCategory(category || null);
              setIsEditing(true);
            }}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(selected)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
