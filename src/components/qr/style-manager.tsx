// src/components/qr/style-manager.tsx
'use client';

import {useState } from 'react';
import {Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Button } from '@/components/ui/button';
import {Input } from '@/components/ui/input';
import {SavedStyle } from '@/lib/style-management';
import {useToast } from '@/components/ui/use-toast';
import {Save, Folder, Trash2 } from 'lucide-react';

interface StyleManagerProps {
  currentStyle: any;
  onLoadStyle: (style: any) => void;
}

export function StyleManager({ currentStyle, onLoadStyle }: StyleManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [styleName, setStyleName] = useState('');
  const [savedStyles, setSavedStyles] = useState<SavedStyle[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveStyle = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/styles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: styleName, style: currentStyle }),
      });

      if (!response.ok) throw new Error('Failed to save style');

      toast({
        title: 'Style saved',
        description: 'Your style has been saved successfully',
      });
      setIsOpen(false);
      setStyleName('');
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to save style',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStyle = async (id: string) => {
    try {
      const response = await fetch(`/api/styles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete style');

      setSavedStyles(savedStyles.filter((style) => style.id !== id));
      toast({
        title: 'Style deleted',
        description: 'Your style has been deleted successfully',
      });
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to delete style',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <Save className="mr-2 h-4 w-4" />
          Save Style
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Folder className="mr-2 h-4 w-4" />
              Load Style
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Saved Styles</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {savedStyles.map((style) => (
                <div
                  key={style.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <h4 className="font-medium">{style.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Saved {new Date(style.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onLoadStyle(style.style)}>
                      Load
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteStyle(style.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {savedStyles.length === 0 && (
                <p className="text-center text-muted-foreground">No saved styles found</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Style</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Style name"
              value={styleName}
              onChange={(e) => setStyleName(e.target.value)}
            />
            <Button onClick={handleSaveStyle} disabled={loading || !styleName} className="w-full">
              Save Style
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
