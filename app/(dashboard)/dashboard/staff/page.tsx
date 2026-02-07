'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, Shield, User, Truck, Mail, Lock } from 'lucide-react'

export default function StaffPage() {
    const { user, token } = useAuth()
    const [staff, setStaff] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        level: 'kurir'
    })
    const [submitting, setSubmitting] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        if (!token || !user) {
            router.push('/login')
            return
        }
        if (user.level !== 'admin' && user.level !== 'owner') {
            router.push('/dashboard')
            return
        }
        fetchStaff()
    }, [user, token, router])

    const fetchStaff = async () => {
        try {
            const res = await fetch('/api/staff', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const json = await res.json()
            if (json.success) setStaff(json.data)
        } catch (error) {
            console.error('Error fetching staff:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const res = await fetch('/api/staff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })
            const json = await res.json()
            if (json.success) {
                toast({ title: "Success", description: "Staff member added successfully" })
                setIsAddOpen(false)
                setFormData({ name: '', email: '', password: '', level: 'kurir' })
                fetchStaff()
            } else {
                toast({ variant: "destructive", title: "Error", description: json.message })
            }
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message })
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="p-12 text-center text-slate-500">Loading staff management...</div>

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
                    <p className="text-muted-foreground">Manage your team accounts and roles (Admin, Owner, Courier).</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="font-bold shadow-lg shadow-primary/20">
                            <UserPlus className="mr-2" size={18} /> Add New Staff
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Staff Member</DialogTitle>
                            <DialogDescription>
                                Create a new account for an Admin, Owner, or Courier.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddStaff} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <Input
                                        id="name"
                                        placeholder="Enter full name"
                                        className="pl-10"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@catering.test"
                                        className="pl-10"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Initial Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Min. 6 characters"
                                        className="pl-10"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="level">Role / Level</Label>
                                <Select
                                    value={formData.level}
                                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="owner">Owner</SelectItem>
                                        <SelectItem value="kurir">Courier</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter className="pt-4">
                                <Button type="submit" disabled={submitting} className="w-full font-bold">
                                    {submitting ? "Creating..." : "Create Account"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-none shadow-md overflow-hidden bg-white">
                <CardHeader className="border-b bg-slate-50/50">
                    <CardTitle className="text-lg">Staff List</CardTitle>
                    <CardDescription>Accounts with administrative and delivery access.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 hover:bg-slate-50">
                                <TableHead className="px-6">Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="px-6">Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staff.map((s) => (
                                <TableRow key={s.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                {s.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-slate-900">{s.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600 font-mono text-sm">{s.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                            variant={
                                                s.level === 'admin' ? 'destructive' :
                                                    s.level === 'owner' ? 'default' : 'secondary'
                                            }
                                        >
                                            <div className="flex items-center gap-1">
                                                {s.level === 'admin' ? <Shield size={10} /> :
                                                    s.level === 'kurir' ? <Truck size={10} /> : <User size={10} />}
                                                {s.level}
                                            </div>
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-6 text-slate-500 text-sm">
                                        {new Date(s.created_at).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
