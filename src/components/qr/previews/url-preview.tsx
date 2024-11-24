// src/components/qr/previews/url-preview.tsx
import {Card } from '@/components/ui/card';
import {Link, Globe } from 'lucide-react';

interface URLPreviewProps {
  data: {
    title: string;
    url: string;
  };
}

export function URLPreview({ data }: URLPreviewProps) {
  return (
    <Card className="space-y-4 p-6">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Globe className="h-5 w-5" />
        {data.title}
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link className="h-4 w-4" />
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-blue-400"
        >
          {data.url}
        </a>
      </div>
    </Card>
  );
}
