import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, isAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const user = getAuthUser(request)
        if (!isAdmin(user)) {
            return NextResponse.json({ success: false, message: 'Forbidden. Admin or Owner access required.' }, { status: 403 })
        }

        // Get total orders
        const totalOrders = await prisma.pemesanans.count()

        // Get pending orders (Menunggu Konfirmasi)
        const pendingOrders = await prisma.pemesanans.count({
            where: {
                status_pesan: 'Menunggu_Konfirmasi'
            }
        })

        // Get total customers
        const totalCustomers = await prisma.pelanggans.count()

        // Get total packages
        const totalPackages = await prisma.pakets.count()

        // Get total revenue (this month)
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)

        const totalRevenue = await prisma.pemesanans.aggregate({
            _sum: {
                total_bayar: true
            }
        })

        // Get recent orders (last 10)
        const recentOrders = await prisma.pemesanans.findMany({
            take: 10,
            orderBy: {
                created_at: 'desc'
            },
            include: {
                pelanggan: true
            }
        })

        return NextResponse.json({
            success: true,
            totalOrders,
            pendingOrders,
            totalCustomers,
            totalPackages,
            totalRevenue: totalRevenue._sum.total_bayar || 0,
            recentOrders
        })
    } catch (error: any) {
        console.error('Error fetching dashboard stats:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error: ' + error.message },
            { status: 500 }
        )
    }
}