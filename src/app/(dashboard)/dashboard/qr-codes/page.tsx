"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QRCodeItem {
  id: string;
  title: string;
  type: 'url' | 'text' | 'contact' | 'wifi';
  content: string;
  scans: number;
  created: Date;
}

const mockQRCodes: QRCodeItem[] = [
  {
    id: '1',
    title: 'Company Website',
    type: 'url',
    content: 'https://example.com',
    scans: 145,
    created: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Business Card',
    type: 'contact',
    content: 'John Doe - CEO',
    scans: 67,
    created: new Date('2024-01-10'),
  },
];

export default function QRCodesPage() {
  const router = useRouter();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [qrCodes, setQRCodes] = useState<QRCodeItem[]>(mockQRCodes);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateNew = () => {
    router.push('/dashboard/qr-codes/new');
  };

  const handleDelete = (id: string) => {
    setQRCodes(qrCodes.filter(code => code.id !== id));
  };

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
          <Select defaultValue="all">
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
            </SelectContent>
          </Select>
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

      {/* QR Codes Grid/List View */}
      {view === 'grid' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {qrCodes.map((qrCode) => (
            <Card key={qrCode.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-square bg-gradient-to-br from-blue-500 to-purple-500">
                  <QrCode className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-white opacity-25" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{qrCode.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {qrCode.type.toUpperCase()}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(qrCode.id)} 
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <span>{qrCode.scans} scans</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All QR Codes</CardTitle>
            <CardDescription>A list of all your QR codes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {qrCodes.map((qrCode) => (
                <div
                  key={qrCode.id}
                  className="flex items-center justify-between py-4"
                >
                  <div>
                    <h4 className="font-medium">{qrCode.title}</h4>
                    <div className="text-sm text-muted-foreground">
                      {qrCode.type.toUpperCase()} • {qrCode.scans} scans
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(qrCode.id)}
                          className="text-red-600"
                        >
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
      )}

      {/* Empty State */}
      {qrCodes.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <QrCode className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No QR codes found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first QR code to get started.
            </p>
            <Button onClick={handleCreateNew} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create QR Code
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
