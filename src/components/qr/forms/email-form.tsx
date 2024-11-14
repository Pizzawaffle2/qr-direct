// src/components/qr/forms/email-form.tsx
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QRCodeData {
  type: string;
  email: string;
  subject: string;
  body: string;
}

interface EmailFormProps {
  initialData?: QRCodeData;
  onChange: (data: QRCodeData) => void;
}

export function EmailForm({ initialData, onChange }: EmailFormProps) {
  const [data, setData] = useState<QRCodeData>({
    type: 'email',
    email: initialData?.email || '',
    subject: initialData?.subject || '',
    body: initialData?.body || '',
  });

  const handleChange = (updates: Partial<QRCodeData>) => {
    const newData = { ...data, ...updates };
    setData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => handleChange({ email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject (Optional)</Label>
        <Input
          id="subject"
          value={data.subject}
          onChange={(e) => handleChange({ subject: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Message (Optional)</Label>
        <Textarea
          id="body"
          placeholder="Email body"
          value={data.body}
          onChange={(e) => handleChange({ body: e.target.value })}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
