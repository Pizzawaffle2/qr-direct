// components/category-select.tsx
import {Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Category {
  id: string;
  name: string;
  color?: string;
}

interface CategorySelectProps {
  categories: Category[];
  selected?: string;
  onSelect: (value: string) => void;
}

export function CategorySelect({ categories, selected, onSelect }: CategorySelectProps) {
  return (
    <Select value={selected || ''} onValueChange={onSelect}>
      <SelectTrigger className="flex-1">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            <div className="flex items-center space-x-2">
              {category.color && <div className={`category-dot bg-[${category.color}]`} />}
              <span>{category.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
