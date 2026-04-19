import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { Settings } from 'lucide-react'
import type { User } from '@/types'

export default async function SettingsPage() {
  const { userId } = await auth()
  const db = createServiceClient()
  const { data: user } = await db.from('users').select('*').eq('id', userId!).single()
  const typedUser = user as User | null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight">Nastavení</h1>
        <p className="text-sm text-muted mt-0.5">Účet a preference</p>
      </div>

      {/* Account info */}
      <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-paper_border">
          <p className="text-sm font-semibold text-ink">Účet</p>
        </div>
        <div className="divide-y divide-paper_border">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-muted">E-mail</span>
            <span className="text-sm font-medium text-ink">{typedUser?.email ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-muted">Plán</span>
            <span className="text-sm font-medium text-ink capitalize">{typedUser?.plan ?? 'Hobby'}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-muted">Člen od</span>
            <span className="text-sm font-medium text-ink">
              {typedUser?.created_at
                ? new Date(typedUser.created_at).toLocaleDateString('cs-CZ')
                : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Placeholder */}
      <div className="bg-white rounded-xl border border-paper_border border-dashed shadow-sm px-6 py-10 text-center">
        <div className="h-12 w-12 bg-bone rounded-xl flex items-center justify-center mx-auto mb-4">
          <Settings className="h-6 w-6 text-muted" />
        </div>
        <p className="font-semibold text-ink mb-1">Další nastavení brzy</p>
        <p className="text-sm text-muted">Notifikace, API klíče, team seats.</p>
      </div>
    </div>
  )
}
