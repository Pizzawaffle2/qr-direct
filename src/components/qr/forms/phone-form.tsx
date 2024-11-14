// src/components/qr/forms/phone-form.tsx
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QRCodeData {
  type: 'phone';
  phone: string;
}

interface PhoneFormProps {
  initialData?: QRCodeData;
  onChange: (data: QRCodeData) => void;
}

export function PhoneForm({ initialData, onChange }: PhoneFormProps) {
  const [phone, setPhone] = useState(initialData?.phone || '');

  const handleChange = (newPhone: string) => {
    setPhone(newPhone);
    onChange({
      type: 'phone',
      phone: newPhone,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (234) 567-8901"
          value={phone}
          onChange={(e) => handleChange(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Include country code for international numbers
        </p>
      </div>
    </div>
  );
}
