'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, CreditCard, ShieldCheck, Truck, ArrowLeft, Landmark, Badge } from 'lucide-react'
import Link from 'next/link'

function CheckoutContent() {
    const searchParams = useSearchParams()
    const packageId = searchParams.get('packageId')
    const { user, token } = useAuth()
    const router = useRouter()
    const { toast } = useToast()

    const [pkg, setPkg] = useState<any>(null)
    const [paymentMethods, setPaymentMethods] = useState<any[]>([])
    const [selectedMethod, setSelectedMethod] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!token || !user) {
            router.push('/login')
            return
        }

        const fetchData = async () => {
            try {
                const pkgRes = await fetch(`/api/packages/${packageId}`)
                const pkgJson = await pkgRes.json()
                if (pkgJson.success) setPkg(pkgJson.data)

                const payRes = await fetch('/api/payment-methods')
                const payJson = await payRes.json()
                if (payJson.success) setPaymentMethods(payJson.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        if (packageId) fetchData()
    }, [packageId, token, user, router])

    const handleSubmit = async () => {
        if (!selectedMethod) {
            toast({ variant: "destructive", title: "Select Payment", description: "Please choose a payment method" })
            return
        }

        setSubmitting(true)
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_jenis_bayar: selectedMethod,
                    packages: [{ id_paket: pkg.id }]
                })
            })

            const json = await res.json()
            if (json.success) {
                toast({ title: "Order Success", description: "Your order has been placed!" })
                router.push('/my-orders')
            } else {
                toast({ variant: "destructive", title: "Order Failed", description: json.message })
            }
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message })
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">Preparing your checkout...</p>
        </div>
    )

    if (!pkg) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <h2 className="text-2xl font-bold mb-4">Package not found</h2>
            <Button onClick={() => router.push('/packages')}>Browse Packages</Button>
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 font-sans">
            <div className="container mx-auto px-6 max-w-6xl">
                <Link href={`/packages/${pkg.id}`} className="inline-flex items-center text-slate-500 hover:text-primary mb-8 font-bold transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> Back to Package Details
                </Link>

                <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Checkout</h1>
                <p className="text-slate-500 mb-10 font-medium">Complete your order details and choose a payment method.</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    {/* Left Column: Payment & Shipping Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                            <CardHeader className="bg-slate-50 pb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold">Payment Method</CardTitle>
                                        <CardDescription>Select how you'd like to pay for your catering.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="py-8">
                                <RadioGroup onValueChange={setSelectedMethod} className="grid gap-6">
                                    {paymentMethods.map((method) => (
                                        <div key={method.id.toString()} className={`relative flex items-center transition-all border-2 rounded-2xl p-5 cursor-pointer ${selectedMethod === method.id.toString() ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                                            <RadioGroupItem value={method.id.toString()} id={method.id.toString()} className="sr-only" />
                                            <Label htmlFor={method.id.toString()} className="flex items-center gap-4 w-full cursor-pointer">
                                                <div className={`p-3 rounded-full ${selectedMethod === method.id.toString() ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                    <Landmark size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-slate-900">{method.metode_pembayaran}</div>
                                                    {method.detail_jenis_pembayarans?.[0] && (
                                                        <p className="text-sm text-slate-500 font-medium mt-1">
                                                            {method.detail_jenis_pembayarans[0].tempat_bayar} • {method.detail_jenis_pembayarans[0].no_rek}
                                                        </p>
                                                    )}
                                                </div>
                                                {selectedMethod === method.id.toString() && (
                                                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    </div>
                                                )}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl flex items-start gap-4">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-blue-900">Secure Checkout</p>
                                <p className="text-sm text-blue-700 font-medium">Your data is always encrypted and your order is protected by our catering guarantee.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary (Sticky) */}
                    <div className="space-y-6 lg:sticky lg:top-24">
                        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                            <CardHeader className="bg-slate-900 text-white pb-6">
                                <div className="flex items-center gap-3">
                                    <ShoppingCart size={20} className="text-primary" />
                                    <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="py-8 space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-16 w-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                        {pkg.foto1 ? (
                                            <img src={pkg.foto1} className="w-full h-full object-cover" />
                                        ) : <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 leading-tight mb-1">{pkg.nama_paket}</h3>
                                        <Badge variant="secondary" className="text-[10px] font-extrabold uppercase py-0 px-2">{pkg.jenis}</Badge>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <div className="flex justify-between text-sm font-medium text-slate-500">
                                        <span>Unit Price</span>
                                        <span className="text-slate-900">Rp {Number(pkg.harga_paket).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium text-slate-500">
                                        <span>Pax Amount</span>
                                        <span className="text-slate-900">{pkg.jumlah_pax} People</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium text-slate-500">
                                        <span>Delivery Fee</span>
                                        <span className="text-green-600 font-bold uppercase text-[10px] tracking-wider mt-1">FREE</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t-2 border-dashed border-slate-100 flex justify-between items-end">
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grand Total</span>
                                        <div className="text-3xl font-extrabold text-primary leading-none mt-1">
                                            Rp {Number(pkg.harga_paket).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50 p-6 flex flex-col gap-4">
                                <Button
                                    className="w-full h-14 text-xl font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                                    disabled={submitting}
                                    onClick={handleSubmit}
                                >
                                    {submitting ? 'Creating Order...' : 'Confirm Order'}
                                </Button>
                                <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
                                    <Truck size={14} /> Estimates Delivery in 2-3 hours
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Loading checkout content...</p>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    )
}
