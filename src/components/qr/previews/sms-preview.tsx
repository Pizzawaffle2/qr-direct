// src/components/qr/previews/sms-preview.tsx
import {Card } from '@/components/ui/card';
import {MessageSquare, Phone, FileText } from 'lucide-react';
import {Button } from '@/components/ui/button';

interface SMSPreviewProps {
  data: {
    title: string;
    phone: string;
    message?: string;
  };
}

export function SMSPreview({ data }: SMSPreviewProps) {
  const handleSendClick = () => {
    const url = `sms:${data.phone}${data.message ? `?body=${encodeURIComponent(data.message)}` : ''}`;
    window.location.href = url;
  };

  return (
    <Card className="space-y-4 p-6">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <MessageSquare className="h-5 w-5" />
        {data.title}
      </div>
      <div className="space-y-3">
        <p className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          {data.phone}
        </p>
        {data.message && (
          <div className="flex gap-2 text-sm">
            <FileText className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="whitespace-pre-wrap">{data.message}</p>
          </div>
        )}
        <Button variant="outline" size="sm" className="w-full" onClick={handleSendClick}>
          Send Message
        </Button>
      </div>
    </Card>
  );
}
