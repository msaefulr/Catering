'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/store/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    Package as PackageIcon,
    Search,
    Filter
} from 'lucide-react'
import { Input } from "@/components/ui/input"

interface Package {
    id: bigint
    nama_paket: string
    jenis: string
    kategori: string
    jumlah_pax: number
    harga_paket: number
    deskripsi: string
    foto1?: string
}

export default function PackagesPage() {
    const { user, token } = useAuth()
    const [packages, setPackages] = useState<Package[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!token || !user) {
            router.push('/login')
            return
        }
        fetchPackages()
    }, [user, token, router])

    const fetchPackages = async () => {
        try {
            const res = await fetch('/api/packages', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setPackages(data.packages || [])
            }
        } catch (error) {
            console.error('Error fetching packages:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: bigint) => {
        if (!confirm('Are you sure you want to delete this package?')) return

        try {
            const res = await fetch(`/api/packages/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (res.ok) {
                setPackages(packages.filter(pkg => pkg.id !== id))
            }
        } catch (error) {
            console.error('Error deleting package:', error)
        }
    }

    if (loading) return <div className="p-12 text-center text-slate-500">Loading packages...</div>

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Package Management</h1>
                    <p className="text-muted-foreground">Manage your catering offerings and menu sets.</p>
                </div>
                <Link href="/dashboard/packages/new">
                    <Button className="flex items-center gap-2 shadow-lg shadow-primary/20">
                        <Plus size={18} />
                        Add New Package
                    </Button>
                </Link>
            </div>

            <Card className="border-none shadow-md overflow-hidden bg-white">
                <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between space-y-0 py-4">
                    <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-1 w-full max-w-sm">
                        <Search size={16} className="text-slate-400" />
                        <Input
                            placeholder="Search packages..."
                            className="border-none focus-visible:ring-0 h-8 text-sm placeholder:text-slate-400"
                        />
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Filter size={14} />
                        Filter
                    </Button>
                </CardHeader>
                <CardContent className="p-6">
                    {packages.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="inline-flex p-4 rounded-full bg-slate-50 text-slate-300 mb-4">
                                <PackageIcon size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">No Packages Yet</h3>
                            <p className="text-slate-500 mb-6">Start by adding your first catering package to the catalog.</p>
                            <Link href="/dashboard/packages/new">
                                <Button>Create First Package</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {packages.map((pkg) => (
                                <Card key={pkg.id.toString()} className="group border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white">
                                    <div className="relative h-48 overflow-hidden bg-slate-100">
                                        {pkg.foto1 ? (
                                            <img src={pkg.foto1} alt={pkg.nama_paket} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <PackageIcon size={48} />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm border-none shadow-sm font-bold text-[10px] uppercase tracking-wider">
                                                {pkg.jenis}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{pkg.nama_paket}</h3>
                                        </div>
                                        <p className="text-2xl font-black text-primary mb-3">
                                            Rp {pkg.harga_paket.toLocaleString('id-ID')}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
                                            <span className="flex items-center gap-1">
                                                <Badge variant="outline" className="text-[10px]">{pkg.kategori}</Badge>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye size={12} />
                                                {pkg.jumlah_pax} Pax
                                            </span>
                                        </div>
                                        <p className="text-slate-600 text-sm line-clamp-2 mb-6 h-10">
                                            {pkg.deskripsi}
                                        </p>
                                        <div className="flex items-center gap-2 pt-4 border-t">
                                            <Link href={`/dashboard/packages/edit/${pkg.id}`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full flex items-center gap-2 font-bold text-xs h-9">
                                                    <Edit size={14} />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(pkg.id)}
                                                className="w-9 h-9 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                            <Link href={`/packages/${pkg.id}`} target="_blank">
                                                <Button variant="ghost" size="sm" className="w-9 h-9 p-0 text-slate-400">
                                                    <Eye size={16} />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}