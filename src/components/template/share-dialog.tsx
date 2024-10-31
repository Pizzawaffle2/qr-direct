// File: src/components/template/share-dialog.tsx
"use client"

import { useState } from 'react';
import { Globe, Lock, Copy, Share2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: {
    id: string;
    name: string;
    isPublic: boolean;
  };
  imageUrl?: string;
}

export function ShareDialog({ 
  open, 
  onOpenChange, 
  template,
  imageUrl 
}: ShareDialogProps) {
  const [isPublic, setIsPublic] = useState(template?.isPublic ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const shareUrl = template ? 
    `${window.location.origin}/templates/${template.id}` :
    imageUrl ? 
      imageUrl :
      window.location.href;

  const handleTogglePublic = async () => {
    if (!template) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/templates/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          isPublic: !isPublic,
        }),
      });

      if (!response.ok) throw new Error('Failed to update sharing settings');

      setIsPublic(!isPublic);
      toast({
        title: 'Success',
        description: `Template is now ${!isPublic ? 'public' : 'private'}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update sharing settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Success',
        description: 'Share link copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share {template ? 'Template' : 'QR Code'}</DialogTitle>
          <DialogDescription>
            {template ? 
              'Share your template with others or make it public for anyone to use.' :
              'Share your QR code with others.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {template && (
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>
                  Visibility Settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Public Access</div>
                    <div className="text-sm text-muted-foreground">
                      Make this template available to everyone
                    </div>
                  </div>
                  <Switch
                    checked={isPublic}
                    onCheckedChange={handleTogglePublic}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>
                Share Link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  {template && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      {isPublic ? (
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  )}
                  <Input
                    value={shareUrl}
                    readOnly
                    className={template ? "pl-9 pr-32" : "pr-32"}
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>

              {navigator.share && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    navigator.share({
                      title: template?.name || 'QR Code',
                      text: `Check out this ${template ? 'template' : 'QR code'}!`,
                      url: shareUrl,
                    });
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share via...
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex-col sm:flex-row sm:justify-end sm:space-x-2">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}