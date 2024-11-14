"use client";

import { useState } from "react";
import { QRCodeData, QRStyleOptions } from "@/types/qr";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Paintbrush, 
  Image as ImageIcon, 
  Grid, 
  Frame, 
  Eye, 
  Check,
  CalendarDays,
  QrCode 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QRPreviewProps {
  data: QRCodeData;
  style: QRStyleOptions;
}

export function QRPreview({ data, style }: QRPreviewProps) {
  const [previewTab, setPreviewTab] = useState<"preview" | "details">("preview");

  return (
    <div className="space-y-4">
      <Tabs value={previewTab} onValueChange={(v) => setPreviewTab(v as typeof previewTab)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <div className="aspect-square w-full">
            <Card className="flex items-center justify-center w-full h-full bg-white dark:bg-gray-950 relative overflow-hidden">
              {/* Placeholder for actual QR code */}
              <div className="relative">
                {/* Show frame if enabled */}
                {style.frame && (
                  <div 
                    className="absolute inset-[-20px] border-2 rounded-lg"
                    style={{ 
                      borderColor: style.frameColor || 'currentColor',
                      backgroundColor: style.backgroundColor
                    }}
                  >
                    {style.frameText && (
                      <div 
                        className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 px-2 text-sm"
                        style={{ 
                          color: style.frameTextColor || 'currentColor',
                          backgroundColor: style.backgroundColor
                        }}
                      >
                        {style.frameText}
                      </div>
                    )}
                  </div>
                )}

                {/* QR Code Preview */}
                <div 
                  className="w-64 h-64 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: style.backgroundColor
                  }}
                >
                  {/* Gradient or Solid Background */}
                  {style.gradientType && style.gradientColors && (
                    <div 
                      className="absolute inset-0 opacity-50"
                      style={{
                        background: `${style.gradientType}-gradient(${style.gradientType === 'linear' ? `${style.gradientColors.direction}deg` : 'circle'}, ${style.gradientColors.start}, ${style.gradientColors.end})`
                      }}
                    />
                  )}

                  {/* Logo if present */}
                  {style.logo && (
                    <div 
                      className={cn(
                        "absolute",
                        "transform -translate-x-1/2 -translate-y-1/2",
                        "left-1/2 top-1/2",
                        "rounded-lg",
                        "overflow-hidden"
                      )}
                      style={{
                        width: `${style.logoSize || 20}%`,
                        height: `${style.logoSize || 20}%`,
                        padding: style.logoPadding,
                        backgroundColor: style.logoBackgroundColor,
                        opacity: style.logoOpacity,
                      }}
                    >
                      <img 
                        src={style.logo} 
                        alt="QR Logo" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  {/* Shadow Effect */}
                  {style.shadow && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        boxShadow: `${style.shadowOffsetX || 0}px ${style.shadowOffsetY || 0}px ${style.shadowBlur || 0}px ${style.shadowColor || 'rgba(0,0,0,0.1)'}`
                      }}
                    />
                  )}
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {/* Pattern Settings */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Pattern
            </Label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 rounded-md bg-muted">
                <div className="text-muted-foreground">Dot Style</div>
                <div className="font-medium capitalize">{style.dotStyle || 'Default'}</div>
              </div>
              <div className="p-2 rounded-md bg-muted">
                <div className="text-muted-foreground">Corner Style</div>
                <div className="font-medium capitalize">{style.cornerStyle || 'Default'}</div>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Paintbrush className="h-4 w-4" />
              Colors
            </Label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 rounded-md bg-muted">
                <div className="text-muted-foreground">Foreground</div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: style.foregroundColor }}
                  />
                  <span className="font-medium">{style.foregroundColor}</span>
                </div>
              </div>
              <div className="p-2 rounded-md bg-muted">
                <div className="text-muted-foreground">Background</div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: style.backgroundColor }}
                  />
                  <span className="font-medium">{style.backgroundColor}</span>
                </div>
              </div>
              {style.gradientColors && (
                <div className="col-span-2 p-2 rounded-md bg-muted">
                  <div className="text-muted-foreground">Gradient</div>
                  <div className="font-medium">
                    {style.gradientType} - {style.gradientColors.direction}°
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div 
                      className="w-full h-4 rounded"
                      style={{
                        background: `${style.gradientType}-gradient(${style.gradientType === 'linear' ? `${style.gradientColors.direction}deg` : 'circle'}, ${style.gradientColors.start}, ${style.gradientColors.end})`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Frame */}
          {style.frame && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Frame className="h-4 w-4" />
                Frame
              </Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 rounded-md bg-muted">
                  <div className="text-muted-foreground">Style</div>
                  <div className="font-medium capitalize">{style.frameStyle}</div>
                </div>
                <div className="p-2 rounded-md bg-muted">
                  <div className="text-muted-foreground">Size</div>
                  <div className="font-medium">{style.frameSize}px</div>
                </div>
              </div>
            </div>
          )}

          {/* Logo */}
          {style.logo && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Logo
              </Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 rounded-md bg-muted">
                  <div className="text-muted-foreground">Size</div>
                  <div className="font-medium">{style.logoSize}%</div>
                </div>
                <div className="p-2 rounded-md bg-muted">
                  <div className="text-muted-foreground">Padding</div>
                  <div className="font-medium">{style.logoPadding}px</div>
                </div>
              </div>
            </div>
          )}

          {/* Technical Details */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Technical
            </Label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 rounded-md bg-muted">
                <div className="text-muted-foreground">Size</div>
                <div className="font-medium">{style.size}px</div>
              </div>
              <div className="p-2 rounded-md bg-muted">
                <div className="text-muted-foreground">Error Correction</div>
                <div className="font-medium">Level {style.errorCorrection}</div>
              </div>
              <div className="p-2 rounded-md bg-muted">
                <div className="text-muted-foreground">Margin</div>
                <div className="font-medium">{style.margin} modules</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Content Preview */}
      <div className="p-4 rounded-lg bg-muted space-y-2">
        <Label className="text-sm text-muted-foreground">Content</Label>
        <div className="font-mono text-xs break-all">
          {formatContent(data)}
        </div>
      </div>
    </div>
  );
}

function formatContent(data: QRCodeData): string {
  switch (data.type) {
    case 'url':
      return data.url;
    case 'text':
      return data.text;
    case 'email':
      return `mailto:${data.email}${data.subject ? `?subject=${data.subject}` : ''}`;
    case 'phone':
      return `tel:${data.phone}`;
    case 'sms':
      return `sms:${data.phone}${data.message ? `?body=${data.message}` : ''}`;
    case 'wifi':
      return `WIFI:T:${data.networkType};S:${data.ssid};P:${data.password};H:${data.hidden};`;
    case 'vcard':
      return `BEGIN:VCARD\nVERSION:3.0\nN:${data.lastName};${data.firstName}\nORG:${data.organization}\nTITLE:${data.title}\nEMAIL:${data.email}\nTEL:${data.phone}\nURL:${data.website}\nADR:${data.address}\nEND:VCARD`;
    case 'location':
      return `geo:${data.latitude},${data.longitude}${data.name ? `(${data.name})` : ''}`;
    default:
      return 'Invalid content';
  }
}