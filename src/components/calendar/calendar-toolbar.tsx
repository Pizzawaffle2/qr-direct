// src/components/calendar/calendar-toolbar.tsx
import {memo, useState, useCallback } from 'react';
import {Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Label } from '@/components/ui/label';
import {cn } from '@/lib/utils';

// Types
interface CalendarSettings {
  theme: string;
  frame: string;
  font: string;
}

interface CalendarToolbarProps {
  settings: CalendarSettings;
  onSettingsChange: (key: keyof CalendarSettings, value: string) => void;
  className?: string;
}

// Options
const OPTIONS = {
  theme: [
    { value: 'default', label: 'Default' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
  ],
  frame: [
    { value: 'none', label: 'None' },
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'autumn', label: 'Autumn' },
    { value: 'winter', label: 'Winter' },
  ],
  font: [
    { value: 'arial', label: 'Arial' },
    { value: 'serif', label: 'Serif' },
    { value: 'mono', label: 'Monospace' },
    { value: 'inter', label: 'Inter' },
    { value: 'roboto', label: 'Roboto' },
  ],
} as const;

// Select Component
const ToolbarSelect = memo(
  ({
    label,
    value,
    options,
    onChange,
  }: {
    label: string;
    value: string;
    options: readonly { value: string; label: string }[];
    onChange: (value: string) => void;
  }) => {
    return (
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-gray-200">{label}</Label>
        <Select defaultValue={value} onValueChange={onChange}>
          <SelectTrigger className="w-[180px] border-gray-700 bg-gray-800/50">
            <SelectValue placeholder={`Select ${label}`} />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-gray-200 hover:bg-gray-700"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);

ToolbarSelect.displayName = 'ToolbarSelect';

// Main Toolbar Component
export const CalendarToolbar = memo(
  ({ settings, onSettingsChange, className }: CalendarToolbarProps) => {
    // Safe change handler
    const handleChange = (key: keyof CalendarSettings) => (value: string) => {
      try {
        onSettingsChange(key, value);
      } catch (error) {
        console.error(`Failed to update ${key}:`, error);
      }
    };

    return (
      <div
        className={cn(
          'flex flex-wrap gap-6 p-4',
          'border-b border-gray-200/10 bg-gray-900/50',
          className
        )}
      >
        <ToolbarSelect
          label="Theme"
          value={settings.theme}
          options={OPTIONS.theme}
          onChange={handleChange('theme')}
        />
        <ToolbarSelect
          label="Frame"
          value={settings.frame}
          options={OPTIONS.frame}
          onChange={handleChange('frame')}
        />
        <ToolbarSelect
          label="Font"
          value={settings.font}
          options={OPTIONS.font}
          onChange={handleChange('font')}
        />
      </div>
    );
  }
);

CalendarToolbar.displayName = 'CalendarToolbar';

// Usage Example
export function Calendar() {
  const [settings, setSettings] = useState<CalendarSettings>({
    theme: 'default',
    frame: 'none',
    font: 'arial',
  });

  const handleSettingsChange = useCallback((key: keyof CalendarSettings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  return (
    <div className="overflow-hidden rounded-lg bg-gray-900">
      <CalendarToolbar
        settings={settings}
        onSettingsChange={handleSettingsChange}
        className="sticky top-0 z-10"
      />
      {/* Calendar content */}
    </div>
  );
}

// Utility function to validate settings
export function validateSettings(settings: Partial<CalendarSettings>): CalendarSettings {
  return {
    theme: OPTIONS.theme.some((opt) => opt.value === settings.theme) ? settings.theme! : 'default',
    frame: OPTIONS.frame.some((opt) => opt.value === settings.frame) ? settings.frame! : 'none',
    font: OPTIONS.font.some((opt) => opt.value === settings.font) ? settings.font! : 'arial',
  };
}
