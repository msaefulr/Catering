'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Star, Users, Utensils, ArrowRight } from 'lucide-react'

export default function PublicPackagesPage() {
    const [packages, setPackages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/packages/public')
            .then(res => res.json())
            .then(data => {
                setPackages(data.packages || [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-50/30 font-sans">
            {/* Hero Section */}
            <div className="relative bg-slate-900 overflow-hidden py-24 mb-16">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <Badge variant="secondary" className="mb-4 px-4 py-1 text-xs font-bold uppercase tracking-widest bg-primary/20 text-primary-foreground border-none">
                        Premium Catering
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
                        Exquisite Flavors for <span className="text-primary italic">Every Occasion</span>
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        Discover our curated menu of gourmet catering packages designed to make your celebrations truly unforgettable.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button className="h-14 px-8 text-xl font-bold rounded-full shadow-2xl shadow-primary/40 hover:scale-105 transition-transform">
                            Explore Packages <ShoppingBag className="ml-2" size={20} />
                        </Button>
                        <Button variant="outline" className="h-14 px-8 text-lg font-bold rounded-full text-white border-white/20 hover:bg-white/10 backdrop-blur-sm">
                            How it Works
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pb-24 max-w-7xl">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Available Packages</h2>
                        <p className="text-slate-500 font-medium">Browse our most popular options for any event size.</p>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <Badge variant="outline" className="cursor-pointer hover:bg-white transition-colors h-10 px-4 rounded-full border-slate-200 text-slate-600 font-bold">All</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-white transition-colors h-10 px-4 rounded-full border-slate-200 text-slate-600 font-bold">Prasmanan</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-white transition-colors h-10 px-4 rounded-full border-slate-200 text-slate-600 font-bold">Box</Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {packages.map((pkg) => (
                        <Card key={pkg.id.toString()} className="flex flex-col border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white rounded-3xl overflow-hidden group">
                            <div className="h-72 relative overflow-hidden">
                                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                                {pkg.foto1 ? (
                                    <img src={pkg.foto1} alt={pkg.nama_paket} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-7xl group-hover:scale-110 transition-transform duration-700">🍽️</div>
                                )}
                                <div className="absolute top-4 left-4 z-20 flex gap-2">
                                    <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none font-bold py-1 px-3 shadow-lg">
                                        {pkg.jenis}
                                    </Badge>
                                </div>
                                <div className="absolute bottom-4 right-4 z-20">
                                    <Badge className="bg-primary text-white font-bold py-1 px-3 shadow-lg border-none flex items-center gap-1">
                                        <Star size={12} className="fill-white" /> 4.9
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">{pkg.nama_paket}</CardTitle>
                                </div>
                                <p className="text-slate-500 font-medium text-sm mt-1">{pkg.kategori}</p>
                            </CardHeader>

                            <CardContent className="flex-grow space-y-4 pt-1">
                                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5">
                                        <Users size={14} className="text-primary" /> {pkg.jumlah_pax} People
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Utensils size={14} className="text-primary" /> Delivery Ready
                                    </div>
                                </div>

                                <p className="text-slate-500 line-clamp-2 text-sm leading-relaxed">
                                    {pkg.deskripsi}
                                </p>

                                <div className="pt-2">
                                    <span className="text-sm font-bold text-slate-400">Price Starts From</span>
                                    <p className="text-3xl font-extrabold text-slate-900">
                                        Rp {Number(pkg.harga_paket).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </CardContent>

                            <CardFooter className="p-6 pt-0">
                                <Link href={`/packages/${pkg.id}`} className="w-full">
                                    <Button className="w-full h-12 text-lg font-bold rounded-2xl group-hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                        View Details <ArrowRight size={18} />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-primary py-20">
                <div className="container mx-auto px-6 text-center text-white">
                    <h2 className="text-4xl font-bold mb-6">Ready to Plan Your Event?</h2>
                    <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-10 font-medium">
                        Custom packages and personalized menus are available. Contact our event planners for a consultation.
                    </p>
                    <Link href="/register">
                        <Button variant="secondary" className="h-14 px-10 text-xl font-bold rounded-full text-primary hover:scale-105 transition-transform">
                            Create Account
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
