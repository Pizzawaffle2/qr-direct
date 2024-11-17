"use client";

import { useState, useCallback, useMemo } from "react";
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
  Calendar,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Download,
  MoreHorizontal,
  Edit,
  Trash2,
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

export interface CalendarItem {
  id: string;
  title: string;
  type: 'personal' | 'business' | 'holiday';
  month: string;
  year: number;
  downloads: number;
  created: Date;
  lastModified: Date;
  color?: string;
}

const colorMap = {
  personal: 'from-blue-500 to-purple-500',
  business: 'from-green-500 to-emerald-500',
  holiday: 'from-orange-500 to-red-500',
};

export default function CalendarsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [calendars, setCalendars] = useState<CalendarItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'created' | 'modified' | 'downloads'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch calendars
  const fetchCalendars = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/calendars');
      if (!response.ok) throw new Error('Failed to fetch calendars');
      const data = await response.json();
      setCalendars(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load calendars. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Filter and sort calendars
  const filteredCalendars = useMemo(() => {
    return calendars
      .filter(calendar => {
        const matchesSearch = calendar.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || calendar.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const aValue = sortBy === 'created' ? a.created 
          : sortBy === 'modified' ? a.lastModified 
          : a.downloads;
        const bValue = sortBy === 'created' ? b.created 
          : sortBy === 'modified' ? b.lastModified 
          : b.downloads;
        
        return sortOrder === 'asc' 
          ? aValue > bValue ? 1 : -1
          : aValue < bValue ? 1 : -1;
      });
  }, [calendars, searchQuery, filterType, sortBy, sortOrder]);

  // Handle calendar deletion
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/calendars/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete calendar');

      setCalendars(prev => prev.filter(cal => cal.id !== id));
      setDeleteId(null);
      
      toast({
        title: "Calendar deleted",
        description: "The calendar has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete calendar. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle calendar download
  const handleDownload = async (calendar: CalendarItem) => {
    try {
      const response = await fetch(`/api/calendars/${calendar.id}/download`);
      if (!response.ok) throw new Error('Failed to download calendar');
      
      // Handle the download response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${calendar.title}-${calendar.year}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Update download count
      setCalendars(prev => prev.map(cal => 
        cal.id === calendar.id 
          ? { ...cal, downloads: cal.downloads + 1 }
          : cal
      ));

      toast({
        title: "Download started",
        description: "Your calendar is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download calendar. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Render calendar grid item
  const CalendarGridItem = ({ calendar }: { calendar: CalendarItem }) => (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className={`relative aspect-[4/3] bg-gradient-to-br ${colorMap[calendar.type]}`}>
          <Calendar className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-white opacity-25" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold truncate">{calendar.title}</h3>
            <p className="text-sm text-muted-foreground">
              {calendar.month} {calendar.year}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/calendars/${calendar.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload(calendar)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setDeleteId(calendar.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span className="capitalize">{calendar.type}</span>
          <span>{calendar.downloads} downloads</span>
        </div>
      </CardContent>
    </Card>
  );

  // Render calendar list item
  const CalendarListItem = ({ calendar }: { calendar: CalendarItem }) => (
    <div className="flex items-center justify-between py-4">
      <div>
        <h4 className="font-medium">{calendar.title}</h4>
        <div className="text-sm text-muted-foreground">
          {calendar.month} {calendar.year} • {calendar.type}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Last modified {format(new Date(calendar.lastModified), 'MMM d, yyyy')}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleDownload(calendar)}
        >
          <Download className="mr-2 h-4 w-4" />
          Download ({calendar.downloads})
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/dashboard/calendars/${calendar.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setDeleteId(calendar.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

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
        <Button onClick={() => router.push('/dashboard/calendars/new')}>
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

      {/* Calendar Grid/List */}
      {isLoading ? (
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </Card>
      ) : filteredCalendars.length > 0 ? (
        view === 'grid' ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCalendars.map((calendar) => (
              <CalendarGridItem key={calendar.id} calendar={calendar} />
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Calendars</CardTitle>
              <CardDescription>
                Showing {filteredCalendars.length} calendar{filteredCalendars.length === 1 ? '' : 's'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {filteredCalendars.map((calendar) => (
                  <CalendarListItem key={calendar.id} calendar={calendar} />
                ))}
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <Card className="py-12">
          <CardContent className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No calendars found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery || filterType !== 'all'
                ? "Try adjusting your search or filters"
                : "Create your first calendar to get started"}
            </p>
            {!searchQuery && filterType === 'all' && (
              <Button 
                onClick={() => router.push('/dashboard/calendars/new')} 
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Calendar
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              calendar and all of its data.
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

      {/* Sort Options Menu */}
      <Select
        value={sortBy}
        onValueChange={(value: 'created' | 'modified' | 'downloads') => setSortBy(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created">Date Created</SelectItem>
          <SelectItem value="modified">Last Modified</SelectItem>
          <SelectItem value="downloads">Downloads</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort Order Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        className="ml-2"
      >
        {sortOrder === 'asc' ? "↑" : "↓"}
      </Button>
    </div>
  );
}

// API route for calendars
export async function getCalendars() {
  const response = await fetch('/api/calendars', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch calendars');
  }

  return response.json();
}

// Types for API responses
export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export type CalendarResponse = ApiResponse<CalendarItem[]>;

// Utility functions for calendar management
export const calendarUtils = {
  formatDate: (date: Date) => {
    return format(new Date(date), 'MMM d, yyyy');
  },

  getCalendarColor: (type: 'personal' | 'business' | 'holiday') => {
    return colorMap[type] || colorMap.personal;
  },

  validateCalendar: (calendar: Partial<CalendarItem>) => {
    const errors: Record<string, string> = {};
    
    if (!calendar.title?.trim()) {
      errors.title = 'Title is required';
    }

    if (!calendar.type) {
      errors.type = 'Type is required';
    }

    if (!calendar.year || calendar.year < new Date().getFullYear()) {
      errors.year = 'Invalid year';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

// Custom hooks for calendar management
export function useCalendarActions() {
  const { toast } = useToast();
  const router = useRouter();

  const handleEdit = useCallback((id: string) => {
    router.push(`/dashboard/calendars/${id}`);
  }, [router]);

  const handleDownload = useCallback(async (calendar: CalendarItem) => {
    try {
      const response = await fetch(`/api/calendars/${calendar.id}/download`);
      if (!response.ok) throw new Error('Failed to download calendar');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${calendar.title}-${calendar.year}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Success',
        description: 'Calendar downloaded successfully',
      });

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download calendar',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/calendars/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete calendar');

      toast({
        title: 'Success',
        description: 'Calendar deleted successfully',
      });

      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete calendar',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  return {
    handleEdit,
    handleDownload,
    handleDelete,
  };
}

export type CalendarView = 'grid' | 'list';
export type SortOptions = 'created' | 'modified' | 'downloads';
export type SortOrder = 'asc' | 'desc';

export interface CalendarFilters {
  search: string;
  type: string;
  sortBy: SortOptions;
  sortOrder: SortOrder;
}

export function useCalendarFilters() {
  const [filters, setFilters] = useState<CalendarFilters>({
    search: '',
    type: 'all',
    sortBy: 'created',
    sortOrder: 'desc',
  });

  const filteredCalendars = useCallback((calendars: CalendarItem[]) => {
    return calendars
      .filter(calendar => {
        const matchesSearch = calendar.title
          .toLowerCase()
          .includes(filters.search.toLowerCase());
        const matchesType = filters.type === 'all' || calendar.type === filters.type;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const getValue = (cal: CalendarItem) => {
          switch (filters.sortBy) {
            case 'created':
              return new Date(cal.created).getTime();
            case 'modified':
              return new Date(cal.lastModified).getTime();
            case 'downloads':
              return cal.downloads;
            default:
              return 0;
          }
        };

        const aValue = getValue(a);
        const bValue = getValue(b);

        return filters.sortOrder === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      });
  }, [filters]);

  return {
    filters,
    setFilters,
    filteredCalendars,
  };
}