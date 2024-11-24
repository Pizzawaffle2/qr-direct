// src/app/dashboard/themes/page.tsx
'use client';

import {useState, useCallback, useMemo } from 'react';
import {useRouter } from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {Button } from '@/components/ui/button';
import {Input } from '@/components/ui/input';
import {Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Grid,
  List,
  Search,
  Filter,
  Calendar,
  Plus,
  MoreHorizontal,
  Eye,
  Download,
  Edit,
  Trash2,
  Share2,
} from 'lucide-react';
import {CALENDAR_THEMES,
  THEME_CATEGORIES,
  getAvailableThemesForMonth,
} from '@/types/calendar-themes';

interface ThemesViewProps {
  defaultMonth?: number;
  onThemeSelect?: (themeId: string) => void;
}

export default function ThemesView({
  defaultMonth = new Date().getMonth(),
  onThemeSelect,
}: ThemesViewProps) {
  const router = useRouter();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const filteredThemes = useMemo(() => {
    let themes = getThemesForMonth(selectedMonth);

    if (selectedCategory !== 'all&apos;) {
      themes = themes.filter((theme) => theme.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      themes = themes.filter(
        (theme) =>
          theme.name?.toLowerCase().includes(query) ||
          theme.description?.toLowerCase().includes(query)
      );
    }

    return themes;
  }, [selectedMonth, selectedCategory, searchQuery]);

  return (
    <div className="container space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar Themes</h1>
          <p className="text-muted-foreground">Browse and apply calendar themes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search themes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.values(THEME_CATEGORIES).map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => setSelectedMonth(parseInt(value))}
          >
            <SelectTrigger className="w-40">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {new Date(0, i).toLocaleString(&apos;default', { month: 'long' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="rounded-md border p-1">
            <Button
              variant={view === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="px-2"
              onClick={() => setView('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="px-2"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Themes Display */}
      {filteredThemes.length > 0 ? (
        view === 'grid&apos; ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredThemes.map((theme) => (
              <Card
                key={theme.id}
                className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
                onClick={() => onThemeSelect?.(theme.id!)}
              >
                <div
                  className="aspect-video p-6"
                  style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderBottom: `1px solid ${theme.colors.border}`,
                  }}
                >
                  <div className="space-y-4">
                    <div
                      className="h-8 rounded"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded"
                          style={{ backgroundColor: theme.colors.secondary }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-1">
                    <h3 className="font-medium">{theme.name}</h3>
                    <p className="text-sm text-muted-foreground">{theme.description}</p>
                    {theme.availableMonths && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Available:{&apos; '}
                        {theme.availableMonths
                          .map((m) => new Date(0, m).toLocaleString('default', { month: 'short' }))
                          .join(', ')}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Available Themes</CardTitle>
              <CardDescription>Select a theme to apply to your calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {filteredThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className="flex cursor-pointer items-center justify-between py-4 hover:bg-muted/50"
                    onClick={() => onThemeSelect?.(theme.id!)}
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium">{theme.name}</h4>
                      <p className="text-sm text-muted-foreground">{theme.description}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <Card className="p-8 text-center">
          <div className="space-y-2">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="font-semibold">No themes found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

function getThemesForMonth(selectedMonth: number) {
  return getAvailableThemesForMonth(selectedMonth) || [];
}
