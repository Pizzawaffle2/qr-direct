import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface AnalyticsData {
  date: string;
  qrScans: number;
  templateCreations: number;
}

export default function ProfileAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/user/analytics');
        if (!response.ok) throw new Error('Failed to fetch analytics data');
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load analytics data',
          variant: 'destructive',
        });
      }
    };
    fetchAnalytics();
  }, [toast]);

  return (
    <div className="space-y-4 rounded-lg bg-background p-6 shadow-md">
      <Card>
        <CardHeader>
          <CardTitle>QR Code Scans Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted-foreground)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                }}
              />
              <Line type="monotone" dataKey="qrScans" stroke="#8884d8" />
              <Line type="monotone" dataKey="templateCreations" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
