'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Truck, MapPin, Package, Clock } from 'lucide-react'

export default function DeliveriesPage() {
    const { user, token } = useAuth()
    const [deliveries, setDeliveries] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        if (!token || !user) {
            router.push('/login')
            return
        }
        fetchDeliveries()
    }, [user, token, router])

    const fetchDeliveries = async () => {
        try {
            const res = await fetch('/api/deliveries', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const json = await res.json()
            if (json.success) setDeliveries(json.data)
        } catch (error) {
            console.error('Error fetching deliveries:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (id_pesan: string, action: 'pickup' | 'complete') => {
        try {
            const res = await fetch('/api/deliveries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id_pesan, action })
            })
            const json = await res.json()
            if (json.success) {
                toast({ title: "Success", description: `Delivery ${action}ed!` })
                fetchDeliveries()
            } else {
                toast({ variant: "destructive", title: "Error", description: json.message })
            }
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message })
        }
    }

    if (loading) return <div className="p-12 text-center text-slate-500">Loading deliveries...</div>

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Delivery Management</h1>
                <p className="text-muted-foreground">Manage your delivery tasks and track shipping status.</p>
            </div>

            <div className="grid gap-6">
                {deliveries.length === 0 ? (
                    <Card className="border-none shadow-sm bg-white">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="p-4 bg-slate-50 rounded-full mb-4">
                                <Truck className="text-slate-300" size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">No Pending Tasks</h3>
                            <p className="text-slate-500">You're all caught up! No orders ready for delivery.</p>
                        </CardContent>
                    </Card>
                ) : (
                    deliveries.map((item) => (
                        <Card key={item.id.toString()} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b bg-slate-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                        <Package size={18} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-bold">{item.no_resi}</CardTitle>
                                        <CardDescription>{item.pelanggan?.nama_pelanggan}</CardDescription>
                                    </div>
                                </div>
                                <Badge
                                    className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                    variant={item.pengirimans ? "secondary" : "default"}
                                >
                                    {item.pengirimans?.status_kirim?.replace('_', ' ') || 'Awaiting Pickup'}
                                </Badge>
                            </CardHeader>
                            <CardContent className="py-6">
                                <div className="grid md:grid-cols-2 gap-6 text-sm">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="text-slate-400 mt-1 flex-shrink-0" size={16} />
                                            <div>
                                                <p className="font-semibold text-slate-900">Delivery Address</p>
                                                <p className="text-slate-500">{item.pelanggan?.alamat1 || 'No address provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Clock className="text-slate-400" size={16} />
                                            <p className="text-slate-500 italic">Ordered on {new Date(item.tgl_pesan).toLocaleDateString('id-ID')}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50/30 border-t pt-4">
                                {!item.pengirimans ? (
                                    <Button className="w-full font-bold shadow-lg shadow-primary/20" onClick={() => handleAction(item.id.toString(), 'pickup')}>
                                        Pick Up For Delivery
                                    </Button>
                                ) : item.pengirimans.status_kirim === 'Sedang_Dikirim' ? (
                                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-200" onClick={() => handleAction(item.id.toString(), 'complete')}>
                                        Mark as Delivered
                                    </Button>
                                ) : (
                                    <Button className="w-full text-slate-500" variant="secondary" disabled>
                                        Completed on {new Date(item.pengirimans.tgl_tiba).toLocaleString()}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
