import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, isAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const user = getAuthUser(request)
        if (!isAdmin(user)) {
            return NextResponse.json({ success: false, message: 'Forbidden. Admin or Owner access required.' }, { status: 403 })
        }

        const customers = await prisma.pelanggans.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                _count: {
                    select: { pemesanans: true }
                }
            }
        })

        return NextResponse.json({ success: true, data: customers })

    } catch (error: any) {
        console.error('Fetch customers error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error: ' + error.message }, { status: 500 })
    }
}
