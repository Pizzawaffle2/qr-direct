'use client';

import {useState, useRef, useCallback } from 'react';
import {useRouter } from 'next/navigation';
import Link from 'next/link';
import {format } from 'date-fns';

// UI Components
import {Card } from '@/components/ui/card';
import {Button } from '@/components/ui/button';
import {Input } from '@/components/ui/input';
import {Label } from '@/components/ui/label';
import {Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {Switch } from '@/components/ui/switch';
import {toast } from '@/components/ui/use-toast';
import {HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card';

// Calendar Components
import {CalendarGrid } from '@/components/calendar/calendar-grid';
import {ThemeSelector } from '@/components/calendar/theme-selector';
import {ApplyTheme } from '@/components/calendar/theme-frames';
import PrintButton from '@/components/calendar/print-button';

// Types and Themes
import {CalendarTheme, CalendarEvent } from '@/types/calendar-types';
import {basicThemes,
  holidayThemes,
  seasonalThemes,
} from '@/types/calendar-themes';

// Icons
import {ChevronLeft, ChevronRight, Eye, Plus, Palette, LayoutGrid } from 'lucide-react';

// Combine all themes
const allThemes = [...basicThemes, ...holidayThemes, ...seasonalThemes];

// In NewCalendarPage
interface CalendarSettings {
  title: string;
  type: 'personal' | 'business' | 'holiday';
  year: number;
  firstDayOfWeek: 0 | 1;
  showWeekNumbers: boolean;
  months: number[];
  theme: {
    headerColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
  options: {
    showHolidays: boolean;
    showLunarPhases: boolean;
    showNotes: boolean;
  };
}

const DEFAULT_SETTINGS: CalendarSettings = {
  title: '',
  type: 'personal',
  year: new Date().getFullYear(),
  firstDayOfWeek: 1,
  showWeekNumbers: false,
  months: Array.from({ length: 12 }, (_, i) => i + 1),
  theme: {
    headerColor: '#1a365d',
    backgroundColor: '#ffffff',
    textColor: '#1a202c',
    accentColor: '#3b82f6',
  },
  options: {
    showHolidays: true,
    showLunarPhases: false,
    showNotes: true,
  },
};

export default function NewCalendarPage() {
  const router = useRouter();
  const calendarRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<CalendarSettings>(DEFAULT_SETTINGS);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth());
  const [isEditing, setIsEditing] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<CalendarTheme>(() => {
    // Default to modern theme, or first available theme
    return (
      allThemes.find((theme: CalendarTheme) => theme.id === 'modern') ??
      allThemes[0] ??
      basicThemes[0]
    );
  });

  const handleAddEvent = useCallback((event: CalendarEvent) => {
    setEvents((prev) => [...prev, event]);
  }, []);

  const handleUpdateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, ...updates } : event)));
  }, []);

  const handleRemoveEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, []);

  const updateSettings = useCallback((updates: Partial<CalendarSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleSave = async () => {
    if (!selectedTheme) {
      toast({
        title: 'Error',
        description: 'Please select a theme before saving.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Add your save logic here
      toast({
        title: 'Calendar saved',
        description: 'Your calendar has been saved successfully.',
      });
      router.push('/dashboard/calendars');
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save calendar. Please try again.',
        variant: 'destructive&apos;,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedTheme) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Loading themes...</h2>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/80">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="flex items-center gap-2">
            <Link href="/dashboard/calendars">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="flex-1">
            <Input
              value={settings.title}
              onChange={(e) => updateSettings({ title: e.target.value })}
              placeholder="Untitled Calendar"
              className="h-9 max-w-[300px] border-0 bg-transparent px-0 text-lg font-semibold focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-2">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent side="right" align="center" className="w-56 p-2">
                <p className="text-sm">
                  {isEditing
                    ? &apos;Preview how your calendar will look'
                    : 'Switch back to editing mode'}
                </p>
              </HoverCardContent>
            </HoverCard>
            <PrintButton
              month={activeMonth}
              year={settings.year}
              events={events}
              settings={{
                firstDayOfWeek: settings.firstDayOfWeek,
                showWeekNumbers: settings.showWeekNumbers,
                showHolidays: settings.options.showHolidays,
                showLunarPhases: settings.options.showLunarPhases,
              }}
              theme={selectedTheme}
              title={settings.title}
            />
            <Button size="sm" onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Calendar&apos;}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Calendar Section */}
          <div className="space-y-6 lg:col-span-8">
            <ApplyTheme theme={selectedTheme}>
              <div ref={calendarRef}>
                <Card className="border-0 p-6 shadow-lg dark:bg-gray-800/50">
                  {/* Calendar Navigation */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h2 className="text-2xl font-semibold">
                        {format(new Date(settings.year, activeMonth), &apos;MMMM yyyy')}
                      </h2>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setActiveMonth((prev) => Math.max(0, prev - 1))}
                          disabled={activeMonth === 0}
                          className="h-8 w-8"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setActiveMonth((prev) => Math.min(11, prev + 1))}
                          disabled={activeMonth === 11}
                          className="h-8 w-8"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CalendarGrid
                    month={activeMonth}
                    year={settings.year}
                    events={events}
                    isEditing={isEditing}
                    onAddEvent={handleAddEvent}
                    onUpdateEvent={handleUpdateEvent}
                    onRemoveEvent={handleRemoveEvent}
                    settings={{
                      firstDayOfWeek: settings.firstDayOfWeek,
                      showWeekNumbers: settings.showWeekNumbers,
                      showHolidays: settings.options.showHolidays,
                      showLunarPhases: settings.options.showLunarPhases,
                    }}
                    theme={selectedTheme}
                  />
                </Card>
              </div>
            </ApplyTheme>
          </div>

          {/* Settings Panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <Card className="border-0 shadow-lg dark:bg-gray-800/50">
                <Tabs defaultValue="theme" className="p-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="theme" className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Theme
                    </TabsTrigger>
                    <TabsTrigger value="layout" className="flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4" />
                      Layout
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="theme" className="mt-4 space-y-6">
                    <ThemeSelector
                      currentTheme={selectedTheme?.id || ''}
                      currentMonth={activeMonth}
                      onThemeSelect={(theme) => setSelectedTheme(theme)}
                    />
                  </TabsContent>

                  <TabsContent value="layout" className="mt-4 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>First Day of Week</Label>
                        <div className="flex gap-2">
                          <Button
                            variant={settings.firstDayOfWeek === 0 ? 'default' : 'outline'}
                            onClick={() => updateSettings({ firstDayOfWeek: 0 })}
                            className="flex-1"
                          >
                            Sunday
                          </Button>
                          <Button
                            variant={settings.firstDayOfWeek === 1 ? 'default' : 'outline'}
                            onClick={() => updateSettings({ firstDayOfWeek: 1 })}
                            className="flex-1"
                          >
                            Monday
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Show Week Numbers</Label>
                            <p className="text-sm text-muted-foreground">Display week numbers</p>
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
                            <p className="text-sm text-muted-foreground">Include public holidays</p>
                          </div>
                          <Switch
                            checked={settings.options.showHolidays}
                            onCheckedChange={(checked) =>
                              updateSettings({
                                options: { ...settings.options, showHolidays: checked },
                              })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Show Lunar Phases</Label>
                            <p className="text-sm text-muted-foreground">Display moon phases</p>
                          </div>
                          <Switch
                            checked={settings.options.showLunarPhases}
                            onCheckedChange={(checked) =>
                              updateSettings({
                                options: { ...settings.options, showLunarPhases: checked },
                              })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Notes Section</Label>
                            <p className="text-sm text-muted-foreground">Add notes area</p>
                          </div>
                          <Switch
                            checked={settings.options.showNotes}
                            onCheckedChange={(checked) =>
                              updateSettings({
                                options: { ...settings.options, showNotes: checked },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
