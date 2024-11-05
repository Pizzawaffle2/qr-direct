
// src/components/qr/list.tsx
"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Download, 
  Edit, 
  Trash2, 
  BarChart2,
  Link 
} from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

interface QRCode {
  id: string
  title: string
  type: string
  created: string
  scans: number
}

export function QRList() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchQRCodes()
  }, [])

  const fetchQRCodes = async () => {
    try {
      const response = await fetch("/api/qr/list")
      if (!response.ok) throw new Error("Failed to fetch QR codes")
      const data = await response.json()
      setQrCodes(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch QR codes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/qr/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete QR code")
      
      setQrCodes(qrCodes.filter(qr => qr.id !== id))
      toast({
        title: "Success",
        description: "QR code deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete QR code",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Scans</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {qrCodes.map((qr) => (
            <TableRow key={qr.id}>
              <TableCell className="font-medium">{qr.title}</TableCell>
              <TableCell>{qr.type}</TableCell>
              <TableCell>
                {format(new Date(qr.created), "MMM d, yyyy")}
              </TableCell>
              <TableCell>{qr.scans}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <BarChart2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDelete(qr.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
