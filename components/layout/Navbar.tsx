'use client'

import Link from 'next/link'
import { useAuth } from '@/store/auth'
import { useEffect, useState } from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { user, logout, token } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (token && !user) {
      const storedUser = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='))
        ?.split('=')[1];

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(decodeURIComponent(storedUser))
          useAuth.getState().setUser(parsedUser)
        } catch (error) {
          console.error('Error parsing stored user:', error)
        }
      }
    }
  }, [token, user])

  const handleLogout = () => {
    logout()
  }

  const getUserLevel = () => {
    if (!user) return null
    return (user as any).level || user.role || 'pelanggan'
  }

  const userLevel = getUserLevel()

  if (!mounted) {
    return null
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🍽️</span>
            <span className="font-bold text-xl">CateringApp</span>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/packages" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Packages
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {user && (userLevel === 'admin' || userLevel === 'owner') && (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>{userLevel === 'admin' ? 'Admin' : 'Owner'}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <li>
                          <Link href="/dashboard" legacyBehavior passHref>
                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Dashboard</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                View analytics and statistics
                              </p>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                        <li>
                          <Link href="/dashboard/packages" legacyBehavior passHref>
                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Packages</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Manage catering packages
                              </p>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                        <li>
                          <Link href="/dashboard/orders" legacyBehavior passHref>
                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Orders</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                View and manage orders
                              </p>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                        <li>
                          <Link href="/dashboard/customers" legacyBehavior passHref>
                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Customers</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Manage customer data
                              </p>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </>
              )}

              {user && userLevel === 'kurir' && (
                <NavigationMenuItem>
                  <Link href="/dashboard/deliveries" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Deliveries
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}

              {user && (userLevel === 'pelanggan' || !userLevel) && (
                <>
                  <NavigationMenuItem>
                    <Link href="/my-orders" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        My Orders
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.foto || ''} alt={user.name || user.nama_pelanggan || 'User'} />
                    <AvatarFallback>
                      {user.name?.charAt(0) || user.nama_pelanggan?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name || user.nama_pelanggan || user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full bg-${userLevel === 'admin' ? 'red' : userLevel === 'owner' ? 'yellow' : userLevel === 'kurir' ? 'blue' : 'green'}-500 text-white`}>
                      {userLevel || 'Pelanggan'}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={userLevel === 'pelanggan' || !userLevel ? '/profile' : '/dashboard'}>
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}