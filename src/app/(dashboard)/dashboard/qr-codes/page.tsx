'use client';

import {useSession } from 'next-auth/react';
import {useState, useCallback, useMemo, useEffect } from 'react';
import {useRouter } from 'next/navigation';
import {Filter, Grid, List, Plus, QrCode, Search, Shield } from 'lucide-react';
import {Button } from '@/components/ui/button';
import {Input } from '@/components/ui/input';
import {Card, CardContent } from '@/components/ui/card';
import {Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {useToast } from '@/components/ui/use-toast';
import {SUBSCRIPTION_STATUS, SUBSCRIPTION_TIER } from '@/constants/user';

export type QRCodeType = 'url' | 'text' | 'contact' | 'wifi' | 'vcard' | 'email';

interface QRCodeItem {
  id: string;
  title: string;
  type: QRCodeType;
  content: string;
  scans: number;
  created: string;
  isActive: boolean;
  userId: string;
}

const typeColors: Record<QRCodeType, string> = {
  url: 'from-blue-500 to-purple-500',
  text: 'from-green-500 to-emerald-500',
  contact: 'from-orange-500 to-red-500',
  wifi: 'from-cyan-500 to-blue-500',
  vcard: 'from-pink-500 to-rose-500',
  email: 'from-violet-500 to-indigo-500&apos;,
};

function QRCodeGridItem({ qrCode }: { qrCode: QRCodeItem }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/qr-codes/${qrCode.id}`);
  };

  return (
    <Card className="group cursor-pointer transition-shadow hover:shadow-lg" onClick={handleClick}>
      <div className={`aspect-square bg-gradient-to-br ${typeColors[qrCode.type]} relative`}>
        <QrCode className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-white opacity-25" />
        {!qrCode.isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
            <span className="font-medium text-white">Inactive</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="truncate font-semibold">{qrCode.title}</h3>
          <p className="truncate text-sm text-muted-foreground">{qrCode.content}</p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{qrCode.type.toUpperCase()}</span>
            <span>{qrCode.scans.toLocaleString()} scans</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SubscriptionBanner() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session?.user.subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <p>Upgrade to Pro to create unlimited QR codes and access premium features</p>
        </div>
        <Button
          variant="secondary"
          className="whitespace-nowrap"
          onClick={() => router.push(&apos;/pricing')}
        >
          Upgrade Now
        </Button>
      </CardContent>
    </Card>
  );
}

export default function QRCodesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [qrCodes, setQRCodes] = useState<QRCodeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | QRCodeType>('all');

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check subscription limits
  const canCreateNewQRCode = useCallback(() => {
    if (session?.user.subscriptionTier === SUBSCRIPTION_TIER.PRO) return true;
    return qrCodes.length < 3; // Free tier limit
  }, [qrCodes.length, session?.user.subscriptionTier]);

  // Fetch QR codes with authentication
  const fetchQRCodes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/qr-codes', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch QR codes');

      const data = await response.json();
      setQRCodes(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load QR codes. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, router]);

  useEffect(() => {
    if (mounted && status === 'authenticated') {
      fetchQRCodes();
    }
  }, [fetchQRCodes, mounted, status]);

  const filteredQRCodes = useMemo(() => {
    if (!mounted || !Array.isArray(qrCodes)) return [];

    return qrCodes.filter((qr) => {
      const typeMatch = filterType === 'all' || qr.type === filterType;
      const searchMatch =
        !searchQuery ||
        qr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qr.content.toLowerCase().includes(searchQuery.toLowerCase());

      return typeMatch && searchMatch;
    });
  }, [qrCodes, filterType, searchQuery, mounted]);

  const handleCreateNew = () => {
    if (!canCreateNewQRCode()) {
      toast({
        title: 'Subscription Limit Reached',
        description: 'Upgrade to Pro to create unlimited QR codes.',
        variant: 'destructive',
      });
      return;
    }
    router.push('/dashboard/qr-codes/new');
  };

  if (status === 'loading' || !mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login&apos;);
    return null;
  }

  return (
    <div className="container space-y-6 py-6">
      <SubscriptionBanner />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">QR Codes</h1>
          <p className="text-muted-foreground">
            {session?.user.subscriptionTier === SUBSCRIPTION_TIER.PRO
              ? &apos;Create unlimited QR codes'
              : `${qrCodes.length}/3 QR codes created`}
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create QR Code
        </Button>
      </div>

      {/* Filters */}
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
          <Select<'all' | QRCodeType>
                      value={filterType}
                      onValueChange={(value: 'all' | QRCodeType) => setFilterType(value)}
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
          <div className="rounded-md border p-1">
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
              onClick={() => setView('list&apos;)}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      ) : filteredQRCodes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredQRCodes.map((qrCode) => (
            <QRCodeGridItem key={qrCode.id} qrCode={qrCode} />
          ))}
        </div>
      ) : (
        <Card className="py-12">
          <CardContent className="text-center">
            <QrCode className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No QR codes found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery || filterType !== &apos;all'
                ? 'Try adjusting your search or filters'
                : 'Create your first QR code to get started'}
            </p>
            {!searchQuery && filterType === 'all' && (
              <Button onClick={handleCreateNew} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create QR Code
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
