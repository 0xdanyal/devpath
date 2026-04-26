import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, password } = await req.json()

    const user = await User.findOne({ email })
    if (!user)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken(user._id.toString())
    return NextResponse.json({ msg: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    return NextResponse.json({ msg: 'Server error', error: 'Server error' }, { status: 500 })
  }
}