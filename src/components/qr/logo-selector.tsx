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

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="preset">Preset Logos</TabsTrigger>
        <TabsTrigger value="upload">Upload Logo</TabsTrigger>
        <TabsTrigger value="position">Position</TabsTrigger>
        <TabsTrigger value="effects">Effects</TabsTrigger>
        <TabsTrigger value="shape">Shape</TabsTrigger>
      </TabsList>

      {/* ... Previous Preset and Upload tabs content ... */}

      <TabsContent value="position" className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Position X ({value.logoPosition?.x || 50}%)</Label>
            <Slider
              value={[value.logoPosition?.x || 50]}
              min={0}
              max={100}
              step={1}
              onValueChange={([x]) => onChange({
                ...value,
                logoPosition: { ...value.logoPosition, x }
              })}
            />
          </div>

          <div className="space-y-2">
            <Label>Position Y ({value.logoPosition?.y || 50}%)</Label>
            <Slider
              value={[value.logoPosition?.y || 50]}
              min={0}
              max={100}
              step={1}
              onValueChange={([y]) => onChange({
                ...value,
                logoPosition: { ...value.logoPosition, y }
              })}
            />
          </div>

          <div className="space-y-2">
            <Label>Rotation ({value.logoRotation || 0}°)</Label>
            <Slider
              value={[value.logoRotation || 0]}
              min={0}
              max={360}
              step={1}
              onValueChange={([logoRotation]) => onChange({
                ...value,
                logoRotation
              })}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="effects" className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Opacity ({(value.logoOpacity || 1) * 100}%)</Label>
            <Slider
              value={[value.logoOpacity ? value.logoOpacity * 100 : 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={([opacity]) => onChange({
                ...value,
                logoOpacity: opacity / 100
              })}
            />
          </div>

          <div className="space-y-2">
            <Label>Blur ({value.logoEffects?.blur || 0}px)</Label>
            <Slider
              value={[value.logoEffects?.blur || 0]}
              min={0}
              max={10}
              step={0.1}
              onValueChange={([blur]) => onChange({
                ...value,
                logoEffects: { ...value.logoEffects, blur }
              })}
            />
          </div>

          <div className="space-y-2">
            <Label>Brightness ({value.logoEffects?.brightness || 100}%)</Label>
            <Slider
              value={[value.logoEffects?.brightness || 100]}
              min={0}
              max={200}
              step={1}
              onValueChange={([brightness]) => onChange({
                ...value,
                logoEffects: { ...value.logoEffects, brightness }
              })}
            />
          </div>

          <div className="space-y-2">
            <Label>Contrast ({value.logoEffects?.contrast || 100}%)</Label>
            <Slider
              value={[value.logoEffects?.contrast || 100]}
              min={0}
              max={200}
              step={1}
              onValueChange={([contrast]) => onChange({
                ...value,
                logoEffects: { ...value.logoEffects, contrast }
              })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Grayscale</Label>
              <Switch
                checked={value.logoEffects?.grayscale || false}
                onCheckedChange={(grayscale) => onChange({
                  ...value,
                  logoEffects: { ...value.logoEffects, grayscale }
                })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Invert</Label>
              <Switch
                checked={value.logoEffects?.invert || false}
                onCheckedChange={(invert) => onChange({
                  ...value,
                  logoEffects: { ...value.logoEffects, invert }
                })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Sepia</Label>
              <Switch
                checked={value.logoEffects?.sepia || false}
                onCheckedChange={(sepia) => onChange({
                  ...value,
                  logoEffects: { ...value.logoEffects, sepia }
                })}
              />
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="shape" className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Logo Shape</Label>
            <Select
              value={value.logoShape}
              onValueChange={(logoShape) => onChange({
                ...value,
                logoShape
              })}
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

          <div className="space-y-2">
            <Label>Border</Label>
            <div className="grid gap-2">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Width"
                  value={value.logoBorder?.width || 0}
                  onChange={(e) => onChange({
                    ...value,
                    logoBorder: {
                      ...value.logoBorder,
                      width: parseInt(e.target.value)
                    }
                  })}
                />
                <Select
                  value={value.logoBorder?.style}
                  onValueChange={(style) => onChange({
                    ...value,
                    logoBorder: { ...value.logoBorder, style }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                    <SelectItem value="dotted">Dotted</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="color"
                  className="w-12"
                  value={value.logoBorder?.color || '#000000'}
                  onChange={(e) => onChange({
                    ...value,
                    logoBorder: {
                      ...value.logoBorder,
                      color: e.target.value
                    }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Shadow</Label>
              <Switch
                checked={value.logoShadow?.enabled || false}
                onCheckedChange={(enabled) => onChange({
                  ...value,
                  logoShadow: { ...value.logoShadow, enabled }
                })}
              />
            </div>
            {value.logoShadow?.enabled && (
              <div className="space-y-2 mt-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Offset X</Label>
                    <Slider
                      value={[value.logoShadow?.x || 0]}
                      min={-20}
                      max={20}
                      step={1}
                      onValueChange={([x]) => onChange({
                        ...value,
                        logoShadow: { ...value.logoShadow, x }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Offset Y</Label>
                    <Slider
                      value={[value.logoShadow?.y || 0]}
                      min={-20}
                      max={20}
                      step={1}
                      onValueChange={([y]) => onChange({
                        ...value,
                        logoShadow: { ...value.logoShadow, y }
                      })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Blur</Label>
                  <Slider
                    value={[value.logoShadow?.blur || 0]}
                    min={0}
                    max={20}
                    step={1}
                    onValueChange={([blur]) => onChange({
                      ...value,
                      logoShadow: { ...value.logoShadow, blur }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Shadow Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={value.logoShadow?.color || 'rgba(0,0,0,0.5)'}
                      onChange={(e) => onChange({
                        ...value,
                        logoShadow: {
                          ...value.logoShadow,
                          color: e.target.value
                        }
                      })}
                    />
                    <Input
                      type="color"
                      className="w-12"
                      value={value.logoShadow?.color || '#000000'}
                      onChange={(e) => onChange({
                        ...value,
                        logoShadow: {
                          ...value.logoShadow,
                          color: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      {/* Preview Section */}
      <div className="mt-6 p-4 border rounded-lg">
        <h3 className="text-sm font-medium mb-4">Live Preview</h3>
        <div className="aspect-square w-full max-w-[200px] mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg relative">
          {value.logo && (
            <div
              className="absolute"
              style={{
                top: `${value.logoPosition?.y || 50}%`,
                left: `${value.logoPosition?.x || 50}%`,
                transform: `translate(-50%, -50%) rotate(${value.logoRotation || 0}deg)`,
                width: `${value.logoSize || 20}%`,
                height: `${value.logoSize || 20}%`,
              }}
            >
              <div
                className="w-full h-full relative"
                style={getLogoStyle()}
              >
                <Image
                  src={value.logo}
                  alt="Logo preview"
                  fill
                  className="object-contain"
                  style={{
                    padding: `${value.logoPadding || 0}px`,
                    backgroundColor: value.logoBackgroundColor || 'transparent',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
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
          Reset Effects
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
          Center Logo
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
          Apply Preset Style
        </Button>
      </div>

      {/* Advanced Options */}
      <div className="mt-6">
        <details className="text-sm">
          <summary className="cursor-pointer font-medium">Advanced Options</summary>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Logo Blend Mode</Label>
              <Select
                value={value.logoBlendMode}
                onValueChange={(logoBlendMode) => onChange({
                  ...value,
                  logoBlendMode
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blend mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="multiply">Multiply</SelectItem>
                  <SelectItem value="screen">Screen</SelectItem>
                  <SelectItem value="overlay">Overlay</SelectItem>
                  <SelectItem value="darken">Darken</SelectItem>
                  <SelectItem value="lighten">Lighten</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Maintain Aspect Ratio</Label>
                <Switch
                  checked={value.logoMaintainAspectRatio || true}
                  onCheckedChange={(logoMaintainAspectRatio) => onChange({
                    ...value,
                    logoMaintainAspectRatio
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Apply Color Overlay</Label>
                <Switch
                  checked={value.logoColorOverlay?.enabled || false}
                  onCheckedChange={(enabled) => onChange({
                    ...value,
                    logoColorOverlay: {
                      ...value.logoColorOverlay,
                      enabled,
                      color: enabled ? (value.logoColorOverlay?.color || '#000000') : undefined,
                      opacity: enabled ? (value.logoColorOverlay?.opacity || 0.5) : undefined,
                    }
                  })}
                />
              </div>
              {value.logoColorOverlay?.enabled && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Input
                    type="color"
                    value={value.logoColorOverlay?.color || '#000000'}
                    onChange={(e) => onChange({
                      ...value,
                      logoColorOverlay: {
                        ...value.logoColorOverlay,
                        color: e.target.value
                      }
                    })}
                  />
                  <Slider
                    value={[value.logoColorOverlay?.opacity || 0.5]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={([opacity]) => onChange({
                      ...value,
                      logoColorOverlay: {
                        ...value.logoColorOverlay,
                        opacity
                      }
                    })}
                  />
                </div>
              )}
            </div>
          </div>
        </details>
      </div>
    </Tabs>
  )
}