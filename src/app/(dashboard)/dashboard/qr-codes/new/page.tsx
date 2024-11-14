"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRContentForm } from "@/components/qr/content-form";
import { QRStylePicker } from "@/components/qr/style-picker";
import { QRPreview } from "@/components/qr/preview";
import { QR_CODE_TYPES, QRCodeType, QRCodeData, QRStyleOptions } from "@/types/qr";
import { QR_STYLE_PRESETS } from "@/config/qr-style-presets";
import { ChevronLeft, Download, Share2 } from "lucide-react";
import Link from "next/link";

export default function NewQRCodePage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<"content" | "style">("content");
  const [type, setType] = useState<QRCodeType>("url");
  const [data, setData] = useState<QRCodeData>({ type: "url", url: "" });
  const [style, setStyle] = useState<QRStyleOptions>(QR_STYLE_PRESETS[0].style);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = async () => {
    setIsGenerating(true);
    try {
      // Add your save logic here
      router.push("/dashboard/qr-codes");
    } catch (error) {
      console.error("Failed to save QR code:", error);
    } finally {
      setIsGenerating(false);
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
            <Link href="/dashboard/qr-codes">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Create New QR Code</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button size="sm" disabled={isGenerating} onClick={handleSave}>
              {isGenerating ? "Saving..." : "Save QR Code"}
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
              <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as typeof currentTab)}>
                <TabsList className="mb-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6">
                  {/* QR Type Selection */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(QR_CODE_TYPES).map(([key, value]) => (
                      <Button
                        key={key}
                        variant={type === key ? "default" : "outline"}
                        className="h-auto flex-col py-4 px-2"
                        onClick={() => {
                          setType(key as QRCodeType);
                          setData({ type: key as QRCodeType } as QRCodeData);
                        }}
                      >
                        <div className={`${type === key ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                          {value.icon}
                        </div>
                        <span className="mt-2">{value.name}</span>
                      </Button>
                    ))}
                  </div>

                  {/* Content Form */}
                  <div className="mt-6">
                    <QRContentForm
                      type={type}
                      initialData={data}
                      onChange={setData}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="style">
                  <QRStylePicker
                    presets={QR_STYLE_PRESETS}
                    value={style}
                    onChange={setStyle}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div>
            <div className="sticky top-24">
              <Card className="p-6">
                <div className="mb-4 text-lg font-semibold">Preview</div>
                <QRPreview
                  data={data.type === 'url' ? data.url : JSON.stringify(data)}
                  options={style}
                />
                <div className="mt-6 space-y-2">
                  <Button className="w-full" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download PNG
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share QR Code
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}