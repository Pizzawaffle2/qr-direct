// File: src/app/settings/settings-form.tsx
"use client";

import { useTransition } from "react";
import { useSettingsStore } from "@/lib/store/setting-store";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { triggerConfetti } from '@/lib/utils/confetti';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Sun,
  Moon,
  Monitor,
  Loader2,
} from "lucide-react";

const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  defaultBackgroundColor: z.string(),
  defaultForegroundColor: z.string(),
  errorCorrectionLevel: z.enum(["L", "M", "Q", "H"]),
  autoDownload: z.boolean(),
  historyLimit: z.number().min(10).max(1000),
});

type SettingsValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  initialSettings: any; // Replace with your Settings type
}

function SettingsForm({ initialSettings }: SettingsFormProps) {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const settings = useSettingsStore();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      theme: (theme as "light" | "dark" | "system") || "system",
      defaultBackgroundColor: initialSettings?.defaultBackgroundColor || "#FFFFFF",
      defaultForegroundColor: initialSettings?.defaultForegroundColor || "#000000",
      errorCorrectionLevel: initialSettings?.errorCorrectionLevel || "M",
      autoDownload: initialSettings?.autoDownload || false,
      historyLimit: initialSettings?.historyLimit || 50,
    },
  });

  const updateSettings = async (data: SettingsValues) => {
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update settings');

      settings.updateSettings(data);
      setTheme(data.theme);
      triggerConfetti();
      
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: SettingsValues) => {
    startTransition(() => {
      updateSettings(data);
    });
  };

  const handleReset = () => {
    form.reset({
      theme: "system",
      defaultBackgroundColor: "#FFFFFF",
      defaultForegroundColor: "#000000",
      errorCorrectionLevel: "M",
      autoDownload: false,
      historyLimit: 50,
    });

    toast({
      title: "Settings Reset",
      description: "Your settings have been reset to defaults.",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto py-24 px-8 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-3xl shadow-2xl transition-all duration-700 ease-in-out animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-400 dark:to-blue-500 neon-glow mb-4">
          Settings
        </h1>
        <p className="text-xl text-gray-800 dark:text-gray-300 leading-relaxed">
          Customize your QR code generation preferences.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 animate-slide-in-up">
          {/* Appearance Settings */}
          <Card className="group relative p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105 duration-700 ease-in-out neon-border-animated">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Appearance</CardTitle>
              <CardDescription>
                Customize the application theme and default QR code colors.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-500">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-yellow-500" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-blue-500" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Color Inputs */}
                <FormField
                  control={form.control}
                  name="defaultBackgroundColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Background Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-4 items-center">
                          <Input
                            type="color"
                            className="w-14 h-14 rounded-full border-none shadow-inner"
                            {...field}
                          />
                          <Input
                            type="text"
                            value={field.value}
                            onChange={field.onChange}
                            className="font-mono rounded-lg shadow-md dark:bg-gray-900"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultForegroundColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default QR Code Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-4 items-center">
                          <Input
                            type="color"
                            className="w-14 h-14 rounded-full border-none shadow-inner"
                            {...field}
                          />
                          <Input
                            type="text"
                            value={field.value}
                            onChange={field.onChange}
                            className="font-mono rounded-lg shadow-md dark:bg-gray-900"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* QR Code Generation Settings */}
          <Card className="group relative p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105 duration-700 ease-in-out neon-border-animated">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">QR Code Generation</CardTitle>
              <CardDescription>
                Configure default QR code generation settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="errorCorrectionLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Error Correction Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-500">
                          <SelectValue placeholder="Select error correction level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="L">Low (7% recovery)</SelectItem>
                        <SelectItem value="M">Medium (15% recovery)</SelectItem>
                        <SelectItem value="Q">Quartile (25% recovery)</SelectItem>
                        <SelectItem value="H">High (30% recovery)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Higher levels make QR codes more reliable but larger.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="autoDownload"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50 dark:bg-gray-900">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-semibold">
                        Auto Download
                      </FormLabel>
                      <FormDescription>
                        Automatically download QR codes after generation.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="scale-125"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="historyLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>History Limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={10}
                        max={1000}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="rounded-lg shadow-md dark:bg-gray-900"
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum number of QR codes to keep in history (10-1000).
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-6 mt-10">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isPending}
              className="py-3 px-8 bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold rounded-lg hover:from-gray-500 hover:to-gray-700 transition-all duration-500"
            >
              Reset to Defaults
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="py-3 px-10 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-500 neon-glow"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default SettingsForm;