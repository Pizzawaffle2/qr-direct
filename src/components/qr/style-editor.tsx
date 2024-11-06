// src/components/qr/style-editor.tsx

"use client"

import { useState } from "react"
import { QRStyleOptions } from "@/types/qr"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { LogoSelector } from "./logo-selector"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { 
  Palette, 
  Image, 
  Droplets, 
  Box, 
  Grid, 
  Shield,
  Loader2
} from "lucide-react"

interface StyleEditorProps {
  value: QRStyleOptions
  onChange: (value: QRStyleOptions) => void
}

export function StyleEditor({ value, onChange }: StyleEditorProps) {
  const [uploading, setUploading] = useState(false)

  const handleStyleChange = (update: Partial<QRStyleOptions>) => {
    onChange({ ...value, ...update })
  }

  return (
    <Tabs defaultValue="colors" className="space-y-4">
      <TabsList className="grid grid-cols-4 lg:grid-cols-6">
        <TabsTrigger value="colors" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Colors</span>
        </TabsTrigger>
        <TabsTrigger value="patterns" className="flex items-center gap-2">
          <Grid className="h-4 w-4" />
          <span className="hidden sm:inline">Pattern</span>
        </TabsTrigger>
        <TabsTrigger value="logo" className="flex items-center gap-2">
          <Image className="h-4 w-4" />
          <span className="hidden sm:inline">Logo</span>
        </TabsTrigger>
        <TabsTrigger value="corners" className="flex items-center gap-2">
          <Box className="h-4 w-4" />
          <span className="hidden sm:inline">Corners</span>
        </TabsTrigger>
        <TabsTrigger value="style" className="flex items-center gap-2">
          <Droplets className="h-4 w-4" />
          <span className="hidden sm:inline">Style</span>
        </TabsTrigger>
        <TabsTrigger value="error" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Error</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="colors" className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Foreground Color</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  value={value.foregroundColor}
                  onChange={(e) => handleStyleChange({ foregroundColor: e.target.value })}
                  placeholder="#000000"
                />
              </div>
              <Input
                type="color"
                className="w-12 p-1 h-10"
                value={value.foregroundColor}
                onChange={(e) => handleStyleChange({ foregroundColor: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  value={value.backgroundColor}
                  onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
                  placeholder="#FFFFFF"
                />
              </div>
              <Input
                type="color"
                className="w-12 p-1 h-10"
                value={value.backgroundColor}
                onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Use Gradient</Label>
              <Switch
                checked={!!value.gradientType}
                onCheckedChange={(checked) => 
                  handleStyleChange({ 
                    gradientType: checked ? 'linear' : undefined,
                    gradientColors: checked ? { start: value.foregroundColor, end: value.backgroundColor } : undefined
                  })
                }
              />
            </div>
            {value.gradientType && (
              <div className="space-y-4 mt-4">
                <Select
                  value={value.gradientType}
                  onValueChange={(gradientType) => handleStyleChange({ gradientType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gradient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear Gradient</SelectItem>
                    <SelectItem value="radial">Radial Gradient</SelectItem>
                  </SelectContent>
                </Select>

                <div className="space-y-2">
                  <Label>Start Color</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={value.gradientColors?.start}
                        onChange={(e) => handleStyleChange({ 
                          gradientColors: { 
                            ...value.gradientColors, 
                            start: e.target.value 
                          }
                        })}
                        placeholder="#000000"
                      />
                    </div>
                    <Input
                      type="color"
                      className="w-12 p-1 h-10"
                      value={value.gradientColors?.start}
                      onChange={(e) => handleStyleChange({ 
                        gradientColors: { 
                          ...value.gradientColors, 
                          start: e.target.value 
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>End Color</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={value.gradientColors?.end}
                        onChange={(e) => handleStyleChange({ 
                          gradientColors: { 
                            ...value.gradientColors, 
                            end: e.target.value 
                          }
                        })}
                        placeholder="#000000"
                      />
                    </div>
                    <Input
                      type="color"
                      className="w-12 p-1 h-10"
                      value={value.gradientColors?.end}
                      onChange={(e) => handleStyleChange({ 
                        gradientColors: { 
                          ...value.gradientColors, 
                          end: e.target.value 
                        }
                      })}
                    />
                  </div>
                </div>

                {value.gradientType === 'linear' && (
                  <div className="space-y-2">
                    <Label>Gradient Angle ({value.gradientColors?.direction || 0}°)</Label>
                    <Slider
                      value={[value.gradientColors?.direction || 0]}
                      min={0}
                      max={360}
                      step={1}
                      onValueChange={([direction]) => handleStyleChange({
                        gradientColors: {
                          ...value.gradientColors,
                          direction
                        }
                      })}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="patterns" className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Dot Style</Label>
            <Select
              value={value.dotStyle}
              onValueChange={(dotStyle) => handleStyleChange({ dotStyle })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select dot style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="dots">Dots</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="classy">Classy</SelectItem>
                <SelectItem value="sharp">Sharp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Size ({value.size}px)</Label>
            <Slider
              value={[value.size || 300]}
              min={100}
              max={1000}
              step={10}
              onValueChange={([size]) => handleStyleChange({ size })}
            />
          </div>

          <div className="space-y-2">
            <Label>Margin ({value.margin}px)</Label>
            <Slider
              value={[value.margin || 4]}
              min={0}
              max={20}
              step={1}
              onValueChange={([margin]) => handleStyleChange({ margin })}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="logo" className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input
              value={value.logo || ''}
              onChange={(e) => handleStyleChange({ logo: e.target.value })}
              placeholder="https://example.com/logo.png"
            />
          </div>

          {value.logo && (
            <>
              <div className="space-y-2">
                <Label>Logo Size ({value.logoSize || 20}%)</Label>
                <Slider
                  value={[value.logoSize || 20]}
                  min={5}
                  max={40}
                  step={1}
                  onValueChange={([logoSize]) => handleStyleChange({ logoSize })}
                />
              </div>

              <div className="space-y-2">
                <Label>Logo Padding ({value.logoPadding || 0}px)</Label>
                <Slider
                  value={[value.logoPadding || 0]}
                  min={0}
                  max={20}
                  step={1}
                  onValueChange={([logoPadding]) => handleStyleChange({ logoPadding })}
                />
              </div>

              <div className="space-y-2">
                <Label>Logo Background Color</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={value.logoBackgroundColor || '#FFFFFF'}
                      onChange={(e) => handleStyleChange({ logoBackgroundColor: e.target.value })}
                      placeholder="#FFFFFF"
                    />
                  </div>
                  <Input
                    type="color"
                    className="w-12 p-1 h-10"
                    value={value.logoBackgroundColor || '#FFFFFF'}
                    onChange={(e) => handleStyleChange({ logoBackgroundColor: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </TabsContent>

      <TabsContent value="error" className="space-y-4">
        <div className="space-y-2">
          <Label>Error Correction Level</Label>
          <Select
            value={value.errorCorrection}
            onValueChange={(errorCorrection) => handleStyleChange({ errorCorrection })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select error correction level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Low (7%)</SelectItem>
              <SelectItem value="M">Medium (15%)</SelectItem>
              <SelectItem value="Q">High (25%)</SelectItem>
              <SelectItem value="H">Highest (30%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
      <TabsContent value="logo">
        <LogoSelector
          value={{
            logo: value.logo,
            logoSize: value.logoSize,
            logoPadding: value.logoPadding,
            logoBackgroundColor: value.logoBackgroundColor,
          }}
          onChange={(logoOptions) => handleStyleChange(logoOptions)}
        />
      </TabsContent>
    </Tabs>
  )
}