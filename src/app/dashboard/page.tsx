'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'

interface Roadmap {
  _id: string
  jobTitle: string
  skills: { completed: boolean }[]
  createdAt: string
}

export default function Dashboard() {
  const router = useRouter()
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (!token) { router.push('/login'); return }
    setUser(JSON.parse(userData || '{}'))
    fetchRoadmaps()
  }, [])

  async function fetchRoadmaps() {
    try {
      const res = await api.get('/roadmap/list')
      setRoadmaps(res.data.roadmaps)
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.clear()
    router.push('/')
  }

  function getProgress(skills: { completed: boolean }[]) {
    if (!skills.length) return 0
    return Math.round((skills.filter(s => s.completed).length / skills.length) * 100)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 bg-black/60 backdrop-blur px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">DevPath</h1>
        <div className="flex items-center gap-4">
          <span className="text-white/50 text-sm">{user?.name}</span>
          <button onClick={logout} className="text-sm text-white/50 hover:text-white transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10 md:px-8 md:py-12 space-y-8 md:space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Your Roadmaps</h2>
            <p className="text-white/60 mt-1">Track your learning progress</p>
          </div>
          <Link href="/generate"
            className="bg-blue-600 hover:bg-blue-500 active:scale-[0.99] px-5 py-2.5 rounded-xl text-sm font-medium transition">
            + New Roadmap
          </Link>
        </div>

        {loading ? (
          <div className="text-white/50">Loading...</div>
        ) : roadmaps.length === 0 ? (
          <div className="border border-dashed border-white/20 bg-white/[0.02] rounded-2xl p-12 text-center space-y-3">
            <p className="text-white/60">No roadmaps yet</p>
            <Link href="/generate" className="text-blue-400 hover:underline text-sm">
              Generate your first roadmap →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {roadmaps.map(r => {
              const progress = getProgress(r.skills)
              return (
                <Link key={r._id} href={`/roadmap/${r._id}`}
                  className="border border-white/10 bg-white/[0.03] rounded-2xl p-5 md:p-6 hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all duration-200 space-y-3 block shadow-[0_8px_30px_rgb(0,0,0,0.25)]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base md:text-lg font-semibold tracking-tight">{r.jobTitle}</h3>
                    <span className="text-sm text-white/60">{progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-white/50 text-sm">
                    {r.skills.filter(s => s.completed).length}/{r.skills.length} skills completed
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}