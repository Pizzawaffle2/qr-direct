"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Download, Share2, Eye, Plus, Calendar } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { CalendarPreview } from "@/components/calendar/preview";
import { ColorPicker } from "@/components/ui/color-picker";

interface CalendarSettings {
  title: string;
  type: "personal" | "business" | "holiday";
  year: number;
  firstDayOfWeek: 0 | 1;  // 0 for Sunday, 1 for Monday
  showWeekNumbers: boolean;
  months: number[];  // Array of months to include (1-12)
  theme: {
    headerColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
  options: {
    showHolidays: boolean;
    showLunarPhases: boolean;
    showWeather: boolean;
    showNotes: boolean;
  };
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear + i);
const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

export default function NewCalendarPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState<CalendarSettings>({
    title: "",
    type: "personal",
    year: currentYear,
    firstDayOfWeek: 1,
    showWeekNumbers: false,
    months: Array.from({ length: 12 }, (_, i) => i + 1),
    theme: {
      headerColor: "#1a365d",
      backgroundColor: "#ffffff",
      textColor: "#1a202c",
      accentColor: "#3b82f6",
    },
    options: {
      showHolidays: true,
      showLunarPhases: false,
      showWeather: false,
      showNotes: true,
    },
  });

  const handleSave = async () => {
    setIsGenerating(true);
    try {
      // Add your save logic here
      router.push("/dashboard/calendars");
    } catch (error) {
      console.error("Failed to save calendar:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateSettings = (updates: Partial<CalendarSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50 dark:bg-gray-900/50">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container flex h-16 items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="flex items-center gap-2"
          >
            <Link href="/dashboard/calendars">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Create New Calendar</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button size="sm" disabled={isGenerating} onClick={handleSave}>
              {isGenerating ? "Saving..." : "Save Calendar"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Editor */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6">
              <Tabs defaultValue="general">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="options">Options</TabsTrigger>
                </TabsList>
                
                {/* General Settings */}
                <TabsContent value="general" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Calendar Title</Label>
                      <Input
                        id="title"
                        value={settings.title}
                        onChange={(e) => updateSettings({ title: e.target.value })}
                        placeholder="Enter calendar title"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Calendar Type</Label>
                        <Select
                          value={settings.type}
                          onValueChange={(value: CalendarSettings['type']) =>
                            updateSettings({ type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="holiday">Holiday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Select
                          value={settings.year.toString()}
                          onValueChange={(value) =>
                            updateSettings({ year: parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Content Settings */}
                <TabsContent value="content" className="space-y-6">
                  <div className="space-y-4">
                    <Label>Included Months</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {months.map((month, index) => (
                        <Button
                          key={month}
                          variant={settings.months.includes(index + 1) ? "default" : "outline"}
                          onClick={() => {
                            const newMonths = settings.months.includes(index + 1)
                              ? settings.months.filter(m => m !== index + 1)
                              : [...settings.months, index + 1].sort();
                            updateSettings({ months: newMonths });
                          }}
                        >
                          {month}
                        </Button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label>First Day of Week</Label>
                      <div className="flex gap-2">
                        <Button
                          variant={settings.firstDayOfWeek === 0 ? "default" : "outline"}
                          onClick={() => updateSettings({ firstDayOfWeek: 0 })}
                        >
                          Sunday
                        </Button>
                        <Button
                          variant={settings.firstDayOfWeek === 1 ? "default" : "outline"}
                          onClick={() => updateSettings({ firstDayOfWeek: 1 })}
                        >
                          Monday
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Design Settings */}
                <TabsContent value="design" className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Header Color</Label>
                        <ColorPicker
                          color={settings.theme.headerColor}
                          onChange={(color) =>
                            updateSettings({
                              theme: { ...settings.theme, headerColor: color }
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Background Color</Label>
                        <ColorPicker
                          color={settings.theme.backgroundColor}
                          onChange={(color) =>
                            updateSettings({
                              theme: { ...settings.theme, backgroundColor: color }
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Text Color</Label>
                        <ColorPicker
                          color={settings.theme.textColor}
                          onChange={(color) =>
                            updateSettings({
                              theme: { ...settings.theme, textColor: color }
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Accent Color</Label>
                        <ColorPicker
                          color={settings.theme.accentColor}
                          onChange={(color) =>
                            updateSettings({
                              theme: { ...settings.theme, accentColor: color }
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Additional Options */}
                <TabsContent value="options" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Week Numbers</Label>
                        <p className="text-sm text-muted-foreground">
                          Display week numbers in the calendar
                        </p>
                      </div>
                      <Switch
                        checked={settings.showWeekNumbers}
                        onCheckedChange={(checked) =>
                          updateSettings({ showWeekNumbers: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Holidays</Label>
                        <p className="text-sm text-muted-foreground">
                          Include public holidays in the calendar
                        </p>
                      </div>
                      <Switch
                        checked={settings.options.showHolidays}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            options: { ...settings.options, showHolidays: checked }
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Lunar Phases</Label>
                        <p className="text-sm text-muted-foreground">
                          Display moon phases in the calendar
                        </p>
                      </div>
                      <Switch
                        checked={settings.options.showLunarPhases}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            options: { ...settings.options, showLunarPhases: checked }
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notes Section</Label>
                        <p className="text-sm text-muted-foreground">
                          Add a notes section to each month
                        </p>
                      </div>
                      <Switch
                        checked={settings.options.showNotes}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            options: { ...settings.options, showNotes: checked }
                          })
                        }
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div>
            <div className="sticky top-24">
              <Card className="p-6">
                <div className="mb-4 text-lg font-semibold">Preview</div>
                <CalendarPreview settings={settings} />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}