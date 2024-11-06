import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface ActivityLogData {
  timestamp: string;
  activity: string;
  details: string;
}

export default function ProfileActivityLog() {
  const [activityLog, setActivityLog] = useState<ActivityLogData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivityLog = async () => {
      try {
        const response = await fetch('/api/user/activity');
        if (!response.ok) throw new Error('Failed to fetch activity log');
        const data = await response.json();
        setActivityLog(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load activity log',
          variant: 'destructive',
        });
      }
    };
    fetchActivityLog();
  }, [toast]);

  const filteredActivityLog = activityLog.filter((log) =>
    log.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 p-6 bg-background rounded-lg shadow-md">
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            {filteredActivityLog.length > 0 ? (
              filteredActivityLog.map((log, index) => (
                <div key={index} className="p-4 border rounded-md bg-card">
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(log.timestamp), 'PPpp')}
                  </div>
                  <div className="font-medium text-primary-foreground">
                    {log.activity}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {log.details}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground">No activity found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}