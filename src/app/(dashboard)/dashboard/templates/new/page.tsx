"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { QRStyleEditor } from "@/components/qr/style-editor";
import { QRPreview } from "@/components/qr/preview";
import { CalendarStyleEditor } from "@/components/calendar/style-editor";
import { CalendarPreview } from "@/components/calendar/preview";
import { 
  ChevronLeft, 
  Save, 
  Eye, 
  Globe, 
  Lock,
  QrCode,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QRStyleOptions } from "@/types/qr";
import { CalendarStyleOptions } from "@/types/calendar";

interface TemplateForm {
  name: string;
  description: string;
  type: 'qr' | 'calendar';
  isPublic: boolean;
  qrStyle?: QRStyleOptions;
  calendarStyle?: CalendarStyleOptions;
}

const defaultQRStyle: QRStyleOptions = {
  size: 300,
  margin: 4,
  errorCorrection: 'M',
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
};

const defaultCalendarStyle: CalendarStyleOptions = {
  // Add your default calendar style options
};

export default function NewTemplatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"settings" | "style" | "preview">("settings");
  
  const [form, setForm] = useState<TemplateForm>({
    name: "",
    description: "",
    type: "qr",
    isPublic: false,
    qrStyle: defaultQRStyle,
    calendarStyle: defaultCalendarStyle,
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Add your template creation logic here
      router.push("/dashboard/templates");
    } catch (error) {
      console.error("Failed to create template:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStyle = (style: any) => {
    if (form.type === 'qr') {
      setForm(prev => ({ ...prev, qrStyle: style }));
    } else {
      setForm(prev => ({ ...prev, calendarStyle: style }));
    }
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
            <Link href="/dashboard/templates">
              <ChevronLeft className="h-4 w-4" />
              Back to Templates
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Create New Template</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveTab("preview")}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button 
              size="sm" 
              disabled={isLoading} 
              onClick={handleSubmit}
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Editor */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="style">Style</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="settings" className="space-y-6">
                    {/* Template Type */}
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant={form.type === 'qr' ? "default" : "outline"}
                        className="h-auto flex-col py-4"
                        onClick={() => setForm(prev => ({ ...prev, type: 'qr' }))}
                      >
                        <QrCode className="h-8 w-8 mb-2" />
                        <span>QR Code Template</span>
                      </Button>
                      <Button
                        variant={form.type === 'calendar' ? "default" : "outline"}
                        className="h-auto flex-col py-4"
                        onClick={() => setForm(prev => ({ ...prev, type: 'calendar' }))}
                      >
                        <Calendar className="h-8 w-8 mb-2" />
                        <span>Calendar Template</span>
                      </Button>
                    </div>

                    {/* Template Info */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Template Name</Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter template name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={form.description}
                          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your template"
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Public Template</Label>
                          <div className="text-sm text-muted-foreground">
                            Make this template available to others
                          </div>
                        </div>
                        <Switch
                          checked={form.isPublic}
                          onCheckedChange={(checked) => setForm(prev => ({ ...prev, isPublic: checked }))}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="style">
                    {form.type === 'qr' ? (
                      <QRStyleEditor
                        value={form.qrStyle ?? defaultQRStyle}
                        onChange={updateStyle}
                      />
                    ) : (
                      <CalendarStyleEditor
                        value={form.calendarStyle ?? defaultCalendarStyle}
                        onChange={updateStyle}
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="preview">
                    {form.type === 'qr' ? (
                      <QRPreview
                        data={{ type: 'text', text: 'Preview Text' }}
                        style={form.qrStyle ?? defaultQRStyle}
                      />
                    ) : (
                      <CalendarPreview
                        style={form.calendarStyle ?? defaultCalendarStyle}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {form.type === 'qr' ? (
                  <QRPreview
                    data={{ type: 'text', text: 'Preview Text' }}
                    style={form.qrStyle ?? defaultQRStyle}
                  />
                ) : (
                  <CalendarPreview
                    style={form.calendarStyle ?? defaultCalendarStyle}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {form.isPublic ? (
                    <>
                      <Globe className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Public template</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Private template</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}