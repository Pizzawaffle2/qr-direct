"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  QrCode,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Download,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Share2,
  Link,
  FileText,
  User,
  Wifi,
  Mail
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

export type QRCodeType = 'url' | 'text' | 'contact' | 'wifi' | 'vcard' | 'email';

export interface QRCodeItem {
  id: string;
  title: string;
  type: QRCodeType;
  content: string;
  scans: number;
  created: Date;
  lastModified?: Date;
  shortLink?: string;
  foregroundColor?: string;
  backgroundColor?: string;
  logo?: string;
  isActive: boolean;
}

const typeColors: Record<QRCodeType, string> = {
  url: 'from-blue-500 to-purple-500',
  text: 'from-green-500 to-emerald-500',
  contact: 'from-orange-500 to-red-500',
  wifi: 'from-cyan-500 to-blue-500',
  vcard: 'from-pink-500 to-rose-500',
  email: 'from-violet-500 to-indigo-500'
};

export default function QRCodesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [qrCodes, setQRCodes] = useState<QRCodeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'created' | 'scans'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch QR codes
  const fetchQRCodes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/qr-codes');
      if (!response.ok) throw new Error('Failed to fetch QR codes');
      const data = await response.json();
      setQRCodes(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load QR codes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchQRCodes();
  }, [fetchQRCodes]);

  // Filter and sort QR codes
  const filteredQRCodes = useMemo(() => {
    return qrCodes
      .filter(qrCode => {
        const matchesSearch = qrCode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           qrCode.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || qrCode.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const getValue = (code: QRCodeItem) => {
          return sortBy === 'created' 
            ? new Date(code.created).getTime()
            : code.scans;
        };
        
        const aValue = getValue(a);
        const bValue = getValue(b);
        
        return sortOrder === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      });
  }, [qrCodes, searchQuery, filterType, sortBy, sortOrder]);

  // Handle QR code actions
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/qr-codes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete QR code');

      setQRCodes(prev => prev.filter(code => code.id !== id));
      setDeleteId(null);
      
      toast({
        title: "QR code deleted",
        description: "The QR code has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (qrCode: QRCodeItem, format: 'svg' | 'png' = 'png') => {
    try {
      const response = await fetch(`/api/qr-codes/${qrCode.id}/download?format=${format}`);
      if (!response.ok) throw new Error('Failed to download QR code');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${qrCode.title}-qr.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download started",
        description: `Your QR code is being downloaded as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (qrCode: QRCodeItem) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: qrCode.title,
          text: `Check out this QR code: ${qrCode.title}`,
          url: qrCode.shortLink || window.location.origin + `/qr/${qrCode.id}`
        });
      } else {
        await navigator.clipboard.writeText(
          qrCode.shortLink || window.location.origin + `/qr/${qrCode.id}`
        );
        toast({
          title: "Link copied",
          description: "The QR code link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: "Error",
          description: "Failed to share QR code. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Render QR code item components
  const QRCodeGridItem = ({ qrCode }: { qrCode: QRCodeItem }) => (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className={`relative aspect-square bg-gradient-to-br ${typeColors[qrCode.type]}`}>
          <QrCode className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-white opacity-25" />
          {!qrCode.isActive && (
            <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
              <span className="text-white font-medium">Inactive</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold truncate" title={qrCode.title}>
              {qrCode.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate" title={qrCode.content}>
              {qrCode.content}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/qr-codes/${qrCode.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/qr-codes/${qrCode.id}/analytics`)}>
                <Eye className="mr-2 h-4 w-4" />
                Analytics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare(qrCode)}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => handleDownload(qrCode, 'png')}>
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleDownload(qrCode, 'svg')}>
                <Download className="mr-2 h-4 w-4" />
                Download SVG
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setDeleteId(qrCode.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>{qrCode.type.toUpperCase()}</span>
          <span>{qrCode.scans.toLocaleString()} scans</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">QR Codes</h1>
          <p className="text-muted-foreground">
            Create and manage your QR codes
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/qr-codes/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create QR Code
        </Button>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search QR codes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select 
            value={filterType}
            onValueChange={setFilterType}
          >
            <SelectTrigger className="w-32">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="url">URL</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
              <SelectItem value="wifi">WiFi</SelectItem>
              <SelectItem value="vcard">vCard</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortBy}
            onValueChange={(value: 'created' | 'scans') => setSortBy(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Date Created</SelectItem>
              <SelectItem value="scans">Scan Count</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? "↑" : "↓"}
          </Button>
          <div className="border rounded-md p-1">
            <Button
              variant={view === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="px-2"
              onClick={() => setView('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="px-2"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* QR Codes Display */}
      {isLoading ? (
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </Card>
      ) : filteredQRCodes.length > 0 ? (
        view === 'grid' ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredQRCodes.map((qrCode) => (
              <QRCodeGridItem key={qrCode.id} qrCode={qrCode} />
            ))}
          </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>All QR Codes</CardTitle>
                <CardDescription>
                  Showing {filteredQRCodes.length} QR code{filteredQRCodes.length === 1 ? '' : 's'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {filteredQRCodes.map((qrCode) => (
                    <div
                      key={qrCode.id}
                      className="flex items-center justify-between py-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${typeColors[qrCode.type]} flex items-center justify-center`}>
                            <QrCode className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium truncate">{qrCode.title}</h4>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="capitalize">{qrCode.type}</span>
                              <span>•</span>
                              <span>{qrCode.scans.toLocaleString()} scans</span>
                              {!qrCode.isActive && (
                                <>
                                  <span>•</span>
                                  <span className="text-yellow-600">Inactive</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/qr-codes/${qrCode.id}/analytics`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Analytics
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare(qrCode)}
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/qr-codes/${qrCode.id}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleDownload(qrCode, 'png')}>
                              <Download className="mr-2 h-4 w-4" />
                              Download PNG
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleDownload(qrCode, 'svg')}>
                              <Download className="mr-2 h-4 w-4" />
                              Download SVG
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteId(qrCode.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          <Card className="py-12">
            <CardContent className="text-center">
              <QrCode className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No QR codes found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery || filterType !== 'all'
                  ? "Try adjusting your search or filters"
                  : "Create your first QR code to get started"}
              </p>
              {!searchQuery && filterType === 'all' && (
                <Button
                  onClick={() => router.push('/dashboard/qr-codes/new')}
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create QR Code
                </Button>
              )}
            </CardContent>
          </Card>
        )}
  
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete QR Code</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this QR code? This action cannot be undone.
                Any existing scans of this QR code will no longer work.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDelete(deleteId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
  
  // Utility functions for QR code management
  export const qrCodeUtils = {
    validateQRCode: (qrCode: Partial<QRCodeItem>) => {
      const errors: Record<string, string> = {};
      
      if (!qrCode.title?.trim()) {
        errors.title = 'Title is required';
      }
  
      if (!qrCode.type) {
        errors.type = 'Type is required';
      }
  
      if (!qrCode.content?.trim()) {
        errors.content = 'Content is required';
      }
  
      // Type-specific validation
      if (qrCode.type === 'url' && !qrCode.content?.startsWith('http')) {
        errors.content = 'URL must start with http:// or https://';
      }
  
      if (qrCode.type === 'email' && !qrCode.content?.includes('@')) {
        errors.content = 'Invalid email address';
      }
  
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    },
  
    formatContentPreview: (content: string, type: QRCodeType) => {
      if (content.length <= 40) return content;
      
      switch (type) {
        case 'url':
          try {
            const url = new URL(content);
            return `${url.hostname}${url.pathname.substring(0, 20)}...`;
          } catch {
            return content.substring(0, 40) + '...';
          }
        case 'vcard':
        case 'contact':
          return content.split('\n')[0] + '...';
        default:
          return content.substring(0, 40) + '...';
      }
    },
  
    getTypeIcon: (type: QRCodeType) => {
      // Returns the appropriate icon component for each QR code type
      switch (type) {
        case 'url':
          return Link;
        case 'text':
          return FileText;
        case 'contact':
        case 'vcard':
          return User;
        case 'wifi':
          return Wifi;
        case 'email':
          return Mail;
        default:
          return QrCode;
      }
    }
  };
  
