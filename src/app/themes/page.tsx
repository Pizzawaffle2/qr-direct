// src/app/themes/page.tsx
'use client';

import {useState, useMemo, useEffect } from 'react';
import {Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Input } from '@/components/ui/input';
import {Filter, Search } from 'lucide-react';
import {ThemeCard } from '@/components/themes/theme-card';
import {basicThemes } from '@/types/calendar-themes/basic-themes';
import {holidayThemes } from '@/types/calendar-themes/holiday-themes';
import {seasonalThemes } from '@/types/calendar-themes/seasonal-themes';
import {THEME_CATEGORIES } from '@/types/calendar-themes/theme-utils';

const allThemes = [...basicThemes, ...holidayThemes, ...seasonalThemes];

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i.toString(),
  label: new Date(0, i).toLocaleString('default', { month: 'long' }),
}));

export default function ThemesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredThemes = useMemo(() => {
    return allThemes.filter((theme) => {
      const matchesSearch =
        theme.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        theme.description?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || theme.category === selectedCategory;
      const matchesMonth = !theme.availableMonths || theme.availableMonths.includes(selectedMonth);
      return matchesSearch && matchesCategory && matchesMonth;
    });
  }, [debouncedSearchQuery, selectedCategory, selectedMonth]);

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Calendar Themes</h1>
            <p className="text-muted-foreground">
              Browse our collection of {allThemes.length} calendar themes
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.values(THEME_CATEGORIES).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => setSelectedMonth(parseInt(value))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {MONTHS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>
            Showing {filteredThemes.length} of {allThemes.length} themes
          </span>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isAvailable={!theme.availableMonths || theme.availableMonths.includes(selectedMonth)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
