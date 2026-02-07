import { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'

export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'

export interface AuthUser {
    userId: string
    email: string
    level: string
}

export function getAuthUser(request?: NextRequest): AuthUser | null {
    try {
        // Try to get token from cookies first
        let token = cookies().get('token')?.value

        // If not in cookies, try Authorization header
        if (!token && request) {
            const authHeader = request.headers.get('Authorization')
            if (authHeader?.startsWith('Bearer ')) {
                token = authHeader.substring(7)
            }
        }

        if (!token) return null

        const decoded = verify(token, JWT_SECRET) as AuthUser
        return decoded
    } catch (error) {
        return null
    }
}

export function isStaff(user: AuthUser | null): boolean {
    if (!user) return false
    return ['admin', 'owner', 'kurir'].includes(user.level)
}

export function isAdmin(user: AuthUser | null): boolean {
    if (!user) return false
    return user.level === 'admin' || user.level === 'owner'
}

export function isCourier(user: AuthUser | null): boolean {
    if (!user) return false
    return user.level === 'kurir' || user.level === 'admin'
}

export function isCustomer(user: AuthUser | null): boolean {
    if (!user) return false
    return user.level === 'pelanggan'
}
