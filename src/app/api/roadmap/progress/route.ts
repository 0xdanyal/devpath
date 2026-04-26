import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Roadmap from '@/models/Roadmap'
import { verifyToken } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    await connectDB()
    const { roadmapId, skillIndex, completed } = await req.json()

    const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: payload.userId })
    if (!roadmap) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    roadmap.skills[skillIndex].completed = completed
    await roadmap.save()

    return NextResponse.json({ roadmap })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}