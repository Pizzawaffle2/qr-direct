// components/category-actions.tsx
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface CategoryActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function CategoryActions({ onEdit, onDelete }: CategoryActionsProps) {
    return (
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    );
  }