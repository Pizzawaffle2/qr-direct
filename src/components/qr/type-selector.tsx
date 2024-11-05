// src/components/qr/type-selector.tsx
"use client"

import { QRCodeData } from "@/types/qr"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface TypeSelectorProps {
  value: Partial<QRCodeData>
  onChange: (value: Partial<QRCodeData>) => void
}

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  const handleTypeChange = (type: string) => {
    onChange({ type: type as QRCodeData["type"] })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>QR Code Type</Label>
        <Select
          value={value.type}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="url">URL</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="wifi">WiFi</SelectItem>
            <SelectItem value="location">Location</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {value.type && (
        <Card className="p-4 space-y-4">
          {value.type === "url" && (
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={value.url || ""}
                onChange={(e) => onChange({ ...value, url: e.target.value })}
              />
            </div>
          )}

          {value.type === "text" && (
            <div className="space-y-2">
              <Label>Text</Label>
              <Textarea
                placeholder="Enter your text"
                value={value.text || ""}
                onChange={(e) => onChange({ ...value, text: e.target.value })}
              />
            </div>
          )}

          {/* Add other type-specific fields */}
        </Card>
      )}
    </div>
  )
}
