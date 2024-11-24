'use client';

import {useState } from 'react';
import {Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {Button } from '@/components/ui/button';
import {Input } from '@/components/ui/input';
import {Badge } from '@/components/ui/badge';
import {DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Plus,
  Search,
  QrCode,
  Calendar,
  MoreVertical,
  Copy,
  Pencil,
  Trash,
  Star,
  Share2,
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  type: 'qr' | 'calendar';
  thumbnail: string;
  isPro: boolean;
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Business Card QR',
    description: 'Professional QR code template for business cards',
    type: 'qr',
    thumbnail: '/thumbnails/business-card-qr.png',
    isPro: true,
    isPublic: true,
    isFavorite: true,
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
  },
  {
    id: '2',
    name: 'Event Calendar',
    description: 'Monthly calendar template for events',
    type: 'calendar',
    thumbnail: '/thumbnails/event-calendar.png',
    isPro: false,
    isPublic: true,
    isFavorite: false,
    createdAt: '2024-03-14',
    updatedAt: '2024-03-14',
  },
  // Add more mock templates...
];

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'qr' | 'calendar'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeTab === 'all' || template.type === activeTab;
    return matchesSearch && matchesType;
  });
  const toggleFavorite = (templateId: string) => {
    setTemplates(templates.map(template => 
      template.id === templateId 
        ? { ...template, isFavorite: !template.isFavorite }
        : template
    ));
    console.log('Toggle favorite for template:', templateId);
  };
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-muted-foreground">Manage your QR code and calendar templates</p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'all' | 'qr' | 'calendar')}
        >
          <TabsList>
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="qr">QR Codes</TabsTrigger>
            <TabsTrigger value="calendar">Calendars</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[300px] pl-10"
            />
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {template.type === 'qr' ? (
                    <QrCode className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Calendar className="h-5 w-5 text-green-500" />
                  )}
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex aspect-video items-center justify-center rounded-lg border bg-muted">
                {/* Replace with actual template preview */}
                <div className="text-muted-foreground">Template Preview</div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                {template.isPro && (
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  >
                    PRO
                  </Badge>
                )}
                {template.isPublic && <Badge variant="secondary">Public</Badge>}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(template.id)}
                className={template.isFavorite ? 'text-yellow-500' : '&apos;}
              >
                <Star className="h-4 w-4" fill={template.isFavorite ? &apos;currentColor' : 'none'} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-muted-foreground">No templates found</div>
          <Button variant="outline" className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Create New Template
          </Button>
        </div>
      )}
    </div>
  );
}
