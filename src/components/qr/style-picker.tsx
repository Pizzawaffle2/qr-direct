"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { QRStylePreset } from "@/config/qr-style-presets";
import type { QRStyleOptions } from "@/types/qr";

interface QRStylePickerProps {
  presets: QRStylePreset[];
  value: QRStyleOptions;
  onChange: (style: QRStyleOptions) => void;
}

export function QRStylePicker({
  presets,
  value,
  onChange,
}: QRStylePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {presets.map((preset) => (
        <Card
          key={preset.id}
          className={cn(
            "relative cursor-pointer p-4 transition-all hover:bg-accent",
            JSON.stringify(value) === JSON.stringify(preset.style) &&
              "ring-2 ring-primary"
          )}
          onClick={() => onChange(preset.style)}
        >
          {preset.isPro && (
            <Badge
              variant="default"
              className="absolute right-2 top-2"
            >
              PRO
            </Badge>
          )}
          <div className="space-y-2">
            <div className="text-sm font-medium">{preset.name}</div>
            <div className="text-xs text-muted-foreground">
              {preset.description}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}