import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const methods = await prisma.jenis_pembayarans.findMany({
            include: {
                detail_jenis_pembayarans: true
            }
        })
        return NextResponse.json({ success: true, data: methods })
    } catch (error: any) {
        console.error('Fetch payment methods error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error: ' + error.message }, { status: 500 })
    }
}
