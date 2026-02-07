import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const authUser = getAuthUser(request)
        if (!authUser) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        let user: any = null

        // Check in users table (Staff)
        if (authUser.level === 'admin' || authUser.level === 'owner' || authUser.level === 'kurir') {
            user = await prisma.users.findUnique({
                where: { id: BigInt(authUser.userId) }
            })
        } else {
            // Check in pelanggans table
            user = await prisma.pelanggans.findUnique({
                where: { id: BigInt(authUser.userId) }
            })
        }

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }

        // Remove sensitive data
        const { password, ...safeUser } = user

        return NextResponse.json({
            success: true,
            data: {
                ...safeUser,
                id: safeUser.id.toString(),
                level: (safeUser as any).level || 'pelanggan'
            }
        })

    } catch (error: any) {
        console.error('Profile API Error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
    }
}
