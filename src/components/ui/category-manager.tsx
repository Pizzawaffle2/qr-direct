'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import { CategoryService } from '@/services/category-service';
import { CategoryDialog } from '../category-dialog';
import { CategorySelect } from '../category-select';
import { CategoryActions } from '../category-actions';
import { useToast } from '@/components/ui/use-toast';
import { type Category } from '@/types/category';

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
      const data = await CategoryService.getCategories();
      setCategories(data);
    } catch (error) {
      showErrorToast('Failed to load categories');
    }
  };

  const handleSaveCategory = async () => {
    if (!editingCategory?.name) return;

    try {
      if (editingCategory.id) {
        await CategoryService.updateCategory(editingCategory.id, editingCategory);
        showSuccessToast('Category updated successfully');
      } else {
        await CategoryService.createCategory(editingCategory);
        showSuccessToast('Category created successfully');
      }

      closeDialog();
      fetchCategories();
    } catch (error) {
      showErrorToast('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await CategoryService.deleteCategory(id);
      showSuccessToast('Category deleted successfully');
      
      if (selected === id) onSelect(null);
      fetchCategories();
    } catch (error) {
      showErrorToast('Failed to delete category');
    }
  };

  const openEditDialog = (category?: Category) => {
    setEditingCategory(category || {});
    setIsEditing(true);
  };

  const closeDialog = () => {
    setIsEditing(false);
    setEditingCategory(null);
  };

  const showSuccessToast = (message: string) => {
    toast({ title: 'Success', description: message });
  };

  const showErrorToast = (message: string) => {
    toast({ title: 'Error', description: message, variant: 'destructive' });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <CategorySelect
          categories={categories}
          selected={selected}
          onSelect={onSelect}
        />
        <button
          className="btn-icon"
          onClick={() => openEditDialog()}
          aria-label="Add new category"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {selected && (
        <CategoryActions
          onEdit={() => {
            const category = categories.find(c => c.id === selected);
            openEditDialog(category);
          }}
          onDelete={() => handleDeleteCategory(selected)}
        />
      )}

      <CategoryDialog
        isOpen={isEditing}
        category={editingCategory}
        onClose={closeDialog}
        onSave={handleSaveCategory}
        onChange={setEditingCategory}
      />
    </div>
  );
}
