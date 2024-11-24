// components/category-dialog.tsx
import {Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {CategoryForm } from '@/components/category-form';

interface Category {
  id?: string;
  // Add other category properties here
}

interface CategoryDialogProps {
  isOpen: boolean;
  category?: Category;
  onClose: () => void;
  onSave: (category: Category) => void;
  onChange: (category: Category) => void;
}

export function CategoryDialog({
  isOpen,
  category,
  onClose,
  onSave,
  onChange,
}: CategoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category?.id ? 'Edit Category' : &apos;New Category&apos;}</DialogTitle>
        </DialogHeader>
        <CategoryForm category={category} onChange={onChange} onSave={onSave} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}
