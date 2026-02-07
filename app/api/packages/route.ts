import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, isAdmin } from '@/lib/auth'

// GET all packages
export async function GET(request: NextRequest) {
    try {
        const user = getAuthUser(request)

        // Return only active packages for non-staff if needed, 
        // but here it seems it's used for both management and public in some cases.
        // Let's keep it simple: if staff, show all.

        const packages = await prisma.pakets.findMany({
            orderBy: { created_at: 'desc' }
        })

        return NextResponse.json({
            success: true,
            packages
        })
    } catch (error: any) {
        console.error('Error fetching packages:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error: ' + error.message },
            { status: 500 }
        )
    }
}

// POST create new package (admin/owner only)
export async function POST(request: NextRequest) {
    try {
        const user = getAuthUser(request)
        if (!isAdmin(user)) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized. Admin or Owner access required.' },
                { status: 403 }
            )
        }

        const data = await request.json()

        const newPackage = await prisma.pakets.create({
            data: {
                nama_paket: data.nama_paket,
                jenis: data.jenis,
                kategori: data.kategori,
                jumlah_pax: parseInt(data.jumlah_pax),
                harga_paket: parseInt(data.harga_paket),
                deskripsi: data.deskripsi,
                foto1: data.foto1 || null,
                foto2: data.foto2 || null,
                foto3: data.foto3 || null,
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Package created successfully',
            data: newPackage
        })
    } catch (error: any) {
        console.error('Error creating package:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error: ' + error.message },
            { status: 500 }
        )
    }
}