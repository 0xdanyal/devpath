'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/lib/api'

interface Resource {
  title: string
  url: string
  type: 'youtube' | 'github' | 'docs'
}

interface Skill {
  name: string
  order: number
  completed: boolean
  resources: Resource[]
}

interface Roadmap {
  _id: string
  jobTitle: string
  jobDescription: string
  skills: Skill[]
}

const typeColors = {
  youtube: 'bg-red-500/10 text-red-400 border-red-500/20',
  github: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  docs: 'bg-green-500/10 text-green-400 border-green-500/20'
}

const typeIcons = {
  youtube: '▶',
  github: '⌥',
  docs: '📄'
}

export default function RoadmapPage() {
  const router = useRouter()
  const params = useParams()
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    fetchRoadmap()
  }, [])

  async function fetchRoadmap() {
    try {
      const res = await api.get('/roadmap/list')
      const found = res.data.roadmaps.find((r: Roadmap) => r._id === params.id)
      if (!found) { router.push('/dashboard'); return }
      setRoadmap(found)
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  async function toggleSkill(skillIndex: number, completed: boolean) {
    if (!roadmap) return
    try {
      const res = await api.patch('/roadmap/progress', {
        roadmapId: roadmap._id,
        skillIndex,
        completed
      })
      setRoadmap(res.data.roadmap)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-white/60">Loading roadmap...</p>
    </main>
  )

  if (!roadmap) return null

  const completed = roadmap.skills.filter(s => s.completed).length
  const progress = Math.round((completed / roadmap.skills.length) * 100)

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 bg-black/60 backdrop-blur px-6 py-4 flex items-center justify-between">
        <button onClick={() => router.push('/dashboard')}
          className="text-white/60 hover:text-white transition text-sm">
          ← Dashboard
        </button>
        <span className="text-sm text-white/60">{completed}/{roadmap.skills.length} completed</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10 md:px-8 md:py-12 space-y-8 md:space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{roadmap.jobTitle}</h1>
          <p className="text-white/60 leading-relaxed">{roadmap.jobDescription}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white/10 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-white/60 w-10">{progress}%</span>
          </div>
        </div>

        <div className="space-y-4 md:space-y-5">
          {roadmap.skills.map((skill, index) => (
            <div key={index}
              className={`border rounded-2xl p-5 md:p-6 space-y-4 transition-all duration-200 shadow-[0_8px_30px_rgb(0,0,0,0.25)] ${skill.completed
                ? 'border-blue-400/30 bg-blue-500/[0.07]'
                : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'}`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleSkill(index, !skill.completed)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${skill.completed
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-white/30 hover:border-blue-400'}`}>
                  {skill.completed && <span className="text-white text-xs">✓</span>}
                </button>
                <div>
                  <span className="text-xs text-white/30 mr-2">#{skill.order}</span>
                  <span className={`text-base font-semibold tracking-tight ${skill.completed ? 'line-through text-white/40' : ''}`}>
                    {skill.name}
                  </span>
                </div>
              </div>

              <div className="grid gap-2.5 ml-9">
                {skill.resources.map((res, ri) => (
                  <a key={ri} href={res.url} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-2 border rounded-xl min-h-[44px] px-3.5 py-2.5 text-sm hover:opacity-90 transition ${typeColors[res.type]}`}>
                    <span>{typeIcons[res.type]}</span>
                    <span className="flex-1 truncate">{res.title}</span>
                    <span className="text-xs opacity-60 uppercase">{res.type}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {progress === 100 && (
          <div className="border border-green-400/30 bg-green-500/[0.08] rounded-2xl p-6 md:p-7 text-center space-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.25)]">
            <p className="text-2xl">🎉</p>
            <p className="font-semibold text-green-400">Roadmap Complete!</p>
            <p className="text-white/60 text-sm">You're ready to apply for this role.</p>
          </div>
        )}
      </div>
    </main>
  )
}