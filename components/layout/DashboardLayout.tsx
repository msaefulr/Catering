'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardHeader } from './DashboardHeader'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const role = (user as any)?.level || (user as any)?.role || 'pelanggan'

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 w-64 shadow-2xl lg:shadow-none",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <DashboardSidebar role={role} onClose={() => setIsSidebarOpen(false)} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar">
                    <div className="py-8 px-6 lg:px-10 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
