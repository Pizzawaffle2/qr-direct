// src/components/qr/preview.tsx

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Paintbrush, 
  Image as ImageIcon, 
  Grid, 
  Frame, 
  QrCode,
  Shield,
  Palette 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  QRCodeData, 
  QRStyleOptions, 
  ERROR_CORRECTION_LEVELS,
  QRCodeType // Import QRCodeType
} from "@/types/qr";
import { QRCodeSVG } from "qrcode.react";
import styles from "./preview.module.css";

const QRPreview = ({ data, style: rawStyle }: { data: QRCodeData, style: QRStyleOptions }) => {
  const style = useMemo(() => ({
    dotStyle: 'square' as const,
    cornerStyle: 'square' as const,
    cornerDotStyle: 'square' as const,
    ...rawStyle
  }), [rawStyle]);

  const [previewTab, setPreviewTab] = useState<"preview" | "details">("preview");
  const [cssVars, setCssVars] = useState<React.CSSProperties>({});

  const getAnimationClasses = () => {
    if (!rawStyle.animated) return '';
    
    const classes = ['transition-all'];
    
    if (rawStyle.animationType) {
      switch (rawStyle.animationType) {
        case 'fade':
          classes.push('animate-fade-in');
          break;
        case 'slide':
          classes.push('animate-slide-in-up');
          break;
        case 'bounce':
          classes.push('animate-float');
          break;
      }
    }

    return classes.join(' ');
  };

  useEffect(() => {
    const vars = {
      '--qr-foreground-color': style.foregroundColor,
      '--qr-background-color': style.backgroundColor,
      '--qr-frame-color': style.frameColor || 'currentColor',
      '--qr-frame-text-color': style.frameTextColor || 'currentColor',
      '--qr-logo-size': style.logoSize ? `${style.logoSize}%` : '20%',
      '--qr-logo-padding': style.logoPadding ? `${style.logoPadding}px` : '0px',
      '--qr-logo-background': style.logoBackgroundColor || 'transparent',
      '--qr-logo-opacity': style.logoOpacity || 1,
      '--qr-shadow-color': style.shadowColor || 'rgba(0,0,0,0.1)',
      '--qr-shadow-blur': style.shadowBlur ? `${style.shadowBlur}px` : '0px',
      '--qr-shadow-offset-x': style.shadowOffsetX ? `${style.shadowOffsetX}px` : '0px',
      '--qr-shadow-offset-y': style.shadowOffsetY ? `${style.shadowOffsetY}px` : '0px',
      '--qr-gradient': style.gradientType && style.gradientColors 
        ? `${style.gradientType}-gradient(${
            style.gradientType === 'linear' 
              ? `${style.gradientColors.direction || 0}deg` 
              : 'circle'
          }, ${style.gradientColors.start}, ${style.gradientColors.end})`
        : 'none',
      '--transition-duration': rawStyle.animationDuration 
        ? `${rawStyle.animationDuration}ms` 
        : '300ms'
    } as React.CSSProperties;

    setCssVars(vars);
  }, [style, rawStyle.animationDuration]);

  const formatContent = (data: QRCodeData): string => {
    try {
      switch (data.type) {
        case 'url':
          return data.url;

        case 'text':
          return data.text;

        case 'email': {
          const emailContent = `mailto:${data.email}`;
          const params = new URLSearchParams();
          if (data.subject) params.append('subject', data.subject);
          if (data.body) params.append('body', data.body);
          return params.toString() ? `${emailContent}?${params.toString()}` : emailContent;
        }

        case 'phone':
          return `tel:${data.phone}`;

        case 'sms': {
          const smsContent = `sms:${data.phone}`;
          return data.message ? `${smsContent}?body=${encodeURIComponent(data.message)}` : smsContent;
        }

        case 'wifi':
          return `WIFI:T:${data.networkType};S:${data.ssid};P:${data.password || ''};H:${data.hidden ? 'true' : 'false'};`;

        case 'vcard': {
          const vcard = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `N:${data.lastName || ''};${data.firstName}`,
            data.organization ? `ORG:${data.organization}` : '',
            data.title ? `TITLE:${data.title}` : '',
            data.email ? `EMAIL:${data.email}` : '',
            data.phone ? `TEL:${data.phone}` : '',
            data.website ? `URL:${data.website}` : '',
            data.address ? `ADR:${data.address}` : '',
            'END:VCARD'
          ].filter(Boolean).join('\n');
          return vcard;
        }

        case 'location': {
          const coords = `${data.latitude},${data.longitude}`;
          return data.name ? `geo:${coords}(${encodeURIComponent(data.name)})` : `geo:${coords}`;
        }

        default:
          return 'Unsupported content type';
      }
    } catch (error) {
      console.error('Error formatting QR content:', error);
      return 'Error formatting content';
    }
  };

  const QRCodeType = {
    url: { name: 'URL', description: 'Website link', icon: <QrCode className="h-4 w-4" /> },
    text: { name: 'Text', description: 'Plain text', icon: <Paintbrush className="h-4 w-4" /> },
    email: { name: 'Email', description: 'Email address', icon: <Frame className="h-4 w-4" /> },
    phone: { name: 'Phone', description: 'Phone number', icon: <Grid className="h-4 w-4" /> },
    sms: { name: 'SMS', description: 'Text message', icon: <Grid className="h-4 w-4" /> },
    wifi: { name: 'Wi-Fi', description: 'Network credentials', icon: <Shield className="h-4 w-4" /> },
    vcard: { name: 'vCard', description: 'Contact information', icon: <ImageIcon className="h-4 w-4" /> },
    location: { name: 'Location', description: 'Geographic coordinates', icon: <Frame className="h-4 w-4" /> }
  };

  const getQRTypeInfo = () => {
    const defaultTypeInfo = {
      name: 'Unknown',
      description: 'Unknown type',
      icon: null
    };
  
    return QRCodeType[data.type as keyof typeof QRCodeType] ?? defaultTypeInfo;
  };

  const qrValue = useMemo(() => {
    try {
      switch (data.type) {
        case 'url':
          return data.url;
        case 'text':
          return data.text;
        case 'email':
          return `mailto:${data.email}?subject=${encodeURIComponent(data.subject || '')}&body=${encodeURIComponent(data.body || '')}`;
        case 'phone':
          return `tel:${data.phone}`;
        case 'sms':
          return `sms:${data.phone}${data.message ? `?body=${encodeURIComponent(data.message)}` : ''}`;
        case 'wifi':
          return `WIFI:T:${data.networkType};S:${data.ssid};P:${data.password};;`;
        case 'vcard': {
          const vcard = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `N:${data.lastName || ''};${data.firstName}`,
            data.organization ? `ORG:${data.organization}` : '',
            data.title ? `TITLE:${data.title}` : '',
            data.email ? `EMAIL:${data.email}` : '',
            data.phone ? `TEL:${data.phone}` : '',
            data.website ? `URL:${data.website}` : '',
            data.address ? `ADR:${data.address}` : '',
            'END:VCARD'
          ].filter(Boolean).join('\n');
          return vcard;
        }
        case 'location': {
          const coords = `${data.latitude},${data.longitude}`;
          return data.name ? `geo:${coords}(${encodeURIComponent(data.name)})` : `geo:${coords}`;
        }
        default:
          return 'Unsupported content type';
      }
    } catch (error) {
      console.error('Error formatting QR content:', error);
      return 'Error formatting content';
    }
  }, [data]);

  const getCustomCells = (cells: boolean[][]) => {
    return cells.map((row, i) => 
      row.map((cell, j) => {
        if (!cell) return null;
        
        const isCorner = (
          (i < 7 && j < 7) || 
          (i < 7 && j >= cells.length - 7) || 
          (i >= cells.length - 7 && j < 7)
        );

        if (isCorner) {
          return style.cornerStyle === 'dots' ? 'circle' :
                 style.cornerStyle === 'rounded' ? 'rounded' : 'square';
        }

        return style.dotStyle === 'dots' ? 'circle' :
               style.dotStyle === 'rounded' ? 'rounded' :
               style.dotStyle === 'classy' ? 'classy' :
               style.dotStyle === 'sharp' ? 'sharp' : 'square';
      })
    );
  };

  return (
    <div className={cn("space-y-4", rawStyle.animated && getAnimationClasses())}>
      <Tabs value={previewTab} onValueChange={(v) => setPreviewTab(v as typeof previewTab)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <Card 
            className={cn(
              "flex items-center justify-center aspect-square bg-white dark:bg-gray-950 relative overflow-hidden p-4",
              getAnimationClasses()
            )}
            style={cssVars}
          >
            <div className="relative w-full h-full">
              {style.frame && (
                <div 
                  className={cn(
                    "absolute inset-4 border-2 rounded-lg flex items-center justify-center",
                    style.frameStyle === 'modern' && "border-[3px]",
                    style.frameStyle === 'vintage' && "border-double border-4"
                  )}
                  style={{ 
                    borderColor: 'var(--qr-frame-color)',
                    backgroundColor: 'var(--qr-background-color)'
                  }}
                >
                  {style.frameText && (
                    <div 
                      className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-2 text-sm bg-white dark:bg-gray-950"
                      style={{ color: 'var(--qr-frame-text-color)' }}
                    >
                      {style.frameText}
                    </div>
                  )}
                </div>
              )}

              <div 
                className={cn(
                  "w-full h-full rounded-lg flex items-center justify-center",
                  style.shadow && "shadow-lg"
                )}
                style={{
                  backgroundColor: 'var(--qr-background-color)',
                  backgroundImage: 'var(--qr-gradient)',
                  boxShadow: style.shadow ? 
                    'var(--qr-shadow-offset-x) var(--qr-shadow-offset-y) var(--qr-shadow-blur) var(--qr-shadow-color)' : 
                    undefined
                }}
              >
                <QRCodeSVG
                  value={qrValue}
                  size={style.size}
                  level={style.errorCorrection}
                  bgColor={style.backgroundColor}
                  fgColor={style.foregroundColor}
                  includeMargin={Boolean(style.margin)}
                  imageSettings={style.logo ? {
                    src: style.logo,
                    height: (style.logoSize || 20) * style.size / 100,
                    width: (style.logoSize || 20) * style.size / 100,
                    excavate: true
                  } : undefined}
                  shapeRendering="geometricPrecision"
                />

                {style.logo && (
                  <div 
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      width: 'var(--qr-logo-size)',
                      padding: 'var(--qr-logo-padding)',
                      backgroundColor: 'var(--qr-logo-background)',
                      opacity: 'var(--qr-logo-opacity)'
                    }}
                  >
                    <img 
                      src={style.logo} 
                      alt="QR Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="p-4 rounded-lg bg-muted space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              {getQRTypeInfo().icon && <span className="opacity-70">{getQRTypeInfo().name}</span>}
            </Label>
            <div className="font-mono text-xs break-all">
              {formatContent(data)}
            </div>
          </div>

          <StyleDetail 
            icon={<Palette className="h-4 w-4" />}
            label="Colors"
            items={[
              { label: 'Foreground', value: style.foregroundColor },
              { label: 'Background', value: style.backgroundColor },
              ...(style.gradientType ? [{ 
                label: 'Gradient', 
                value: `${style.gradientType} ${style.gradientColors?.direction || 0}°` 
              }] : [])
            ]}
          />
          
          <StyleDetail 
            icon={<Grid className="h-4 w-4" />}
            label="Pattern"
            items={[
              { label: 'Dot Style', value: style.dotStyle },
              { label: 'Corner Style', value: style.cornerStyle },
              { label: 'Size', value: `${style.size}px` },
              { label: 'Margin', value: `${style.margin}px` }
            ]}
          />

          <StyleDetail 
            icon={<Shield className="h-4 w-4" />}
            label="Error Correction"
            items={[{
              label: ERROR_CORRECTION_LEVELS[style.errorCorrection]?.label ?? 'Unknown',
              value: ERROR_CORRECTION_LEVELS[style.errorCorrection]?.description ?? 'Unknown level'
            }]}
          />

          {style.logo && (
            <StyleDetail 
              icon={<ImageIcon className="h-4 w-4" />}
              label="Logo"
              items={[
                { label: 'Size', value: `${style.logoSize}%` },
                { label: 'Padding', value: `${style.logoPadding}px` },
                ...(style.logoOpacity ? [{ label: 'Opacity', value: `${style.logoOpacity * 100}%` }] : [])
              ]}
            />
          )}

          {style.frame && (
            <StyleDetail 
              icon={<Frame className="h-4 w-4" />}
              label="Frame"
              items={[
                { label: 'Style', value: style.frameStyle },
                { label: 'Size', value: `${style.frameSize}px` }
              ]}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StyleDetail({ 
  icon, 
  label, 
  items 
}: { 
  icon: React.ReactNode; 
  label: string; 
  items: Array<{ label: string; value?: string | number }> 
}) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {items.map((item, index) => (
          <div key={index} className="p-2 rounded-md bg-muted">
            <div className="text-muted-foreground">{item.label}</div>
            <div className="font-medium">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QRPreview;