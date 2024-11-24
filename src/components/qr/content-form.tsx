'use client';

import {useState } from 'react';
import {QRCodeType, QRCodeData, QR_CODE_TYPES } from '@/types/qr';
import {Input } from '@/components/ui/input';
import {Label } from '@/components/ui/label';
import {Textarea } from '@/components/ui/textarea';
import {Switch } from '@/components/ui/switch';
import {Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface QRContentFormProps {
  type: QRCodeType;
  initialData?: QRCodeData;
  onChange: (data: QRCodeData) => void;
}

export function QRContentForm({ type, initialData, onChange }: QRContentFormProps) {
  const FormComponent = FORM_COMPONENTS[type];
  return <FormComponent initialData={initialData} onChange={onChange} />;
}

// URL Form
function URLForm({
  initialData,
  onChange,
}: {
  initialData?: QRCodeData;
  onChange: (data: QRCodeData) => void;
}) {
  const [url, setUrl] = useState((initialData as any)?.url || '');

  const handleChange = (newUrl: string) => {
    setUrl(newUrl);
    onChange({
      type: 'url',
      url: newUrl,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </div>
  );
}

// WiFi Form
function WiFiForm({
  initialData,
  onChange,
}: {
  initialData?: QRCodeData;
  onChange: (data: QRCodeData) => void;
}) {
  const [data, setData] = useState<QRCodeData>(
    (initialData as any) || {
      type: 'wifi',
      ssid: '',
      password: '',
      networkType: 'WPA',
      hidden: false,
    }
  );

  const handleChange = (updates: Partial<typeof data>) => {
    const newData = { ...data, ...updates } as QRCodeData;
    setData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ssid">Network Name (SSID)</Label>
        <Input
          id="ssid"
          value={(data as any).ssid}
          onChange={(e) => handleChange({ ssid: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={(data as any).password}
          onChange={(e) => handleChange({ password: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="networkType">Security Type</Label>
        <Select
          value={(data as any).networkType}
          onValueChange={(value) => handleChange({ networkType: value as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select security type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WPA">WPA/WPA2</SelectItem>
            <SelectItem value="WEP">WEP</SelectItem>
            <SelectItem value="nopass">No Password</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="hidden"
          checked={(data as any).hidden}
          onCheckedChange={(checked) => handleChange({ hidden: checked })}
        />
        <Label htmlFor="hidden">Hidden Network</Label>
      </div>
    </div>
  );
}

// vCard Form
function VCardForm({
  initialData,
  onChange,
}: {
  initialData?: QRCodeData;
  onChange: (data: QRCodeData) => void;
}) {
  const [data, setData] = useState<QRCodeData>(
    (initialData as any) || {
      type: 'vcard',
      firstName: '',
      lastName: '',
      organization: '',
      title: '',
      email: '',
      phone: '',
      website: '',
      address: '',
    }
  );

  const handleChange = (updates: Partial<typeof data>) => {
    const newData = { ...data, ...updates } as QRCodeData;
    setData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={(data as any).firstName}
            onChange={(e) => handleChange({ firstName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={(data as any).lastName}
            onChange={(e) => handleChange({ lastName: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization">Organization</Label>
        <Input
          id="organization"
          value={(data as any).organization}
          onChange={(e) => handleChange({ organization: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          value={(data as any).title}
          onChange={(e) => handleChange({ title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={(data as any).email}
          onChange={(e) => handleChange({ email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={(data as any).phone}
          onChange={(e) => handleChange({ phone: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          value={(data as any).website}
          onChange={(e) => handleChange({ website: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={(data as any).address}
          onChange={(e) => handleChange({ address: e.target.value })}
        />
      </div>
    </div>
  );
}

// Text Form
function TextForm({
  initialData,
  onChange,
}: {
  initialData?: QRCodeData;
  onChange: (data: QRCodeData) => void;
}) {
  const [text, setText] = useState((initialData as any)?.text || '');

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
        <Label htmlFor="text">Text</Label>
        <Textarea
          id="text"
          placeholder="Enter your text"
          value={text}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </div>
  );
}

// Email Form
function EmailForm({
  initialData,
  onChange,
}: {
  initialData?: QRCodeData;
  onChange: (data: QRCodeData) => void;
}) {
  const [email, setEmail] = useState((initialData as any)?.email || '');

  const handleChange = (newEmail: string) => {
    setEmail(newEmail);
    onChange({
      type: 'email',
      email: newEmail,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </div>
  );
}

// Phone Form
function PhoneForm({
  initialData,
  onChange,
}: {
  initialData?: QRCodeData;
  onChange: (data: QRCodeData) => void;
}) {
  const [phone, setPhone] = useState((initialData as any)?.phone || '');

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
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1234567890"
          value={phone}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </div>
  );
}

// SMS Form
function SMSForm({
  initialData,
  onChange,
}: {
  initialData?: QRCodeData;
  onChange: (data: QRCodeData) => void;
}) {
  const [data, setData] = useState<QRCodeData>(
    (initialData as any) || {
      type: 'sms',
      phone: '',
      message: '',
    }
  );

  const handleChange = (updates: Partial<typeof data>) => {
    const newData = { ...data, ...updates } as QRCodeData;
    setData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={(data as any).phone}
          onChange={(e) => handleChange({ phone: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={(data as any).message}
          onChange={(e) => handleChange({ message: e.target.value })}
        />
      </div>
    </div>
  );
}

// Location Form
function LocationForm({
  initialData,
  onChange,
}: {
  initialData?: QRCodeData;
  onChange: (data: QRCodeData) => void;
}) {
  const [data, setData] = useState<QRCodeData>(
    (initialData as any) || {
      type: 'location',
      latitude: '',
      longitude: '',
    }
  );

  const handleChange = (updates: Partial<typeof data>) => {
    const newData = { ...data, ...updates } as QRCodeData;
    setData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="latitude">Latitude</Label>
        <Input
          id="latitude"
          type="number"
          step="any"
          value={(data as any).latitude}
          onChange={(e) => handleChange({ latitude: parseFloat(e.target.value) })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="longitude">Longitude</Label>
        <Input
          id="longitude"
          type="number"
          step="any"
          value={(data as any).longitude}
          onChange={(e) => handleChange({ longitude: parseFloat(e.target.value) })}
        />
      </div>
    </div>
  );
}

const FORM_COMPONENTS = {
  url: URLForm,
  text: TextForm,
  email: EmailForm,
  phone: PhoneForm,
  sms: SMSForm,
  wifi: WiFiForm,
  vcard: VCardForm,
  location: LocationForm,
} as const;
