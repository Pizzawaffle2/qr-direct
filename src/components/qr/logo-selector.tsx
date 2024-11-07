// src/components/qr/logo-selector.tsx
"use client"

import { useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { DEFAULT_LOGOS } from "@/config/qr-logos"
import { 
  Upload, 
  Move, 
  Droplet, 
  Image as ImageIcon, 
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Layers
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { LogoPreview } from "./logo-preview" // Add this import

interface LogoSelectorProps {
  value: {
    logo?: string
    logoSize?: number
    logoPadding?: number
    logoBackgroundColor?: string
    logoPosition?: {
      x: number
      y: number
    }
    logoRotation?: number
    logoOpacity?: number
    logoEffects?: {
      blur?: number
      brightness?: number
      contrast?: number
      grayscale?: boolean
      invert?: boolean
      sepia?: boolean
    }
    logoShape?: 'square' | 'circle' | 'rounded'
    logoBorder?: {
      width?: number
      color?: string
      style?: 'solid' | 'dashed' | 'dotted'
    }
    logoShadow?: {
      enabled: boolean
      x?: number
      y?: number
      blur?: number
      color?: string
    }
  }
  onChange: (value: any) => void
}

export function LogoSelector({ value, onChange }: LogoSelectorProps) {
  const [activeTab, setActiveTab] = useState("preset")
  const [uploadedLogo, setUploadedLogo] = useState<string>()

  const handleLogoUpload = useCallback(async (file: File) => {
    // Add image optimization
    const optimizedImage = await optimizeImage(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      const uploadedUrl = reader.result as string
      setUploadedLogo(uploadedUrl)
      onChange({ ...value, logo: uploadedUrl })
    }
    reader.readAsDataURL(optimizedImage)
  }, [value, onChange])

  const optimizeImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_SIZE = 1024 // Maximum dimension
        let width = img.width
        let height = img.height

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height && width > MAX_SIZE) {
          height = (height * MAX_SIZE) / width
          width = MAX_SIZE
        } else if (height > MAX_SIZE) {
          width = (width * MAX_SIZE) / height
          height = MAX_SIZE
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => resolve(blob!),
          'image/png',
          0.85 // Quality
        )
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const getLogoStyle = () => {
    const effects = value.logoEffects || {}
    const filters = []

    if (effects.blur) filters.push(`blur(${effects.blur}px)`)
    if (effects.brightness) filters.push(`brightness(${effects.brightness}%)`)
    if (effects.contrast) filters.push(`contrast(${effects.contrast}%)`)
    if (effects.grayscale) filters.push('grayscale(1)')
    if (effects.invert) filters.push('invert(1)')
    if (effects.sepia) filters.push('sepia(1)')

    return {
      filter: filters.join(' '),
      transform: `rotate(${value.logoRotation || 0}deg)`,
      opacity: value.logoOpacity || 1,
      borderRadius: value.logoShape === 'circle' ? '50%' : 
                   value.logoShape === 'rounded' ? '12px' : '0',
      border: value.logoBorder?.width ? 
        `${value.logoBorder.width}px ${value.logoBorder.style || 'solid'} ${value.logoBorder.color || '#000'}` : 
        undefined,
      boxShadow: value.logoShadow?.enabled ?
        `${value.logoShadow.x || 0}px ${value.logoShadow.y || 0}px ${value.logoShadow.blur || 0}px ${value.logoShadow.color || 'rgba(0,0,0,0.5)'}` :
        undefined,
    }
  }

  const logoCategories = Array.from(
    new Set(DEFAULT_LOGOS.basic.map((logo) => logo.category))
  )

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid grid-cols-2 lg:grid-cols-5">
        <TabsTrigger value="preset" className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Presets</span>
        </TabsTrigger>
        <TabsTrigger value="upload" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload</span>
        </TabsTrigger>
        <TabsTrigger value="position" className="flex items-center gap-2">
          <Move className="h-4 w-4" />
          <span className="hidden sm:inline">Position</span>
        </TabsTrigger>
        <TabsTrigger value="effects" className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Effects</span>
        </TabsTrigger>
        <TabsTrigger value="style" className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <span className="hidden sm:inline">Style</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="preset">
        <div className="space-y-4">
          {logoCategories.map((category) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-medium capitalize">{category}</h3>
              <div className="grid grid-cols-4 gap-2">
                {DEFAULT_LOGOS.basic
                  .filter((logo) => logo.category === category)
                  .map((logo) => (
                    <Card
                      key={logo.id}
                      className={cn(
                        "cursor-pointer transition-all hover:scale-105",
                        value.logo === logo.url ? "ring-2 ring-primary" : ""
                      )}
                      onClick={() => onChange({ ...value, logo: logo.url })}
                    >
                      <CardContent className="p-2">
                        <div className="aspect-square relative">
                          <Image
                            src={logo.url}
                            alt={logo.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <p className="text-xs text-center mt-1 truncate">
                          {logo.name}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="upload">
        <div className="space-y-4">
          <div className="grid place-items-center border-2 border-dashed rounded-lg p-8">
            {uploadedLogo ? (
              <div className="space-y-4 text-center">
                <div className="relative w-32 h-32">
                  <Image
                    src={uploadedLogo}
                    alt="Uploaded logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("logo-upload")?.click()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Change Logo</span>
                </Button>
              </div>
            ) : (
              <label
                htmlFor="logo-upload"
                className="cursor-pointer text-center space-y-2"
              >
                <div className="w-32 h-32 rounded-lg border-2 border-dashed grid place-items-center">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Upload Logo
                    </p>
                  </div>
                </div>
              </label>
            )}
          </div>
          <input
            id="logo-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleLogoUpload(file)
            }}
          />
        </div>
      </TabsContent>

      <TabsContent value="position">
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Position X ({value.logoPosition?.x || 50}%)</Label>
            <Slider
              value={[value.logoPosition?.x || 50]}
              min={0}
              max={100}
              step={1}
              onValueChange={([x]) =>
                onChange({
                  ...value,
                  logoPosition: { ...value.logoPosition, x },
                })
              }
            />
          </div>

          <div className="space-y-4">
            <Label>Position Y ({value.logoPosition?.y || 50}%)</Label>
            <Slider
              value={[value.logoPosition?.y || 50]}
              min={0}
              max={100}
              step={1}
              onValueChange={([y]) =>
                onChange({
                  ...value,
                  logoPosition: { ...value.logoPosition, y },
                })
              }
            />
          </div>

          <div className="space-y-4">
            <Label>Rotation ({value.logoRotation || 0}°)</Label>
            <Slider
              value={[value.logoRotation || 0]}
              min={0}
              max={360}
              step={1}
              onValueChange={([logoRotation]) =>
                onChange({
                  ...value,
                  logoRotation,
                })
              }
            />
          </div>

          <div className="space-y-4">
            <Label>Size ({value.logoSize || 20}%)</Label>
            <Slider
              value={[value.logoSize || 20]}
              min={5}
              max={40}
              step={1}
              onValueChange={([logoSize]) =>
                onChange({
                  ...value,
                  logoSize,
                })
              }
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="effects">
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Opacity ({value.logoOpacity ? value.logoOpacity * 100 : 100}%)</Label>
            <Slider
              value={[value.logoOpacity ? value.logoOpacity * 100 : 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={([opacity]) =>
                onChange({
                  ...value,
                  logoOpacity: opacity / 100,
                })
              }
            />
          </div>

          <div className="space-y-4">
            <Label>Blur ({value.logoEffects?.blur || 0}px)</Label>
            <Slider
              value={[value.logoEffects?.blur || 0]}
              min={0}
              max={10}
              step={0.1}
              onValueChange={([blur]) =>
                onChange({
                  ...value,
                  logoEffects: { ...value.logoEffects, blur },
                })
              }
            />
          </div>

          <div className="space-y-4">
            <Label>Brightness ({value.logoEffects?.brightness || 100}%)</Label>
            <Slider
              value={[value.logoEffects?.brightness || 100]}
              min={0}
              max={200}
              step={1}
              onValueChange={([brightness]) =>
                onChange({
                  ...value,
                  logoEffects: { ...value.logoEffects, brightness },
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between space-x-2">
              <Label>Grayscale</Label>
              <Switch
                checked={value.logoEffects?.grayscale || false}
                onCheckedChange={(grayscale) =>
                  onChange({
                    ...value,
                    logoEffects: { ...value.logoEffects, grayscale },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label>Invert</Label>
              <Switch
                checked={value.logoEffects?.invert || false}
                onCheckedChange={(invert) =>
                  onChange({
                    ...value,
                    logoEffects: { ...value.logoEffects, invert },
                  })
                }
              />
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="style">
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Logo Shape</Label>
            <Select
              value={value.logoShape}
              onValueChange={(logoShape) =>
                onChange({
                  ...value,
                  logoShape,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Border</Label>
              <Switch
                checked={!!value.logoBorder?.width}
                onCheckedChange={(enabled) =>
                  onChange({
                    ...value,
                    logoBorder: enabled
                      ? { width: 2, style: "solid", color: "#000000" }
                      : undefined,
                  })
                }
              />
            </div>

            {value.logoBorder && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Width ({value.logoBorder.width}px)</Label>
                    <Slider
                      value={[value.logoBorder.width || 2]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={([width]) =>
                        onChange({
                          ...value,
                          logoBorder: { ...value.logoBorder, width },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Style</Label>
                    <Select
                      value={value.logoBorder.style}
                      onValueChange={(style) =>
                        onChange({
                          ...value,
                          logoBorder: { ...value.logoBorder, style },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Border style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="dashed">Dashed</SelectItem>
                        <SelectItem value="dotted">Dotted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={value.logoBorder.color || "#000000"}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          logoBorder: { ...value.logoBorder, color: e.target.value },
                        })
                      }
                      placeholder="#000000"
                    />
                    <Input
                      type="color"
                      className="w-12 p-1 h-10"
                      value={value.logoBorder.color || "#000000"}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          logoBorder: { ...value.logoBorder, color: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Shadow</Label>
              <Switch
                checked={value.logoShadow?.enabled || false}
                onCheckedChange={(enabled) =>
                  onChange({
                    ...value,
                    logoShadow: enabled
                      ? {
                          enabled: true,
                          x: 0,
                          y: 4,
                          blur: 8,
                          color: "rgba(0,0,0,0.5)",
                        }
                      : undefined,
                  })
                }
              />
            </div>

            {value.logoShadow?.enabled && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Offset X ({value.logoShadow.x || 0}px)</Label>
                    <Slider
                      value={[value.logoShadow.x || 0]}
                      min={-20}
                      max={20}
                      step={1}
                      onValueChange={([x]) =>
                        onChange({
                          ...value,
                          logoShadow: { ...value.logoShadow, x },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Offset Y ({value.logoShadow.y || 0}px)</Label>
                    <Slider
                      value={[value.logoShadow.y || 0]}
                      min={-20}
                      max={20}
                      step={1}
                      onValueChange={([y]) =>
                        onChange({
                          ...value,
                          logoShadow: { ...value.logoShadow, y },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Blur ({value.logoShadow.blur || 0}px)</Label>
                  <Slider
                    value={[value.logoShadow.blur || 0]}
                    min={0}
                    max={20}
                    step={1}
                    onValueChange={([blur]) =>
                      onChange({
                        ...value,
                        logoShadow: { ...value.logoShadow, blur },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={value.logoShadow.color || "rgba(0,0,0,0.5)"}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          logoShadow: { ...value.logoShadow, color: e.target.value },
                        })
                      }
                      placeholder="rgba(0,0,0,0.5)"
                    />
                    <Input
                      type="color"
                      className="w-12 p-1 h-10"
                      value={value.logoShadow.color || "#000000"}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          logoShadow: { ...value.logoShadow, color: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange({
            ...value,
            logoEffects: undefined,
            logoRotation: 0,
            logoOpacity: 1,
          })}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          <span>Reset Effects</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange({
            ...value,
            logoPosition: { x: 50, y: 50 },
          })}
        >
          <Move className="h-4 w-4 mr-2" />
          <span>Center Logo</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange({
            ...value,
            logoShape: "circle",
            logoBorder: {
              width: 2,
              style: "solid",
              color: "#ffffff",
            },
            logoShadow: {
              enabled: true,
              x: 0,
              y: 4,
              blur: 8,
              color: "rgba(0,0,0,0.25)",
            },
          })}
        >
          <Droplet className="h-4 w-4 mr-2" />
          <span>Apply Preset Style</span>
        </Button>
      </div>

{/* Preview - always show it, the component handles empty state */}
<LogoPreview 
  value={value}
  showGrid={true}
/>
</Tabs>
)
}