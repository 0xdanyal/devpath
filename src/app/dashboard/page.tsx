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
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">DevPath</h1>
        <div className="flex items-center gap-4">
          <span className="text-white/50 text-sm">{user?.name}</span>
          <button onClick={logout} className="text-sm text-white/50 hover:text-white transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Your Roadmaps</h2>
            <p className="text-white/50 mt-1">Track your learning progress</p>
          </div>
          <Link href="/generate"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg text-sm font-medium transition">
            + New Roadmap
          </Link>
        </div>

        {loading ? (
          <div className="text-white/50">Loading...</div>
        ) : roadmaps.length === 0 ? (
          <div className="border border-dashed border-white/20 rounded-xl p-12 text-center space-y-3">
            <p className="text-white/50">No roadmaps yet</p>
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
                  className="border border-white/10 rounded-xl p-5 hover:border-white/30 transition space-y-3 block">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{r.jobTitle}</h3>
                    <span className="text-sm text-white/50">{progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-white/40 text-sm">
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