
// src/components/qr/style-editor.tsx
"use client"

import { QRStyleOptions } from "@/types/qr"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"

interface StyleEditorProps {
  value: QRStyleOptions
  onChange: (value: QRStyleOptions) => void
}

export function StyleEditor({ value, onChange }: StyleEditorProps) {
  return (
    <Card className="p-4 space-y-6">
      <div className="space-y-2">
        <Label>Size</Label>
        <Slider
          min={100}
          max={1000}
          step={10}
          value={[value.size || 400]}
          onValueChange={([size]) => onChange({ ...value, size })}
        />
        <div className="text-sm text-muted-foreground">
          {value.size}px
        </div>
      </div>

      <div className="space-y-2">
        <Label>Margin</Label>
        <Slider
          min={0}
          max={10}
          step={1}
          value={[value.margin || 4]}
          onValueChange={([margin]) => onChange({ ...value, margin })}
        />
        <div className="text-sm text-muted-foreground">
          {value.margin} blocks
        </div>
      </div>

      <div className="space-y-2">
        <Label>Colors</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm">Background</Label>
            <Input
              type="color"
              value={value.backgroundColor || "#FFFFFF"}
              onChange={(e) => onChange({ ...value, backgroundColor: e.target.value })}
              className="h-10 w-full"
            />
          </div>
          <div>
            <Label className="text-sm">Foreground</Label>
            <Input
              type="color"
              value={value.foregroundColor || "#000000"}
              onChange={(e) => onChange({ ...value, foregroundColor: e.target.value })}
              className="h-10 w-full"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Error Correction</Label>
        <Select
          value={value.errorCorrection || "M"}
          onValueChange={(errorCorrection) => onChange({ ...value, errorCorrection })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="L">Low (7%)</SelectItem>
            <SelectItem value="M">Medium (15%)</SelectItem>
            <SelectItem value="Q">High (25%)</SelectItem>
            <SelectItem value="H">Highest (30%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Logo URL</Label>
        <Input
          type="url"
          placeholder="https://example.com/logo.png"
          value={value.logo || ""}
          onChange={(e) => onChange({ ...value, logo: e.target.value })}
        />
      </div>
    </Card>
  )
}