// src/components/qr/style-picker.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { QRStyleOptions } from "@/types/qr";

interface QRStylePickerProps {
  presets: Array<{
    id: string;
    name: string;
    description: string;
    style: QRStyleOptions;
    isPro?: boolean;
  }>;
  value: QRStyleOptions;
  onChange: (style: QRStyleOptions) => void;
  onCustomize: (style: QRStyleOptions) => void;
}

export function QRStylePicker({
  presets,
  value,
  onChange,
  onCustomize
}: QRStylePickerProps): JSX.Element {
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
        >
          <div 
            onClick={() => onChange({
              ...preset.style,
              size: preset.style.size || 200,
              margin: preset.style.margin || 4,
              errorCorrection: preset.style.errorCorrection || 'M',
              foregroundColor: preset.style.foregroundColor || '#000000',
              backgroundColor: preset.style.backgroundColor || '#FFFFFF'
            })}
            className="space-y-2"
          >
            {preset.isPro && (
              <Badge variant="default" className="absolute right-2 top-2">
                PRO
              </Badge>
            )}
            <div className="text-sm font-medium">{preset.name}</div>
            <div className="text-xs text-muted-foreground">
              {preset.description}
            </div>
          </div>
          {onCustomize && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={() => onCustomize(preset.style)}
            >
              Customize
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
}