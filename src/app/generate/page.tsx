'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function Generate() {
  const router = useRouter()
  const [form, setForm] = useState({ jobTitle: '', jobDescription: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/roadmap/generate', form)
      router.push(`/roadmap/${res.data.roadmap._id}`)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <h2 className="text-3xl font-bold">Generate Roadmap</h2>
          <p className="text-white/50 mt-2">Paste a job description and get your personalized learning path</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Job Title (e.g. MERN Stack Developer)"
            value={form.jobTitle}
            onChange={e => setForm({ ...form, jobTitle: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition"
            required
          />
          <textarea
            placeholder="Paste the full job description here..."
            value={form.jobDescription}
            onChange={e => setForm({ ...form, jobDescription: e.target.value })}
            rows={10}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition resize-none"
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition disabled:opacity-50">
            {loading ? 'Generating your roadmap...' : 'Generate Roadmap →'}
          </button>
        </form>
      </div>
    </main>
  )
}