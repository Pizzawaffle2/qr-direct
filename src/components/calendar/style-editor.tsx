"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Palette, 
  Layout, 
  Type, 
  Settings,
  Calendar,
  Moon,
  Cloud,
  Sun
} from "lucide-react";
import { THEME_OPTIONS, FRAME_OPTIONS, FONT_OPTIONS } from "./constants";
import type { CalendarTheme } from "@/types/calendar-themes";

interface StyleEditorProps {
  value: CalendarTheme;
  onChange: (value: CalendarTheme) => void;
}

export function StyleEditor({ value, onChange }: StyleEditorProps) {
  const updateTheme = (path: string[], newValue: any) => {
    const newTheme = { ...value };
    let current = newTheme as any;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = newValue;
    onChange(newTheme);
  };

  return (
    <Tabs defaultValue="theme" className="space-y-4">
      <TabsList>
        <TabsTrigger value="theme" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span>Theme</span>
        </TabsTrigger>
        <TabsTrigger value="layout" className="flex items-center gap-2">
          <Layout className="h-4 w-4" />
          <span>Layout</span>
        </TabsTrigger>
        <TabsTrigger value="typography" className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          <span>Typography</span>
        </TabsTrigger>
        <TabsTrigger value="features" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Features</span>
        </TabsTrigger>
      </TabsList>

      {/* Theme Settings */}
      <TabsContent value="theme" className="space-y-6">
        {/* Color Picker Section */}
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Theme Style</Label>
            <Select
              value={value.themeStyle}
              onValueChange={(themeStyle) => updateTheme(['themeStyle'], themeStyle)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {THEME_OPTIONS.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Frame Style</Label>
            <Select
              value={value.frame.borderStyle}
              onValueChange={(style) => updateTheme(['frame', 'borderStyle'], style)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frame style" />
              </SelectTrigger>
              <SelectContent>
                {FRAME_OPTIONS.map((frame) => (
                  <SelectItem key={frame.value} value={frame.value}>
                    {frame.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Colors</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Primary</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={value.colors.primary}
                    onChange={(e) => updateTheme(['colors', 'primary'], e.target.value)}
                  />
                  <Input
                    type="color"
                    value={value.colors.primary}
                    onChange={(e) => updateTheme(['colors', 'primary'], e.target.value)}
                    className="w-12 p-1"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">Background</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={value.colors.background}
                    onChange={(e) => updateTheme(['colors', 'background'], e.target.value)}
                  />
                  <Input
                    type="color"
                    value={value.colors.background}
                    onChange={(e) => updateTheme(['colors', 'background'], e.target.value)}
                    className="w-12 p-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Layout Settings */}
      <TabsContent value="layout" className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Start Week on Monday</Label>
              <p className="text-sm text-muted-foreground">Change first day of the week</p>
            </div>
            <Switch
              checked={value.firstDayOfWeek === 1}
              onCheckedChange={(checked) => updateTheme(['firstDayOfWeek'], checked ? 1 : 0)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Week Numbers</Label>
              <p className="text-sm text-muted-foreground">Display week numbers in the calendar</p>
            </div>
            <Switch
              checked={value.showWeekNumbers}
              onCheckedChange={(checked) => updateTheme(['showWeekNumbers'], checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Month Layout ({value.monthsPerRow} per row)</Label>
            <Slider
              value={[value.monthsPerRow]}
              min={1}
              max={4}
              step={1}
              onValueChange={([monthsPerRow]) => updateTheme(['monthsPerRow'], monthsPerRow)}
            />
          </div>
        </div>
      </TabsContent>

      {/* Typography Settings */}
      <TabsContent value="typography" className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select
              value={value.typography.fontFamily}
              onValueChange={(font) => updateTheme(['typography', 'fontFamily'], font)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Text Sizes</Label>
            <div className="grid gap-4">
              <div>
                <Label className="text-sm">Headers</Label>
                <Select
                  value={value.typography.headerSize}
                  onValueChange={(size) => updateTheme(['typography', 'headerSize'], size)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="base">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm">Dates</Label>
                <Select
                  value={value.typography.dateSize}
                  onValueChange={(size) => updateTheme(['typography', 'dateSize'], size)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="base">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Features Settings */}
      <TabsContent value="features" className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <div>
                <Label>Lunar Phases</Label>
                <p className="text-sm text-muted-foreground">Show moon phases in calendar</p>
              </div>
            </div>
            <Switch
              checked={value.options.showLunarPhases}
              onCheckedChange={(checked) => updateTheme(['options', 'showLunarPhases'], checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <div>
                <Label>Holidays</Label>
                <p className="text-sm text-muted-foreground">Display holidays and special dates</p>
              </div>
            </div>
            <Switch
              checked={value.options.showHolidays}
              onCheckedChange={(checked) => updateTheme(['options', 'showHolidays'], checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              <div>
                <Label>Weather</Label>
                <p className="text-sm text-muted-foreground">Show weather information</p>
              </div>
            </div>
            <Switch
              checked={value.options.showWeather}
              onCheckedChange={(checked) => updateTheme(['options', 'showWeather'], checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <div>
                <Label>Notes Section</Label>
                <p className="text-sm text-muted-foreground">Add notes area to calendar</p>
              </div>
            </div>
            <Switch
              checked={value.options.showNotes}
              onCheckedChange={(checked) => updateTheme(['options', 'showNotes'], checked)}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}