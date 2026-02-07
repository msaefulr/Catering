import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, isCourier } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const user = getAuthUser(request)
        if (!isCourier(user)) {
            return NextResponse.json({ success: false, message: 'Forbidden. Courier access required.' }, { status: 403 })
        }

        // Orders waiting for courier or already being delivered by this courier
        const deliveries = await prisma.pemesanans.findMany({
            where: {
                OR: [
                    { status_pesan: 'Menunggu_Kurir' },
                    {
                        pengirimans: {
                            id_user: BigInt(user!.userId)
                        }
                    }
                ]
            },
            include: {
                pelanggan: true,
                pengirimans: true,
                detail_pemesanans: {
                    include: { paket: true }
                }
            },
            orderBy: { created_at: 'desc' }
        })

        return NextResponse.json({ success: true, data: deliveries })

    } catch (error: any) {
        console.error('Fetch deliveries error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error: ' + error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = getAuthUser(request)
        if (!user || user.level !== 'kurir') {
            return NextResponse.json({ success: false, message: 'Only courier can pick up orders' }, { status: 403 })
        }

        const { id_pesan, action } = await request.json()
        const userId = BigInt(user.userId)
        const orderId = BigInt(id_pesan)

        if (action === 'pickup') {
            await prisma.pengirimans.create({
                data: {
                    id_pesan: orderId,
                    id_user: userId,
                    tgl_kirim: new Date(),
                    status_kirim: 'Sedang_Dikirim'
                }
            })
        } else if (action === 'complete') {
            await prisma.pengirimans.update({
                where: { id_pesan: orderId },
                data: {
                    tgl_tiba: new Date(),
                    status_kirim: 'Tiba_Ditujukan'
                }
            })
        }

        return NextResponse.json({ success: true, message: `Delivery ${action} success` })

    } catch (error: any) {
        console.error('Delivery action error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error: ' + error.message }, { status: 500 })
    }
}
