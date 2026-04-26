import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-3xl text-center space-y-7">
        <div className="inline-block bg-white/[0.06] text-sm px-4 py-1.5 rounded-full border border-white/20">
          AI-Powered Career Roadmaps
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
          Stop guessing.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Start learning.
          </span>
        </h1>
        <p className="text-white/60 text-lg leading-relaxed">
          Paste any job description. Get a personalized learning roadmap with free resources — instantly.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register"
            className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-white/90 active:scale-[0.99] transition">
            Get Started Free
          </Link>
          <Link href="/login"
            className="border border-white/20 bg-white/[0.02] px-6 py-3 rounded-xl hover:bg-white/10 active:scale-[0.99] transition">
            Sign In
          </Link>
        </div>
      </div>
    </main>
  )
}