'use client';

import {useEffect, useState } from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {Label } from '@/components/ui/label';
import {Switch } from '@/components/ui/switch';
import {useTheme } from 'next-themes';
import {Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {useToast } from '@/components/ui/use-toast';

export function AppearanceSettings() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleThemeChange = async (value: string) => {
    try {
      setIsLoading(true);
      setTheme(value);
      // Save preference to user settings
      await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: value }),
      });
      toast({
        title: 'Theme updated',
        description: 'Your theme preference has been saved.',
      });
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to update theme preference.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how the app looks and feels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select defaultValue={theme} onValueChange={handleThemeChange} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">Select your preferred color theme</p>
        </div>

        {/* Animation Settings */}
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="animations" className="flex flex-col space-y-1">
            <span>Animations</span>
            <span className="text-sm text-muted-foreground">
              Enable or disable animations throughout the app
            </span>
          </Label>
          <Switch id="animations" defaultChecked />
        </div>

        {/* Compact Mode */}
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="compact-mode" className="flex flex-col space-y-1">
            <span>Compact Mode</span>
            <span className="text-sm text-muted-foreground">
              Reduce spacing and size of elements
            </span>
          </Label>
          <Switch id="compact-mode" />
        </div>

        {/* Color Preferences */}
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="custom-colors" className="flex flex-col space-y-1">
            <span>Custom Colors</span>
            <span className="text-sm text-muted-foreground">
              Use custom brand colors in QR codes
            </span>
          </Label>
          <Switch id="custom-colors" />
        </div>
      </CardContent>
    </Card>
  );
}
