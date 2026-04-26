import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Roadmap from '@/models/Roadmap'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    await connectDB()
    const roadmaps = await Roadmap.find({ userId: payload.userId }).sort({ createdAt: -1 })

    return NextResponse.json({ msg: 'Roadmaps fetched successfully', roadmaps })
  } catch (err) {
    return NextResponse.json({ msg: 'Server error', error: 'Server error' }, { status: 500 })
  }
}