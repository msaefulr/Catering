'use client'

import { useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { getCookie } from 'cookies-next'

interface AuthProviderProps {
    children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { token, user, getProfile, setUser, setToken } = useAuth()

    useEffect(() => {
        const storedToken = getCookie('token')?.toString()
        const storedUser = getCookie('user')?.toString()

        if (storedToken && !token) {
            setToken(storedToken)
        }

        if (storedUser && !user) {
            try {
                const parsedUser = JSON.parse(storedUser)
                setUser(parsedUser)
            } catch (error) {
                console.error('Error parsing stored user:', error)
            }
        }

        // Sync profile on mount if token exists
        if (storedToken && !user) {
            getProfile()
        }
    }, [token, user, getProfile, setUser, setToken])

    return <>{children}</>
}

export { useAuth }
