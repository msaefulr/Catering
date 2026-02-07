'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Users,
    ShoppingBag,
    CreditCard,
    Package,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface DashboardStats {
    totalOrders: number
    pendingOrders: number
    totalCustomers: number
    totalPackages: number
    totalRevenue: number
    recentOrders: any[]
}

export default function Dashboard() {
    const { user, token } = useAuth()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!token || !user) {
            router.push('/login')
            return
        }
        fetchStats()
    }, [user, token, router])

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/dashboard/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setStats(data)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading your dashboard...</p>
        </div>
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Overview</h1>
                    <p className="text-slate-500">Detailed insights into your catering operations.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Orders</CardTitle>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <ShoppingBag size={18} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{stats?.totalOrders || 0}</div>
                        <p className="text-xs text-blue-600 font-medium mt-1">Lifetime total</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-slate-500">Pending Confirmation</CardTitle>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <CreditCard size={18} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{stats?.pendingOrders || 0}</div>
                        <p className="text-xs text-amber-600 font-medium mt-1">Action required</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Customers</CardTitle>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <Users size={18} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{stats?.totalCustomers || 0}</div>
                        <p className="text-xs text-green-600 font-medium mt-1">Registered users</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Package size={18} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 truncate">Rp {(stats?.totalRevenue || 0).toLocaleString('id-ID')}</div>
                        <p className="text-xs text-indigo-600 font-medium mt-1">All time earnings</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders Table */}
            <Card className="border-none shadow-sm overflow-hidden bg-white">
                <CardHeader className="border-b bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
                            <CardDescription>The most recent activity in your shop.</CardDescription>
                        </div>
                        <button className="text-xs font-bold text-primary hover:underline">View All</button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 font-medium border-b">
                                    <th className="h-12 px-6 text-left align-middle">Order ID</th>
                                    <th className="h-12 px-6 text-left align-middle">Customer</th>
                                    <th className="h-12 px-6 text-left align-middle">Date</th>
                                    <th className="h-12 px-6 text-left align-middle">Status</th>
                                    <th className="h-12 px-6 text-right align-middle">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recentOrders?.map((order) => (
                                    <tr key={order.id.toString()} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-slate-900">{order.no_resi}</td>
                                        <td className="px-6 py-4 text-slate-600">{order.pelanggan?.nama_pelanggan || 'N/A'}</td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(order.tgl_pesan).toLocaleDateString('id-ID')}</td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                                variant={
                                                    order.status_pesan === 'Menunggu_Konfirmasi' ? 'outline' :
                                                        order.status_pesan === 'Sedang_Diproses' ? 'secondary' : 'default'
                                                }
                                            >
                                                {order.status_pesan.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-900">
                                            Rp {(order.total_bayar).toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
