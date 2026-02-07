'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    ArrowLeft,
    Users,
    Utensils,
    Calendar,
    Clock,
    CheckCircle2,
    ChevronRight,
    Star
} from "lucide-react"
import Link from 'next/link'

export default function PackageDetailPage() {
    const { id } = useParams()
    const [pkg, setPkg] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetch(`/api/packages/${id}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) setPkg(json.data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [id])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    )

    if (!pkg) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <h2 className="text-2xl font-bold mb-4">Package not found</h2>
            <Button onClick={() => router.push('/packages')}>Back to All Packages</Button>
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-50/30 pb-20 font-sans">
            <div className="container mx-auto px-6 py-8 max-w-6xl">
                <Link href="/packages" className="inline-flex items-center text-slate-500 hover:text-primary mb-8 font-bold transition-colors group">
                    <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Packages
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Visual Section */}
                    <div className="space-y-6">
                        <div className="aspect-[4/3] bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 border-4 border-white">
                            {pkg.foto1 ? (
                                <img src={pkg.foto1} alt={pkg.nama_paket} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-9xl bg-slate-100">🍽️</div>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="aspect-square bg-white rounded-2xl overflow-hidden border-2 border-slate-100 hover:border-primary transition-colors cursor-pointer shadow-sm">
                                    <div className="w-full h-full flex items-center justify-center text-2xl bg-slate-50">📷</div>
                                </div>
                            ))}
                        </div>

                        <Card className="border-none shadow-lg shadow-slate-200/50 rounded-3xl bg-white p-6">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="text-green-500" size={20} /> What's Included
                            </h3>
                            <ul className="space-y-3">
                                {['Premium Table Setup', 'Professional Servers', 'Standard Cutlery', 'Heated Food Displays'].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge className="bg-primary/10 text-primary border-none font-bold px-3 py-1">
                                    {pkg.jenis}
                                </Badge>
                                <Badge variant="outline" className="border-slate-200 text-slate-500 font-bold px-3 py-1">
                                    {pkg.kategori}
                                </Badge>
                                <div className="flex items-center gap-1 ml-auto">
                                    <Star size={16} className="fill-amber-400 text-amber-400" />
                                    <span className="font-bold text-slate-900">4.9</span>
                                    <span className="text-slate-400 text-sm">(120+ Reviews)</span>
                                </div>
                            </div>

                            <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
                                {pkg.nama_paket}
                            </h1>

                            <div className="text-4xl font-extrabold text-primary mb-8">
                                Rp {Number(pkg.harga_paket).toLocaleString('id-ID')}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Capacity</p>
                                    <p className="text-lg font-bold text-slate-900">{pkg.jumlah_pax} People</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prep Time</p>
                                    <p className="text-lg font-bold text-slate-900">24 Hours</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-10">
                            <h2 className="text-xl font-bold text-slate-900">Experience Description</h2>
                            <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                {pkg.deskripsi}
                            </p>
                        </div>

                        <Separator className="mb-10 bg-slate-200" />

                        <div className="mt-auto space-y-4">
                            <Link href={`/orders/new?packageId=${pkg.id}`}>
                                <Button size="lg" className="w-full h-16 text-xl font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                                    Instant Booking <ChevronRight size={20} />
                                </Button>
                            </Link>
                            <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <div className="flex items-center gap-1.5"><Calendar size={14} /> Easy Rescheduling</div>
                                <div className="flex items-center gap-1.5"><Utensils size={14} /> Verified Taste</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
