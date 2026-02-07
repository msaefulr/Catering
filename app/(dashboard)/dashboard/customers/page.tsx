'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CustomersPage() {
    const { user, token } = useAuth()
    const [customers, setCustomers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!token || !user) {
            router.push('/login')
            return
        }
        fetchCustomers()
    }, [user, token, router])

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/customers', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const json = await res.json()
            if (json.success) setCustomers(json.data)
        } catch (error) {
            console.error('Error fetching customers:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-12 text-center text-slate-500">Loading customers...</div>

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
                <p className="text-muted-foreground">View and manage your registered customer base.</p>
            </div>

            <Card className="border-none shadow-md overflow-hidden bg-white">
                <CardHeader className="border-b bg-slate-50/50">
                    <CardTitle className="text-lg">Registered Customers</CardTitle>
                    <CardDescription>Complete list of customers and their order history.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 hover:bg-slate-50">
                                    <TableHead className="px-6">Customer</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Total Orders</TableHead>
                                    <TableHead className="px-6">Address</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.map((cust) => (
                                    <TableRow key={cust.id.toString()} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="px-6 py-4 flex items-center gap-3">
                                            <Avatar className="h-8 w-8 border">
                                                <AvatarImage src={cust.foto} />
                                                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                                    {cust.nama_pelanggan.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-slate-900">{cust.nama_pelanggan}</span>
                                        </TableCell>
                                        <TableCell className="text-slate-600">{cust.email}</TableCell>
                                        <TableCell className="text-slate-500">{new Date(cust.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-semibold text-slate-700">{cust._count.pemesanans}</TableCell>
                                        <TableCell className="px-6 max-w-xs truncate text-slate-500">{cust.alamat1 || '-'}</TableCell>
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
