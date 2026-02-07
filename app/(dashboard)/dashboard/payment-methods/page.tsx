'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Wallet, Banknote, Landmark, Plus } from 'lucide-react'

export default function PaymentMethodsPage() {
    const { user, token } = useAuth()
    const [methods, setMethods] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!token || !user) {
            router.push('/login')
            return
        }
        if (user.level !== 'admin' && user.level !== 'owner') {
            router.push('/dashboard')
            return
        }
        fetchMethods()
    }, [user, token, router])

    const fetchMethods = async () => {
        try {
            const res = await fetch('/api/payment-methods', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const json = await res.json()
            if (json.success) setMethods(json.data)
        } catch (error) {
            console.error('Error fetching payment methods:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-12 text-center text-slate-500">Loading payment methods...</div>

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
                    <p className="text-muted-foreground">Manage payment options and bank account details for customers.</p>
                </div>
                <Button className="font-bold shadow-lg shadow-primary/20">
                    <Plus className="mr-2" size={18} /> Add Method
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {methods.map((method) => (
                    <Card key={method.id.toString()} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b bg-slate-50/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:scale-110 transition-transform">
                                    <CreditCard size={18} />
                                </div>
                                <CardTitle className="text-base font-bold">{method.metode_pembayaran}</CardTitle>
                            </div>
                            <Badge variant="outline" className="text-[10px] font-bold">ACTIVE</Badge>
                        </CardHeader>
                        <CardContent className="py-6 space-y-4">
                            {method.detail_jenis_pembayarans?.length > 0 ? (
                                method.detail_jenis_pembayarans.map((detail: any) => (
                                    <div key={detail.id.toString()} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                        <Landmark className="text-slate-400 mt-1" size={16} />
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">{detail.tempat_bayar}</p>
                                            <p className="text-sm font-mono text-slate-600">{detail.no_rek}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-400 italic">No details added yet.</p>
                            )}
                        </CardContent>
                        <div className="px-6 pb-6 mt-auto">
                            <Button variant="outline" size="sm" className="w-full text-xs font-bold">Edit Details</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
