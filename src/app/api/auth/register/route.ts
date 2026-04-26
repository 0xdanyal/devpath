import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { name, email, password } = await req.json()

    if (!name || !email || !password)
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })

    const existing = await User.findOne({ email })
    if (existing)
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed })
    const token = signToken(user._id.toString())

    return NextResponse.json({ msg: 'Registration successful', token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    return NextResponse.json({ msg: 'Server error', error: 'Server error' }, { status: 500 })
  }
}