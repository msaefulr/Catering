import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, isAdmin } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
    try {
        const user = getAuthUser(request)
        if (!isAdmin(user)) {
            return NextResponse.json({ success: false, message: 'Forbidden. Admin or Owner access required.' }, { status: 403 })
        }

        const staff = await prisma.users.findMany({
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                level: true,
                created_at: true,
            }
        })

        const formattedStaff = staff.map(s => ({
            ...s,
            id: s.id.toString(),
        }))

        return NextResponse.json({ success: true, data: formattedStaff })

    } catch (error: any) {
        console.error('Fetch staff error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const authUser = getAuthUser(request)
        if (!isAdmin(authUser)) {
            return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
        }

        const { name, email, password, level } = await request.json()

        if (!name || !email || !password || !level) {
            return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 })
        }

        const existingUser = await prisma.users.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newStaff = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                level: level as any
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Staff created successfully',
            data: {
                id: newStaff.id.toString(),
                name: newStaff.name,
                email: newStaff.email,
                level: newStaff.level
            }
        })

    } catch (error: any) {
        console.error('Create staff error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error: ' + error.message }, { status: 500 })
    }
}
