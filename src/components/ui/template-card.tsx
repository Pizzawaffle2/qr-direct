// File: src/components/template/template-card.tsx
import {useState } from 'react';
import {Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {Badge } from '@/components/ui/badge';
import {DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Button } from '@/components/ui/button';
import {MoreVertical, Edit, Trash2, Share } from 'lucide-react';
import {ShareDialog } from './share-dialog';
import {TemplateDialog } from './template-dialog';
import type { Template } from '@/lib/types/qr-styles';

interface TemplateCardProps {
  template: Template;
  onSelect?: (template: Template) => void;
  onDelete?: (id: string) => void;
}

export function TemplateCard({ template, onSelect, onDelete }: TemplateCardProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <Card className="group relative">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-1">{template.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsShareDialogOpen(true)}>
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete?.(template.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent onClick={() => onSelect?.(template)} className="cursor-pointer">
        <div className="relative aspect-square rounded-lg border bg-card p-4">
          {template.preview ? (
            <img
              src={template.preview}
              alt={template.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No preview available
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {template.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{template.description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {template.category && (
              <Badge
                variant="outline"
                style={{
                  backgroundColor: template.category.color || undefined,
                  color: template.category.color ? '#fff' : undefined,
                }}
              >
                {template.category.name}
              </Badge>
            )}
            {template.tags?.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        template={template}
      />

      <TemplateDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        template={template}
        onSave={async (updatedTemplate) => {
          try {
            const response = await fetch(`/api/templates/${template.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedTemplate),
            });

            if (!response.ok) throw new Error('Failed to update template');

            setIsEditDialogOpen(false);
            // Trigger refresh of parent component
          } catch (error) {
            console.error(&apos;Failed to update template:&apos;, error);
          }
        }}
      />
    </Card>
  );
}
