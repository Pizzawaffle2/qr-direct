// File: src/components/qr-code/logo-uploader.tsx
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Upload } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { socialIcons, IconCategory } from '@/lib/data/social-icons'
import { motion } from 'framer-motion'
import { IconLoader } from '@/components/ui/icon-loader'

interface LogoUploaderProps {
  onLogoSelect: (logo: string) => void
  selectedLogo?: string
  onLogoSizeChange?: (size: number) => void
  onLogoMarginChange?: (margin: number) => void
  logoSize?: number
  logoMargin?: number
}

export function LogoUploader({ 
  onLogoSelect, 
  selectedLogo, 
  onLogoSizeChange, 
  onLogoMarginChange, 
  logoSize = 50, 
  logoMargin = 5 
}: LogoUploaderProps) {
  const [logo, setLogo] = useState<string | null>(selectedLogo || null)
  const [selectedCategory, setSelectedCategory] = useState<IconCategory>('social')
  const { toast } = useToast()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File',
          description: 'Please upload a valid image file (PNG, JPG, SVG)',
          variant: 'destructive',
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setLogo(result)
        onLogoSelect(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleIconSelect = (iconUrl: string) => {
    setLogo(iconUrl)
    onLogoSelect(iconUrl)
  }

  const categories = [
    { value: 'social' as const, label: 'Social' },
    { value: 'business' as const, label: 'Business' },
    { value: 'messaging' as const, label: 'Messaging' },
    { value: 'payment' as const, label: 'Payment' },
    { value: 'media' as const, label: 'Media' },
    { value: 'store' as const, label: 'Stores' },
  ]

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Upload or Select Logo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="gallery" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  type="button"
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedCategory(category.value)
                  }}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="grid grid-cols-4 gap-4">
                {socialIcons
                  .filter((icon) => icon.categories.includes(selectedCategory))
                  .map((icon) => (
                    <motion.div
                      key={icon.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className={`w-full aspect-square p-2 ${
                          logo === icon.icon ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={(e) => {
                          e.preventDefault()
                          handleIconSelect(icon.icon)
                        }}
                      >
                        <IconLoader
                          icon={icon.icon}
                          color={icon.color}
                          size={32}
                          className="w-full h-full object-contain"
                        />
                      </Button>
                      <p className="text-xs text-center mt-1 text-muted-foreground">
                        {icon.name}
                      </p>
                    </motion.div>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:border-primary/50 transition-colors">
              <Label
                htmlFor="logo-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">Upload Logo</span>
                <span className="text-xs text-muted-foreground mt-1">
                  SVG, PNG, JPG up to 2MB
                </span>
              </Label>
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </TabsContent>
        </Tabs>

        {logo && (
          <div className="relative aspect-square w-24 mx-auto">
            {logo.startsWith('data:') ? (
              <img
                src={logo}
                alt="Uploaded logo"
                className="rounded-lg object-contain"
              />
            ) : (
              <IconLoader
                icon={logo}
                color={socialIcons.find(i => i.icon === logo)?.color}
                size={96}
                className="rounded-lg"
              />
            )}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2"
              onClick={(e) => {
                e.preventDefault()
                setLogo(null)
                onLogoSelect('')
              }}
            >
              ✕
            </Button>
          </div>
        )}

        {logo && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Logo Size</Label>
              <Slider
                value={[logoSize]}
                onValueChange={(value) => onLogoSizeChange?.(value[0])}
                min={20}
                max={150}
                step={1}
                className="my-4"
              />
              <div className="text-sm text-muted-foreground text-right">
                {logoSize}px
              </div>
            </div>

            <div className="space-y-2">
              <Label>Logo Margin</Label>
              <Slider
                value={[logoMargin]}
                onValueChange={(value) => onLogoMarginChange?.(value[0])}
                min={0}
                max={20}
                step={1}
                className="my-4"
              />
              <div className="text-sm text-muted-foreground text-right">
                {logoMargin}px
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}