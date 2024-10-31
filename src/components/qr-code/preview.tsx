// File: src/components/qr-code/preview.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Download, Share2, Loader2 } from 'lucide-react';
import { ShareDialog } from '../template/share-dialog';

interface QRPreviewProps {
  isLoading: boolean;
}

export function QRPreview({ isLoading }: QRPreviewProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!previewUrl) return;

    try {
      const link = document.createElement('a');
      link.href = previewUrl;
      link.download = `qr-code-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "QR code downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="aspect-square rounded-xl border bg-white dark:bg-gray-800 p-8 shadow-lg"
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center"
            >
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </motion.div>
          ) : previewUrl ? (
            <motion.img
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={previewUrl}
              alt="QR Code Preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center text-muted-foreground"
            >
              QR code preview will appear here
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <Button
          size="lg"
          onClick={handleDownload}
          disabled={!previewUrl || isLoading}
          className="shadow-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => setIsShareDialogOpen(true)}
          disabled={!previewUrl || isLoading}
          className="shadow-lg"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        imageUrl={previewUrl}
      />
    </div>
  );
}