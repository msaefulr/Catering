import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const packages = await prisma.pakets.findMany({
            orderBy: {
                created_at: 'desc'
            }
        })

        return NextResponse.json({
            success: true,
            packages
        })
    } catch (error: any) {
        console.error('Error fetching public packages:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error: ' + error.message },
            { status: 500 }
        )
    }
}