// src/components/qr/previews/vcard-preview.tsx

import { Card } from "@/components/ui/card"
import {
  User,
  Building,
  Briefcase,
  Mail,
  Phone,
  Globe,
  MapPin,
  Linkedin,
  Twitter,
  FileText
} from "lucide-react"

interface VCardPreviewProps {
  data: {
    firstName: string
    lastName?: string
    organization?: string
    jobTitle?: string
    email?: string
    phone?: string
    website?: string
    address?: string
    linkedin?: string
    twitter?: string
    notes?: string
  }
}

export function VCardPreview({ data }: VCardPreviewProps) {
  const fullName = `${data.firstName} ${data.lastName || ''}`.trim()

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5" />
          {fullName}
        </h3>
        
        {data.organization && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Building className="h-4 w-4" />
            {data.organization}
          </p>
        )}
        
        {data.jobTitle && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            {data.jobTitle}
          </p>
        )}
      </div>

      <div className="space-y-2">
        {data.email && (
          <p className="text-sm flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {data.email}
          </p>
        )}
        
        {data.phone && (
          <p className="text-sm flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {data.phone}
          </p>
        )}
        
        {data.website && (
          <p className="text-sm flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {data.website}
          </p>
        )}
        
        {data.address && (
          <p className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {data.address}
          </p>
        )}
      </div>

      {(data.linkedin || data.twitter) && (
        <div className="space-y-2">
          {data.linkedin && (
            <p className="text-sm flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              {data.linkedin}
            </p>
          )}
          
          {data.twitter && (
            <p className="text-sm flex items-center gap-2">
              <Twitter className="h-4 w-4" />
              {data.twitter}
            </p>
          )}
        </div>
      )}

      {data.notes && (
        <div className="space-y-2">
          <p className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {data.notes}
          </p>
        </div>
      )}
    </Card>
  )
}