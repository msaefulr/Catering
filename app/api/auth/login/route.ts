import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Cari user berdasarkan email
        const user = await prisma.users.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Verifikasi password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id.toString(),
                email: user.email,
                level: user.level
            },
            process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
            { expiresIn: '1d' }
        )

        // Prepare user data
        const userData = {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            level: user.level,
            token: token
        }

        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            data: userData
        })

        // Set cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
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