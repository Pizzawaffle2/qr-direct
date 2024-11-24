// src/components/qr/previews/vcard-preview.tsx

import {Card } from '@/components/ui/card';
import {User,
  Building,
  Briefcase,
  Mail,
  Phone,
  Globe,
  MapPin,
  Linkedin,
  Twitter,
  FileText,
} from 'lucide-react';

interface VCardPreviewProps {
  data: {
    firstName: string;
    lastName?: string;
    organization?: string;
    jobTitle?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    linkedin?: string;
    twitter?: string;
    notes?: string;
  };
}

export function VCardPreview({ data }: VCardPreviewProps) {
  const fullName = `${data.firstName} ${data.lastName || ''}`.trim();

  return (
    <Card className="space-y-4 p-6">
      <div className="space-y-2">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <User className="h-5 w-5" />
          {fullName}
        </h3>

        {data.organization && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4" />
            {data.organization}
          </p>
        )}

        {data.jobTitle && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            {data.jobTitle}
          </p>
        )}
      </div>

      <div className="space-y-2">
        {data.email && (
          <p className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4" />
            {data.email}
          </p>
        )}

        {data.phone && (
          <p className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4" />
            {data.phone}
          </p>
        )}

        {data.website && (
          <p className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4" />
            {data.website}
          </p>
        )}

        {data.address && (
          <p className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            {data.address}
          </p>
        )}
      </div>

      {(data.linkedin || data.twitter) && (
        <div className="space-y-2">
          {data.linkedin && (
            <p className="flex items-center gap-2 text-sm">
              <Linkedin className="h-4 w-4" />
              {data.linkedin}
            </p>
          )}

          {data.twitter && (
            <p className="flex items-center gap-2 text-sm">
              <Twitter className="h-4 w-4" />
              {data.twitter}
            </p>
          )}
        </div>
      )}

      {data.notes && (
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4" />
            {data.notes}
          </p>
        </div>
      )}
    </Card>
  );
}
