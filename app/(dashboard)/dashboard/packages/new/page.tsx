'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
    ArrowLeft,
    Upload,
    Package as PackageIcon,
    ChevronRight,
    Utensils
} from 'lucide-react'
import Link from 'next/link'

export default function NewPackagePage() {
    const { token } = useAuth()
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        nama_paket: '',
        jenis: '',
        kategori: '',
        jumlah_pax: '',
        harga_paket: '',
        deskripsi: '',
        foto1: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/packages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            const json = await res.json()
            if (json.success) {
                toast({ title: "Success", description: "Package created successfully!" })
                router.push('/dashboard/packages')
            } else {
                toast({ variant: "destructive", title: "Error", description: json.message })
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Something went wrong" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/packages">
                    <Button variant="outline" size="icon" className="rounded-full">
                        <ArrowLeft size={18} />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Package</h1>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <span>Management</span>
                        <ChevronRight size={14} className="mx-1" />
                        <span>Packages</span>
                        <ChevronRight size={14} className="mx-1" />
                        <span className="text-primary font-medium">New</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-md bg-white">
                            <CardHeader className="border-b bg-slate-50/50">
                                <CardTitle className="text-lg">Package Details</CardTitle>
                                <CardDescription>Basic information about your catering package.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Package Name</label>
                                    <Input
                                        required
                                        placeholder="e.g. Wedding Deluxe Buffet"
                                        value={formData.nama_paket}
                                        onChange={e => setFormData({ ...formData, nama_paket: e.target.value })}
                                        className="bg-slate-50/50 focus:bg-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Type</label>
                                        <Input
                                            required
                                            placeholder="e.g. Prasmanan"
                                            value={formData.jenis}
                                            onChange={e => setFormData({ ...formData, jenis: e.target.value })}
                                            className="bg-slate-50/50 focus:bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Category</label>
                                        <Input
                                            required
                                            placeholder="e.g. Wedding"
                                            value={formData.kategori}
                                            onChange={e => setFormData({ ...formData, kategori: e.target.value })}
                                            className="bg-slate-50/50 focus:bg-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Description</label>
                                    <Textarea
                                        required
                                        placeholder="Detailed description of the menu and services..."
                                        rows={5}
                                        value={formData.deskripsi}
                                        onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                                        className="bg-slate-50/50 focus:bg-white resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md bg-white">
                            <CardHeader className="border-b bg-slate-50/50">
                                <CardTitle className="text-lg">Pricing & Capacity</CardTitle>
                                <CardDescription>Define how much you charge and the minimum pax.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4 pt-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Price (IDR)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-500 font-bold">Rp</span>
                                        <Input
                                            required
                                            type="number"
                                            placeholder="0"
                                            value={formData.harga_paket}
                                            onChange={e => setFormData({ ...formData, harga_paket: e.target.value })}
                                            className="pl-10 bg-slate-50/50 focus:bg-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Min. Pax</label>
                                    <Input
                                        required
                                        type="number"
                                        placeholder="0"
                                        value={formData.jumlah_pax}
                                        onChange={e => setFormData({ ...formData, jumlah_pax: e.target.value })}
                                        className="bg-slate-50/50 focus:bg-white"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar/Media */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-md bg-white">
                            <CardHeader className="border-b bg-slate-50/50">
                                <CardTitle className="text-lg">Package Image</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="w-full aspect-video rounded-xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                                        {formData.foto1 ? (
                                            <img src={formData.foto1} className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <>
                                                <Upload size={32} className="mb-2" />
                                                <p className="text-xs font-medium">Upload Image URL</p>
                                            </>
                                        )}
                                    </div>
                                    <Input
                                        placeholder="https://image-url.com/photo.jpg"
                                        value={formData.foto1}
                                        onChange={e => setFormData({ ...formData, foto1: e.target.value })}
                                        className="bg-slate-50/50 focus:bg-white text-xs"
                                    />
                                    <p className="text-[10px] text-slate-500 font-medium italic">
                                        Supported formats: JPG, UI, PNG. Recommended size 800x600.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 gap-4">
                            <Button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 h-12 text-lg font-bold shadow-lg shadow-primary/20"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <Utensils size={18} />
                                        Save Package
                                    </>
                                )}
                            </Button>
                            <Link href="/dashboard/packages">
                                <Button variant="ghost" className="w-full text-slate-500">
                                    Cancel & Return
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
