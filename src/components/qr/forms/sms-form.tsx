import {useState, useCallback, ChangeEvent } from 'react';
import {Label } from '@/components/ui/label';
import {Input } from '@/components/ui/input';
import {Textarea } from '@/components/ui/textarea';

interface QRCodeData extends SMSFormData {}

interface SMSFormData {
  type: 'sms';
  phone: string;
  message: string;
}

function SMSForm({
  initialData,
  onChange,
}: {
  initialData?: QRCodeData;
  onChange: (data: QRCodeData) => void;
}) {
  const [data, setData] = useState<SMSFormData>({
    type: 'sms',
    phone: initialData?.phone || '',
    message: initialData?.message || '',
  });

  const handleChange = useCallback(
    (updates: Partial<SMSFormData>) => {
      const newData = { ...data, ...updates };
      setData(newData);
      onChange(newData);
    },
    [data, onChange]
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (234) 567-8901"
          value={data.phone}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange({ phone: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea
          id="message"
          placeholder="Enter your message"
          value={data.message}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            handleChange({ message: e.target.value })
          }
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
