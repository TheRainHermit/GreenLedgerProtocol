import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-6xl font-bold text-green-800 text-center mb-8">
          🌿 GreenLedger
        </h1>
        <p className="text-xl text-green-600 text-center mb-12 max-w-2xl mx-auto">
          Measure your sustainability impact and earn PYUSD rewards automatically
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/dashboard" className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700">
            Launch App
          </Link>
          <Link href="/leaderboard" className="border border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50">
            View Leaderboard
          </Link>
        </div>
      </div>
    </main>
  )
}