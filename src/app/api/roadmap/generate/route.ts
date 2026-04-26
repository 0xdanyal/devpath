import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Roadmap from '@/models/Roadmap'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    await connectDB()
    const { jobTitle, jobDescription } = await req.json()

    // Call Gemini
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a senior developer and mentor. Analyze this job description and return a JSON learning roadmap.

Job Title: ${jobTitle}
Job Description: ${jobDescription}

Return ONLY a valid JSON array (no markdown, no explanation) like this:
[
  {
    "name": "skill name",
    "order": 1,
    "resources": [
      { "title": "resource title", "url": "https://...", "type": "youtube" },
      { "title": "resource title", "url": "https://...", "type": "docs" },
      { "title": "resource title", "url": "https://...", "type": "github" }
    ]
  }
]

Rules:
- Extract 5-8 most important skills from the job description
- Order them from foundational to advanced
- For each skill provide exactly 3 resources: one youtube, one docs, one github
- Use only real, free, popular URLs (MDN, official docs, fireship youtube, traversy media, etc)
- Return only the JSON array, nothing else`
            }]
          }]
        })
      }
    )

    const geminiData = await geminiRes.json()
    const text = geminiData.candidates[0].content.parts[0].text
    const skills = JSON.parse(text.trim())

    const roadmap = await Roadmap.create({
      userId: payload.userId,
      jobTitle,
      jobDescription,
      skills
    })

    return NextResponse.json({ msg: 'Roadmap generated successfully', roadmap })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ msg: 'Server error', error: 'Server error' }, { status: 500 })
  }
}