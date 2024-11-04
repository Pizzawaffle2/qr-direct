"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  QrCode, 
  Layout, 
  HardDrive, 
  Users,
  Loader2
} from "lucide-react"

interface UsageMetrics {
  qrCodes: {
    used: number
    limit: number
  }
  templates: {
    used: number
    limit: number
  }
  storage: {
    used: number // in bytes
    limit: number // in bytes
  }
  teamMembers: {
    used: number
    limit: number
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function UsageMetrics() {
  const [metrics, setMetrics] = useState<UsageMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/subscriptions/usage")
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error("Failed to fetch usage metrics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    )
  }

  if (!metrics) return null

  const usageMetrics = [
    {
      name: "QR Codes",
      icon: QrCode,
      used: metrics.qrCodes.used,
      limit: metrics.qrCodes.limit,
      format: (value: number) => value.toString(),
    },
    {
      name: "Templates",
      icon: Layout,
      used: metrics.templates.used,
      limit: metrics.templates.limit,
      format: (value: number) => value.toString(),
    },
    {
      name: "Storage",
      icon: HardDrive,
      used: metrics.storage.used,
      limit: metrics.storage.limit,
      format: formatBytes,
    },
    {
      name: "Team Members",
      icon: Users,
      used: metrics.teamMembers.used,
      limit: metrics.teamMembers.limit,
      format: (value: number) => value.toString(),
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Usage</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {usageMetrics.map((metric) => {
          const Icon = metric.icon
          const percentage = metric.limit === -1 
            ? 0 
            : (metric.used / metric.limit) * 100

          return (
            <Card key={metric.name} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">{metric.name}</h3>
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.format(metric.used)}
                  {metric.limit !== -1 && (
                    <> / {metric.format(metric.limit)}</>
                  )}
                </div>
              </div>
              {metric.limit !== -1 && (
                                <Progress 
                                value={percentage} 
                                className="h-2"
                                indicatorClassName={
                                  percentage > 90 
                                    ? "bg-red-500" 
                                    : percentage > 75 
                                      ? "bg-yellow-500" 
                                      : undefined
                                }
                              />
                            )}
                            {percentage > 90 && (
                              <p className="text-sm text-red-500 mt-2">
                                Near limit - Consider upgrading
                              </p>
                            )}
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )
              }