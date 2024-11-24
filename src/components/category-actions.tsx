// components/category-actions.tsx
import {Button } from '@/components/ui/button';
import {Edit2, Trash2 } from 'lucide-react';

interface CategoryActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function CategoryActions({ onEdit, onDelete }: CategoryActionsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" size="sm" onClick={onEdit}>
        <Edit2 className="mr-2 h-4 w-4" />
        Edit
      </Button>
      <Button variant="outline" size="sm" onClick={onDelete}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}
