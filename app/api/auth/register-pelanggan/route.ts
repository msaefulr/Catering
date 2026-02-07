import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const {
            nama_pelanggan,
            email,
            password,
            telepon,
            tgl_lahir,
            alamat1
        } = await request.json()

        // Validation
        if (!nama_pelanggan || !email || !password) {
            return NextResponse.json(
                { success: false, message: 'Nama, email, and password are required' },
                { status: 400 }
            )
        }

        // Check if email already exists
        const existingUser = await prisma.pelanggans.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'Email already registered' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new customer
        const newCustomer = await prisma.pelanggans.create({
            data: {
                nama_pelanggan,
                email,
                password: hashedPassword,
                telepon,
                tgl_lahir: tgl_lahir ? new Date(tgl_lahir) : null,
                alamat1,
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Registration successful',
            data: {
                id: newCustomer.id.toString(),
                nama_pelanggan: newCustomer.nama_pelanggan,
                email: newCustomer.email,
            }
        })

    } catch (error: any) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error: ' + error.message },
            { status: 500 }
        )
    }
}