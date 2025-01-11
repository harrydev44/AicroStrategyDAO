'use client'

import { Dashboard } from '@/components/dashboard'

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-4xl font-bold mb-12">AicroStrategy Stats</h1>
        <Dashboard />
      </main>
    </div>
  )
} 