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
  Calendar,
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

// Mock data for calendar items
interface CalendarItem {
  id: string;
  title: string;
  type: 'personal' | 'business' | 'holiday';
  month: string;
  year: number;
  downloads: number;
  created: Date;
}

const mockCalendars: CalendarItem[] = [
  {
    id: '1',
    title: 'Company Events 2024',
    type: 'business',
    month: 'All',
    year: 2024,
    downloads: 145,
    created: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Family Birthdays',
    type: 'personal',
    month: 'All',
    year: 2024,
    downloads: 23,
    created: new Date('2024-01-10'),
  },
  // Add more mock items...
];

export default function CalendarsPage() {
  const router = useRouter();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [calendars, setCalendars] = useState<CalendarItem[]>(mockCalendars);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateNew = () => {
    router.push('/dashboard/calendars/new');
  };

  const handleDelete = (id: string) => {
    setCalendars(calendars.filter(calendar => calendar.id !== id));
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendars</h1>
          <p className="text-muted-foreground">
            Create and manage your custom calendars
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create Calendar
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search calendars..."
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
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="holiday">Holiday</SelectItem>
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

      {/* Calendar Grid */}
      {view === 'grid' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {calendars.map((calendar) => (
            <Card key={calendar.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-500 to-purple-500">
                  <Calendar className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-white opacity-25" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{calendar.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {calendar.month} {calendar.year}
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
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(calendar.id)} className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <span className="capitalize">{calendar.type}</span>
                  <span className="mx-2">•</span>
                  <span>{calendar.downloads} downloads</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Calendars</CardTitle>
            <CardDescription>A list of all your calendars</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {calendars.map((calendar) => (
                <div
                  key={calendar.id}
                  className="flex items-center justify-between py-4"
                >
                  <div>
                    <h4 className="font-medium">{calendar.title}</h4>
                    <div className="text-sm text-muted-foreground">
                      {calendar.month} {calendar.year} • {calendar.type}
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
                        <DropdownMenuItem onClick={() => handleDelete(calendar.id)} className="text-red-600">
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
      {calendars.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No calendars found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first calendar to get started.
            </p>
            <Button onClick={handleCreateNew} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Calendar
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}