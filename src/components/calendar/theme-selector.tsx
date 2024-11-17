"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Palette, 
  Calendar,
  Sparkles,
  Snowflake,
  Flower,
  Sun,
  Leaf,
  Check
} from "lucide-react";
import { CALENDAR_THEMES, CalendarTheme, ThemeCategory } from "@/types/calendar-themes";
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
  currentTheme: string;
  currentMonth: number;
  onThemeSelect: (theme: CalendarTheme) => void;
}

const categoryIcons = {
  basic: <Palette className="h-4 w-4" />,
  seasonal: <Calendar className="h-4 w-4" />,
  holiday: <Sparkles className="h-4 w-4" />
};

const seasonalIcons = {
  winter: <Snowflake className="h-4 w-4" />,
  spring: <Flower className="h-4 w-4" />,
  summer: <Sun className="h-4 w-4" />,
  fall: <Leaf className="h-4 w-4" />
};

export function ThemeSelector({ currentTheme, currentMonth, onThemeSelect }: ThemeSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory>('basic');
  const [showPreview, setShowPreview] = useState<string | null>(null);

  const availableThemes = Object.values(CALENDAR_THEMES).filter(theme => 
    theme.category === selectedCategory && 
    (!theme.availableMonths || theme.availableMonths.includes(currentMonth))
  );

  return (
    <div className="space-y-4">
      {/* Category Selection */}
      <div className="flex gap-2">
        {(['basic', 'seasonal', 'holiday'] as ThemeCategory[]).map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="flex-1"
          >
            {categoryIcons[category]}
            <span className="ml-2 capitalize">{category}</span>
          </Button>
        ))}
      </div>

      {/* Theme Grid */}
      <ScrollArea className="h-[400px] rounded-md border">
        <div className="grid grid-cols-2 gap-4 p-4">
          {availableThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isSelected={currentTheme === theme.id}
              onSelect={() => onThemeSelect(theme)}
              onPreview={() => setShowPreview(theme.id)}
              onPreviewEnd={() => setShowPreview(null)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

interface ThemeCardProps {
  theme: CalendarTheme;
  isSelected: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onPreviewEnd: () => void;
}

function ThemeCard({ theme, isSelected, onSelect, onPreview, onPreviewEnd }: ThemeCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden cursor-pointer group",
        "transition-all duration-200",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onSelect}
      onMouseEnter={onPreview}
      onMouseLeave={onPreviewEnd}
    >
      {/* Theme Preview */}
      <div 
        className="aspect-[4/3] p-2"
        style={{ backgroundColor: theme.colors.background }}
      >
        {/* Frame Preview */}
        <div
          className="w-full h-full rounded border"
          style={{
            borderColor: theme.colors.border,
            borderWidth: '2px',
            borderStyle: theme.frame.borderStyle
          }}
        >
          {/* Content Preview */}
          <div className="p-2">
            <div 
              className="h-4 w-1/2 rounded"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <div 
              className="mt-2 h-2 w-3/4 rounded"
              style={{ backgroundColor: theme.colors.secondary }}
            />
          </div>
        </div>
      </div>

      {/* Theme Info */}
      <div className="p-3 border-t">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{theme.name}</h3>
            <p className="text-xs text-muted-foreground">
              {theme.description}
            </p>
          </div>
          {isSelected && (
            <Check className="h-4 w-4 text-primary" />
          )}
        </div>
      </div>

      {/* Color Palette Preview */}
      <div className="absolute bottom-0 left-0 right-0 h-1 flex">
        {Object.values(theme.colors).map((color, i) => (
          <div
            key={i}
            className="flex-1 h-full"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </Card>
  );
}