'use client'

import { useAuth } from '@/store/auth'
import { Badge } from '@/components/ui/badge'
import { Bell, Search, Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface DashboardHeaderProps {
    onMenuClick?: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    const { user, logout } = useAuth()
    const role = (user as any)?.level || (user as any)?.role || 'User'

    return (
        <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4 flex-1">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
                    <Menu size={20} />
                </Button>
                <div className="relative w-full max-w-md hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        placeholder="Search analytics, orders..."
                        className="pl-10 bg-slate-50 border-none focus-visible:ring-primary/20"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-slate-500 hover:text-primary transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900 leading-none mb-1">
                            {user?.name || user?.nama_pelanggan || 'User'}
                        </p>
                        <Badge variant="outline" className="capitalize text-[10px] h-4 py-0 font-bold bg-slate-50">
                            {role}
                        </Badge>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-slate-100 hover:border-primary/20 transition-all">
                                <Avatar className="h-full w-full">
                                    <AvatarImage src={user?.foto || ''} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                        {user?.name?.charAt(0) || user?.nama_pelanggan?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile Setting</DropdownMenuItem>
                            <DropdownMenuItem>Activity Log</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout} className="text-red-600 font-medium">
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
