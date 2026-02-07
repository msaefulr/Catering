import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, isAdmin, isCustomer } from '@/lib/auth'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = getAuthUser(request)
        if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

        const orderId = BigInt(params.id)

        const order = await prisma.pemesanans.findUnique({
            where: { id: orderId },
            include: {
                pelanggan: true,
                jenis_bayar: true,
                detail_pemesanans: {
                    include: { paket: true }
                },
                pengirimans: {
                    include: { user: true }
                }
            }
        })

        if (!order) return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })

        // RBAC Check
        if (isCustomer(user) && order.id_pelanggan.toString() !== user.userId) {
            return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
        }

        return NextResponse.json({ success: true, data: order })

    } catch (error: any) {
        console.error('Get order error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error: ' + error.message }, { status: 500 })
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = getAuthUser(request)
        if (!isAdmin(user)) {
            return NextResponse.json({ success: false, message: 'Forbidden. Admin or Owner access required.' }, { status: 403 })
        }

        const { status_pesan } = await request.json()
        const orderId = BigInt(params.id)

        const updatedOrder = await prisma.pemesanans.update({
            where: { id: orderId },
            data: { status_pesan }
        })

        return NextResponse.json({ success: true, message: 'Order status updated', data: updatedOrder })

    } catch (error: any) {
        console.error('Update order error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error: ' + error.message }, { status: 500 })
    }
}
