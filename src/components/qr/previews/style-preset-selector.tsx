// src/components/qr/style-preset-selector.tsx

'use client';

import {useState } from 'react';
import {motion } from 'framer-motion';
import {Card } from '@/components/ui/card';
import {Button } from '@/components/ui/button';
import {Badge } from '@/components/ui/badge';
import {Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {QR_STYLE_PRESETS } from '@/config/qr-style-presets';
import {useSession } from 'next-auth/react';
import {Crown, Lock } from 'lucide-react';
import {cn } from '@/lib/utils';

interface StylePresetSelectorProps {
  onSelect: (style: any) => void;
  currentStyle: any;
}

export function StylePresetSelector({ onSelect, currentStyle }: StylePresetSelectorProps) {
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState('basic');
  const categories = Array.from(new Set(QR_STYLE_PRESETS.map((preset) => preset.category)));

  const isPro = session?.user?.subscription?.plan === 'pro';

  return (
    <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
      <TabsList className="flex flex-wrap">
        {categories.map((category) => (
          <TabsTrigger key={category} value={category} className="capitalize">
            {category}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category} value={category}>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {QR_STYLE_PRESETS.filter((preset) => preset.category === category).map((preset) => (
              <motion.div key={preset.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className={cn(
                    'relative cursor-pointer p-4 transition-colors hover:border-primary',
                    currentStyle === preset.style && 'border-primary'
                  )}
                  onClick={() => {
                    if (!preset.isPro || isPro) {
                      onSelect(preset.style);
                    }
                  }}
                >
                  {preset.isPro && !isPro && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                      <div className="p-4 text-center">
                        <Lock className="mx-auto mb-2 h-8 w-8" />
                        <p className="text-sm">Pro Feature</p>
                        <Button
                          size="sm"
                          variant="default"
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Navigate to pricing page
                          }}
                        >
                          <Crown className="mr-1 h-4 w-4" />
                          Upgrade
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                      {/* Sample QR Code with this style */}
                      <div className="h-full w-full p-4">{/* Preview component here */}</div>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <h3 className="font-medium">{preset.name}</h3>
                        {preset.isPro && (
                          <Badge variant="default" className="text-xs">
                            PRO
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{preset.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
