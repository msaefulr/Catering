import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Cari pelanggan berdasarkan email
        const pelanggan = await prisma.pelanggans.findUnique({
            where: { email }
        })

        if (!pelanggan) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Verifikasi password
        const isValidPassword = await bcrypt.compare(password, pelanggan.password)
        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: pelanggan.id.toString(),
                email: pelanggan.email,
                level: 'pelanggan'
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        // Prepare user data
        const userData = {
            id: pelanggan.id.toString(),
            nama_pelanggan: pelanggan.nama_pelanggan,
            email: pelanggan.email,
            level: 'pelanggan',
            token: token
        }

        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            data: userData
        })

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
            sameSite: 'lax'
        })

        return response

    } catch (error: any) {
        console.error('Login error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error: ' + error.message },
            { status: 500 }
        )
    }
}