'use client';

import {useHistoryStore } from '@/lib/store/history-store';
import {Button } from '@/components/ui/button';
import {Input } from '@/components/ui/input';
import {triggerConfetti } from '@/lib/utils/confetti';
import {Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {useToast } from '@/components/ui/use-toast';
import {Trash2,
  MoreVertical,
  Download,
  Copy,
  Clock,
  Link2,
  Mail,
  Wifi,
  Phone,
  User,
  Filter,
  Search,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import {format } from 'date-fns';
import {useState, useMemo } from 'react';
import {QRCodeService } from '@/services/qr-service';
import {QRCodeData, QRCodeType } from '@/lib/types/qr-code';

const typeIcons = {
  url: Link2,
  email: Mail,
  wifi: Wifi,
  phone: Phone,
  vcard: User,
} as const;

type SortOrder = 'newest' | 'oldest' | 'alphabetical';

function HistoryPage() {
  const { history, removeFromHistory, clearHistory } = useHistoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<QRCodeType[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const { toast } = useToast();

  const isQRCodeData = (item: any): item is QRCodeData => {
    return (
      item && typeof item === 'object' && 'type' in item && 'title' in item && 'created' in item
    );
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'url':
        return 'URL';
      case 'email':
        return 'Email';
      case 'wifi':
        return 'WiFi';
      case 'phone':
        return 'Phone';
      case 'vcard':
        return 'Contact Card';
      default:
        return type;
    }
  };

  const getContentPreview = (item: QRCodeData): string => {
    if (!isQRCodeData(item)) return '';

    switch (item.type) {
      case 'url':
        return item.url;
      case 'email':
        return item.email;
      case 'wifi':
        return item.ssid;
      case 'phone':
        return item.phoneNumber;
      case 'vcard':
        return `${item.firstName} ${item.lastName}`;
      case 'text':
        return item.text;
      default:
        return '';
    }
  };

  const handleDelete = (id: string) => {
    removeFromHistory(id);
    toast({
      title: 'QR Code Deleted',
      description: 'The QR code has been removed from your history.',
    });
  };

  const handleClear = () => {
    clearHistory();
    toast({
      title: 'History Cleared',
      description: 'All QR codes have been removed from your history.',
    });
    triggerConfetti();
  };

  const handleRegenerateQR = async (data: QRCodeData) => {
    try {
      const qrCode = await QRCodeService.generateQRCode(data);
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = `${data.title || 'qr-code'}.png`;
      link.click();
      toast({
        title: 'QR Code Downloaded',
        description: 'The QR code has been regenerated and downloaded.',
      });
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to regenerate QR code',
        variant: 'destructive',
      });
    }
  };

  const filteredAndSortedHistory = useMemo(() => {
    let filtered = history;

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((item) => selectedTypes.includes(item.type));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) => {
        const contentPreview = getContentPreview(item).toLowerCase();
        return item.title.toLowerCase().includes(query) || contentPreview.includes(query);
      });
    }

    return [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'oldest':
          return new Date(a.created).getTime() - new Date(b.created).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.created).getTime() - new Date(a.created).getTime();
      }
    });
  }, [history, searchQuery, selectedTypes, sortOrder]);

  return (
    <div className="animate-fade-in container mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 px-8 py-24 shadow-2xl transition-all duration-700 ease-in-out dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="neon-glow bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-5xl font-bold text-transparent dark:from-teal-400 dark:to-blue-500">
            History
          </h1>
          <p className="mt-3 text-xl text-gray-800 dark:text-gray-300">
            Your previously generated QR codes
          </p>
        </div>
        {history.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 text-white shadow-lg transition-all duration-500 hover:from-red-600 hover:to-pink-600"
              >
                Clear History
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white shadow-2xl dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle>Clear History</DialogTitle>
                <DialogDescription>
                  Are you sure you want to clear your entire QR code history? This action cannot be
                  undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" className="mr-2">
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleClear}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Clear History
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {history.length > 0 && (
        <div className="mb-16 space-y-6">
          <div className="flex gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2 transform text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search QR codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-lg border-none py-4 pl-12 shadow-inner dark:bg-gray-900"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-4 text-white shadow-lg transition-all duration-500 hover:from-blue-600 hover:to-teal-600"
                >
                  <Filter className="h-6 w-6" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 shadow-lg">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(typeIcons).map(([type, Icon]) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={selectedTypes.includes(type as QRCodeType)}
                    onCheckedChange={(checked) => {
                      setSelectedTypes((prev) =>
                        checked ? [...prev, type as QRCodeType] : prev.filter((t) => t !== type)
                      );
                    }}
                  >
                    <Icon className="mr-2 h-5 w-5 text-blue-500" />
                    {getTypeLabel(type)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white shadow-lg transition-all duration-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {sortOrder === 'newest&apos; ? (
                    <SortDesc className="h-6 w-6" />
                  ) : (
                    <SortAsc className="h-6 w-6" />
                  )}
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="shadow-lg">
                <DropdownMenuItem onClick={() => setSortOrder(&apos;newest')}>
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('oldest&apos;)}>
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder(&apos;alphabetical')}>
                  Alphabetical
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {(searchQuery || selectedTypes.length > 0) && (
            <div className="flex items-center gap-4 text-lg text-gray-800 dark:text-gray-400">
              <span>{filteredAndSortedHistory.length} results found</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery(&apos;&apos;);
                  setSelectedTypes([]);
                }}
                className="text-teal-500 underline hover:text-teal-700"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {history.length === 0 ? (
        <Card className="rounded-3xl bg-gray-50 p-10 shadow-lg dark:bg-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Clock className="mb-6 h-16 w-16 text-gray-500 dark:text-gray-400" />
            <p className="mb-4 text-center text-2xl font-bold">No History Yet</p>
            <p className="text-center text-lg text-gray-700 dark:text-gray-300">
              Generated QR codes will appear here.
            </p>
          </CardContent>
        </Card>
      ) : filteredAndSortedHistory.length === 0 ? (
        <Card className="rounded-3xl bg-gray-50 p-10 shadow-lg dark:bg-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Search className="mb-6 h-16 w-16 text-gray-500 dark:text-gray-400" />
            <p className="mb-4 text-center text-2xl font-bold">No Results Found</p>
            <p className="text-center text-lg text-gray-700 dark:text-gray-300">
              Try adjusting your search or filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-10 md:grid-cols-2">
          {filteredAndSortedHistory.map((item) => {
            const Icon = typeIcons[item.type as keyof typeof typeIcons];
            return (
              <Card
                key={item.id}
                className="neon-border-animated group relative transform rounded-3xl bg-white p-8 shadow-lg transition-transform duration-700 ease-in-out hover:scale-105 hover:shadow-2xl dark:bg-gray-800"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-3 shadow-inner dark:from-gray-700 dark:to-gray-800">
                        <Icon className="h-5 w-5 text-blue-500 dark:text-teal-400" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                          {getTypeLabel(item.type)}
                        </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="shadow-lg">
                        <DropdownMenuItem onClick={() => handleRegenerateQR(item)}>
                          <Download className="mr-2 h-5 w-5" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(getContentPreview(item));
                            toast({
                              title: 'Copied',
                              description: 'Content copied to clipboard&apos;,
                            });
                          }}
                        >
                          <Copy className="mr-2 h-5 w-5" />
                          Copy Content
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="mr-2 h-5 w-5" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="truncate text-lg text-gray-700 dark:text-gray-300">
                  {getContentPreview(item)}
                </CardContent>
                <CardFooter className="text-sm text-gray-500 dark:text-gray-400">
                  Created {format(new Date(item.created), &apos;PPp')}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
