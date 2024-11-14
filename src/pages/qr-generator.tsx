import React, { useState, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Mock types
interface QRSettings {
  content: string;
  logo?: string;
  style: {
    foreground: string;
    background: string;
    size: number;
  };
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
  </div>
);

// Main component
export default function EnhancedQRGenerator() {
  const [settings, setSettings] = useState<QRSettings>({
    content: '',
    style: {
      foreground: '#000000',
      background: '#ffffff',
      size: 300
    }
  });

  const [activeTab, setActiveTab] = useState('url');

  // Tabs configuration
  const tabs = [
    { id: 'url', label: 'Website URL' },
    { id: 'text', label: 'Plain Text' },
    { id: 'wifi', label: 'WiFi Network' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* QR Type Selector */}
          <Card className="bg-white/5 backdrop-blur">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-2">
                {tabs.map(tab => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Input */}
          <Suspense fallback={<LoadingFallback />}>
            <Card className="bg-white/5 backdrop-blur">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <label className="block text-sm font-medium">
                    {activeTab === 'url' ? 'Enter URL' : 
                     activeTab === 'text' ? 'Enter Text' : 
                     'WiFi Details'}
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-black/20 border border-white/10"
                    value={settings.content}
                    onChange={(e) => setSettings({
                      ...settings,
                      content: e.target.value
                    })}
                    placeholder={activeTab === 'url' ? 'https://example.com' : 
                               activeTab === 'text' ? 'Enter your text here' :
                               'WiFi Network Name'}
                    title="Background Color"
                  />
                </div>
              </CardContent>
            </Card>
          </Suspense>

          {/* Style Options */}
          <Suspense fallback={<LoadingFallback />}>
            <Card className="bg-white/5 backdrop-blur">
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Appearance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Foreground Color</label>
                    <input
                      type="color"
                      value={settings.style.foreground}
                      onChange={(e) => setSettings({
                        ...settings,
                        style: { ...settings.style, foreground: e.target.value }
                      })}
                      className="w-full h-10 rounded cursor-pointer"
                      title="Foreground Color"
                      placeholder="Select foreground color"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Background Color</label>
                    <input
                      type="color"
                      value={settings.style.background}
                      onChange={(e) => setSettings({
                        ...settings,
                        style: { ...settings.style, background: e.target.value }
                      })}
                      className="w-full h-10 rounded cursor-pointer"
                      title="Background Color"
                      placeholder="Select background color"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Suspense>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Suspense fallback={<LoadingFallback />}>
            <Card className="bg-white/5 backdrop-blur">
              <CardContent className="p-4">
                <div className="aspect-square rounded-lg bg-white flex items-center justify-center">
                  {settings.content ? 
                    'QR Preview' : 
                    'Enter content to generate QR code'
                  }
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-4">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                Download PNG
              </Button>
              <Button className="flex-1" variant="outline">
                Download SVG
              </Button>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}