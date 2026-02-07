'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Package,
    ClipboardList,
    Users,
    Truck,
    Settings,
    X,
    Shield,
    Landmark
} from 'lucide-react'

interface SidebarProps {
    role: string
    onClose?: () => void
}

export function DashboardSidebar({ role, onClose }: SidebarProps) {
    const pathname = usePathname()

    const links = [
        {
            name: 'Overview',
            href: '/dashboard',
            icon: LayoutDashboard,
            roles: ['admin', 'owner']
        },
        {
            name: 'Packages',
            href: '/dashboard/packages',
            icon: Package,
            roles: ['admin', 'owner']
        },
        {
            name: 'Orders',
            href: '/dashboard/orders',
            icon: ClipboardList,
            roles: ['admin', 'owner']
        },
        {
            name: 'Customers',
            href: '/dashboard/customers',
            icon: Users,
            roles: ['admin', 'owner']
        },
        {
            name: 'Deliveries',
            href: '/dashboard/deliveries',
            icon: Truck,
            roles: ['kurir', 'admin']
        },
        {
            name: 'Staff',
            href: '/dashboard/staff',
            icon: Shield,
            roles: ['admin', 'owner']
        },
        {
            name: 'Payments',
            href: '/dashboard/payment-methods',
            icon: Landmark,
            roles: ['admin', 'owner']
        },
    ]

    const filteredLinks = links.filter(link => link.roles.includes(role))

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white w-64 shadow-xl">
            <div className="flex items-center justify-between p-6">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl">🍽️</span>
                    <span className="font-bold text-xl tracking-tight">Catering<span className="text-primary">Pro</span></span>
                </Link>
                {onClose && (
                    <button onClick={onClose} className="lg:hidden p-2 hover:bg-slate-800 rounded-md">
                        <X size={20} />
                    </button>
                )}
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {filteredLinks.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            )}
                        >
                            <Icon size={18} className={cn(
                                "transition-colors",
                                isActive ? "text-white" : "text-slate-500 group-hover:text-white"
                            )} />
                            {link.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-6 border-t border-slate-800">
                <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white cursor-pointer transition-colors text-sm font-medium">
                    <Settings size={18} />
                    <span>Settings</span>
                </div>
            </div>
        </div>
    )
}
