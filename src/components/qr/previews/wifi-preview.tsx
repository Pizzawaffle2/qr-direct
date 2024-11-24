// src/components/qr/previews/wifi-preview.tsx
import {Card } from '@/components/ui/card';
import {Wifi, Lock, Eye, EyeOff } from 'lucide-react';
import {useState } from 'react';
import {Button } from '@/components/ui/button';

interface WifiPreviewProps {
  data: {
    title: string;
    ssid: string;
    password?: string;
    networkType: 'WEP' | 'WPA' | 'nopass';
    hidden: boolean;
  };
}

export function WifiPreview({ data }: WifiPreviewProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="space-y-4 p-6">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Wifi className="h-5 w-5" />
        {data.title}
      </div>
      <div className="space-y-2">
        <p className="text-sm">
          <span className="text-muted-foreground">Network Name:</span> {data.ssid}
        </p>
        {data.password && (
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <div className="relative flex-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                readOnly
                className="w-full bg-transparent text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs">{data.networkType}</span>
          {data.hidden && (
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs">Hidden Network</span>
          )}
        </div>
      </div>
    </Card>
  );
}
