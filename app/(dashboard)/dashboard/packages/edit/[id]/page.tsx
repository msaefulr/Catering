'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/store/auth'
import { useRouter, useParams } from 'next/navigation'
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
    Save,
    Trash2
} from 'lucide-react'
import Link from 'next/link'

export default function EditPackagePage() {
    const { token } = useAuth()
    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        nama_paket: '',
        jenis: '',
        kategori: '',
        jumlah_pax: '',
        harga_paket: '',
        deskripsi: '',
        foto1: '',
    })

    useEffect(() => {
        if (params.id) {
            fetchPackage()
        }
    }, [params.id])

    const fetchPackage = async () => {
        try {
            const res = await fetch(`/api/packages/${params.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const json = await res.json()
            if (json.success) {
                const pkg = json.data
                setFormData({
                    nama_paket: pkg.nama_paket,
                    jenis: pkg.jenis,
                    kategori: pkg.kategori,
                    jumlah_pax: pkg.jumlah_pax.toString(),
                    harga_paket: pkg.harga_paket.toString(),
                    deskripsi: pkg.deskripsi,
                    foto1: pkg.foto1 || '',
                })
            } else {
                toast({ variant: "destructive", title: "Error", description: "Package not found" })
                router.push('/dashboard/packages')
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to fetch package" })
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const res = await fetch(`/api/packages/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            const json = await res.json()
            if (json.success) {
                toast({ title: "Updated", description: "Package updated successfully!" })
                router.push('/dashboard/packages')
            } else {
                toast({ variant: "destructive", title: "Error", description: json.message })
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Something went wrong" })
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading package details...</p>
        </div>
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/packages">
                    <Button variant="outline" size="icon" className="rounded-full">
                        <ArrowLeft size={18} />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Package</h1>
                    <div className="flex items-center text-sm text-muted-foreground mt-1 text-slate-500">
                        <span>Management</span>
                        <ChevronRight size={14} className="mx-1" />
                        <span>Packages</span>
                        <ChevronRight size={14} className="mx-1" />
                        <span className="text-primary font-medium">{formData.nama_paket}</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-md bg-white">
                            <CardHeader className="border-b bg-slate-50/50">
                                <CardTitle className="text-lg">Package Information</CardTitle>
                                <CardDescription>Update the details for this catering package.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Package Name</label>
                                    <Input
                                        required
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
                                            value={formData.jenis}
                                            onChange={e => setFormData({ ...formData, jenis: e.target.value })}
                                            className="bg-slate-50/50 focus:bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Category</label>
                                        <Input
                                            required
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
                                <CardTitle className="text-lg">Pricing Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4 pt-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Price per Pax (IDR)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-500 font-bold">Rp</span>
                                        <Input
                                            required
                                            type="number"
                                            value={formData.harga_paket}
                                            onChange={e => setFormData({ ...formData, harga_paket: e.target.value })}
                                            className="pl-10 bg-slate-50/50 focus:bg-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Minimum Pax</label>
                                    <Input
                                        required
                                        type="number"
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
                                <CardTitle className="text-lg">Package Media</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="w-full aspect-video rounded-xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 overflow-hidden">
                                        {formData.foto1 ? (
                                            <img src={formData.foto1} className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <Upload size={32} className="mb-2" />
                                                <p className="text-xs font-medium">No Image Uploaded</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Image URL</label>
                                        <Input
                                            placeholder="https://..."
                                            value={formData.foto1}
                                            onChange={e => setFormData({ ...formData, foto1: e.target.value })}
                                            className="bg-slate-50/50 focus:bg-white text-xs h-8"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 gap-4">
                            <Button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 h-12 text-lg font-bold shadow-lg shadow-primary/20"
                                disabled={saving}
                            >
                                {saving ? (
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Update Changes
                                    </>
                                )}
                            </Button>
                            <Link href="/dashboard/packages">
                                <Button variant="ghost" className="w-full text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center gap-2">
                                    Discard Changes
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
