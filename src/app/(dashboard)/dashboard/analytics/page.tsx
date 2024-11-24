'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {AreaChart, BarChart, LineChart, PieChart } from '@/components/ui/charts';
import {Activity, BarChart3, Globe, Smartphone, Monitor, QrCode } from 'lucide-react';
import {SiGooglechrome as Chrome, SiSafari as Safari, SiFirefox as Firefox } from 'react-icons/si';
import {Button } from '@/components/ui/button';
import {Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AnalyticsPage() {
  // Example data - replace with real data from your API
  const scanData = {
    daily: [
      { name: 'Mon', scans: 40 },
      { name: 'Tue', scans: 30 },
      { name: 'Wed', scans: 45 },
      { name: 'Thu', scans: 35 },
      { name: 'Fri', scans: 55 },
      { name: 'Sat', scans: 25 },
      { name: 'Sun', scans: 30 },
    ],
    devices: [
      { name: 'Mobile', value: 60, icon: Smartphone },
      { name: 'Desktop', value: 30, icon: Monitor },
    ],
    locations: [
      { name: 'United States', value: 40 },
      { name: 'United Kingdom', value: 20 },
      { name: 'Germany', value: 15 },
      { name: 'France', value: 10 },
      { name: 'Others', value: 15 },
    ],
    browsers: [
      { name: 'Chrome', value: 45, icon: Chrome },
      { name: 'Safari', value: 30, icon: Safari },
      { name: 'Firefox', value: 25, icon: Firefox },
      { name: 'Chrome', value: 45, icon: Chrome },
      { name: 'Safari', value: 30, icon: Globe },
      { name: 'Firefox', value: 25, icon: Globe },
      { name: 'United Kingdom', value: 20 },
      { name: 'Germany', value: 15 },
      { name: 'France', value: 10 },
      { name: 'Others', value: 15 },
      { name: 'France', value: 10 },
      { name: 'Others', value: 15 },
    ],
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your QR code performance and engagement</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="7days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button>Download Report</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,345</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active QR Codes</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">2 added this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,876</div>
            <p className="text-xs text-muted-foreground">+15.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.5%</div>
            <p className="text-xs text-muted-foreground">+7.4% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Scan Activity</CardTitle>
            <CardDescription>Daily scan activity over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <AreaChart
              data={scanData.daily}
              index="name"
              categories={['scans']}
              colors={['blue']}
              yAxisWidth={40}
              className="h-[300px]"
            />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Devices</CardTitle>
            <CardDescription>Scans by device type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PieChart data={scanData.devices} index="name" category="value" className="h-[300px]" />
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Location Distribution</CardTitle>
            <CardDescription>Scans by geographical location</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart
              data={scanData.locations}
              index="name"
              categories={['value']}
              colors={['blue']}
              layout="vertical"
              className="h-[300px]"
            />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Browser Distribution</CardTitle>
            <CardDescription>Scans by browser type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PieChart
              data={scanData.browsers}
              index="name"
              category="value"
              className="h-[300px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing QR Codes</CardTitle>
          <CardDescription>Performance metrics for your most scanned QR codes</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left font-medium">Name</th>
                <th className="p-4 text-left font-medium">Total Scans</th>
                <th className="p-4 text-left font-medium">Unique Visitors</th>
                <th className="p-4 text-left font-medium">Conversion Rate</th>
                <th className="p-4 text-left font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="p-4">QR Code {i + 1}</td>
                  <td className="p-4">{Math.floor(Math.random() * 1000)}</td>
                  <td className="p-4">{Math.floor(Math.random() * 800)}</td>
                  <td className="p-4">{(Math.random() * 100).toFixed(1)}%</td>
                  <td className="p-4">
                    <LineChart
                      data={Array.from({ length: 7 }).map((_, j) => ({
                        name: `Day ${j + 1}`,
                        value: Math.random() * 100,
                      }))}
                      index="name"
                      categories={['value']}
                      colors={[&apos;blue&apos;]}
                      className="h-[30px] w-[100px]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
