// src/components/qr/forms/text-form.tsx
import {useState } from 'react';
import {Label } from '@/components/ui/label';
import {Textarea } from '@/components/ui/textarea';

interface QRCodeData {
  type: 'text';
  text: string;
}

interface TextFormProps {
  initialData?: QRCodeData;
  onChange: (data: QRCodeData) => void;
}

export function TextForm({ initialData, onChange }: TextFormProps) {
  const [text, setText] = useState(initialData?.text || '');

  const handleChange = (newText: string) => {
    setText(newText);
    onChange({
      type: 'text',
      text: newText,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text">Text Content</Label>
        <Textarea
          id="text"
          placeholder="Enter your text here..."
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          className="min-h-[150px]"
        />
      </div>
    </div>
  );
}
