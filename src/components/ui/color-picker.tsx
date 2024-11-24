// components/ui/color-picker.tsx
import {useState } from 'react';
import {Input } from '@/components/ui/input';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ColorPicker({ value, onChange, disabled }: ColorPickerProps) {
  const [isValid, setIsValid] = useState(true);

  const handleChange = (_newValue) => {
    const isValidColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue);
    setIsValid(isValidColor);
    if (isValidColor) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="color"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="h-12 w-12 cursor-pointer rounded p-1"
        disabled={disabled}
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className={`flex-1 ${!isValid ? 'border-red-500' : &apos;&apos;}`}
        placeholder="#000000"
        disabled={disabled}
      />
    </div>
  );
}
