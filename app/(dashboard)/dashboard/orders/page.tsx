'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function OrdersPage() {
    const { user, token } = useAuth()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        if (!token || !user) {
            router.push('/login')
            return
        }
        fetchOrders()
    }, [user, token, router])

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const json = await res.json()
            if (json.success) setOrders(json.data)
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status_pesan: newStatus })
            })

            const json = await res.json()
            if (json.success) {
                toast({ title: "Status Updated", description: `Order ${orderId} is now ${newStatus}` })
                fetchOrders()
            } else {
                toast({ variant: "destructive", title: "Update Failed", description: json.message })
            }
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    if (loading) return <div className="p-12 text-center text-slate-500">Loading orders...</div>

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
                <p className="text-muted-foreground">Monitor and update status for all customer orders.</p>
            </div>

            <Card className="border-none shadow-md overflow-hidden bg-white">
                <CardHeader className="border-b bg-slate-50/50">
                    <CardTitle className="text-lg">All Orders</CardTitle>
                    <CardDescription>A list of all orders from your catering business.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 hover:bg-slate-50">
                                    <TableHead className="px-6">Resi</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="px-6 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id.toString()} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="px-6 font-mono font-bold text-slate-900">{order.no_resi}</TableCell>
                                        <TableCell>{order.pelanggan?.nama_pelanggan}</TableCell>
                                        <TableCell>{new Date(order.tgl_pesan).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-semibold">Rp {Number(order.total_bayar).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                                variant={
                                                    order.status_pesan === 'Menunggu_Konfirmasi' ? 'outline' :
                                                        order.status_pesan === 'Sedang_Diproses' ? 'secondary' : 'default'
                                                }>
                                                {order.status_pesan.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 text-right">
                                            <Select
                                                defaultValue={order.status_pesan}
                                                onValueChange={(value) => updateStatus(order.id.toString(), value)}
                                            >
                                                <SelectTrigger className="w-[160px] h-8 text-xs ml-auto">
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Menunggu_Konfirmasi">Menunggu Konfirmasi</SelectItem>
                                                    <SelectItem value="Sedang_Diproses">Sedang Diproses</SelectItem>
                                                    <SelectItem value="Menunggu_Kurir">Menunggu Kurir</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
