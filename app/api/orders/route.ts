import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, isCustomer, isAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const user = getAuthUser(request)
        if (!user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const { level, userId } = user

        // If customer, only show their orders
        if (isCustomer(user)) {
            const orders = await prisma.pemesanans.findMany({
                where: { id_pelanggan: BigInt(userId) },
                include: {
                    pelanggan: true,
                    jenis_bayar: true,
                    detail_pemesanans: {
                        include: { paket: true }
                    }
                },
                orderBy: { created_at: 'desc' }
            })
            return NextResponse.json({ success: true, data: orders })
        }

        // If admin or owner, show all orders
        if (isAdmin(user)) {
            const orders = await prisma.pemesanans.findMany({
                include: {
                    pelanggan: true,
                    jenis_bayar: true,
                    detail_pemesanans: {
                        include: { paket: true }
                    }
                },
                orderBy: { created_at: 'desc' }
            })
            return NextResponse.json({ success: true, data: orders })
        }

        return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })

    } catch (error: any) {
        console.error('Fetch orders error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error: ' + error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = getAuthUser(request)
        if (!isCustomer(user)) {
            return NextResponse.json({ success: false, message: 'Only customers can place orders' }, { status: 403 })
        }

        const { id_jenis_bayar, packages } = await request.json()

        if (!id_jenis_bayar || !packages || !Array.isArray(packages) || packages.length === 0) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
        }

        const userId = BigInt(user!.userId)
        const resi = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

        let total_bayar = BigInt(0)
        const detailData = []

        for (const item of packages) {
            const paket = await prisma.pakets.findUnique({ where: { id: BigInt(item.id_paket) } })
            if (!paket) {
                return NextResponse.json({ success: false, message: `Package ${item.id_paket} not found` }, { status: 404 })
            }
            const subtotal = BigInt(paket.harga_paket)
            total_bayar += subtotal
            detailData.push({
                id_paket: BigInt(item.id_paket),
                subtotal: subtotal
            })
        }

        const order = await prisma.pemesanans.create({
            data: {
                id_pelanggan: userId,
                id_jenis_bayar: BigInt(id_jenis_bayar),
                no_resi: resi,
                tgl_pesan: new Date(),
                status_pesan: 'Menunggu_Konfirmasi',
                total_bayar: total_bayar,
                detail_pemesanans: {
                    create: detailData
                }
            },
            include: {
                detail_pemesanans: true
            }
        })

        return NextResponse.json({ success: true, message: 'Order created successfully', data: order })

    } catch (error: any) {
        console.error('Create order error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error: ' + error.message }, { status: 500 })
    }
}
