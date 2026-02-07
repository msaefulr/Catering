'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function MyOrdersPage() {
    const { user, token } = useAuth()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!token || !user) {
            router.push('/login')
            return
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const json = await res.json()
                if (json.success) {
                    setOrders(json.data)
                }
            } catch (error) {
                console.error('Error fetching orders:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [user, token, router])

    if (loading) return <div className="p-8 text-center">Loading your orders...</div>

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">My Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    {orders.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                            You haven't placed any orders yet.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Resi</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id.toString()}>
                                        <TableCell className="font-mono font-bold">{order.no_resi}</TableCell>
                                        <TableCell>{new Date(order.tgl_pesan).toLocaleDateString()}</TableCell>
                                        <TableCell>Rp {Number(order.total_bayar).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                order.status_pesan === 'Menunggu_Konfirmasi' ? 'outline' :
                                                    order.status_pesan === 'Sedang_Diproses' ? 'secondary' : 'default'
                                            }>
                                                {order.status_pesan.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
