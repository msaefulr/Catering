import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, isAdmin } from '@/lib/auth'

// GET package by id
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const packageId = BigInt(params.id)

        const pkg = await prisma.pakets.findUnique({
            where: { id: packageId }
        })

        if (!pkg) {
            return NextResponse.json(
                { success: false, message: 'Package not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: pkg
        })
    } catch (error: any) {
        console.error('Error fetching package:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error: ' + error.message },
            { status: 500 }
        )
    }
}

// PUT update package
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = getAuthUser(request)
        if (!isAdmin(user)) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized. Admin or Owner access required.' },
                { status: 403 }
            )
        }

        const packageId = BigInt(params.id)
        const data = await request.json()

        const updatedPackage = await prisma.pakets.update({
            where: { id: packageId },
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
            message: 'Package updated successfully',
            data: updatedPackage
        })
    } catch (error: any) {
        console.error('Error updating package:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error: ' + error.message },
            { status: 500 }
        )
    }
}

// DELETE package
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = getAuthUser(request)
        if (!isAdmin(user)) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized. Admin or Owner access required.' },
                { status: 403 }
            )
        }

        const packageId = BigInt(params.id)

        await prisma.pakets.delete({
            where: { id: packageId }
        })

        return NextResponse.json({
            success: true,
            message: 'Package deleted successfully'
        })
    } catch (error: any) {
        console.error('Error deleting package:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error: ' + error.message },
            { status: 500 }
        )
    }
}