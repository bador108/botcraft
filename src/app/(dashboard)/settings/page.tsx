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
        <h1 className="font-mono text-2xl font-medium text-ink uppercase tracking-tight">Nastavení</h1>
        <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1">Účet a preference</p>
      </div>

      {/* Account info */}
      <div className="border border-paper_border" style={{ borderRadius: '2px' }}>
        <div className="px-5 py-3 border-b border-paper_border">
          <p className="font-mono text-[11px] text-muted uppercase tracking-wider">Účet</p>
        </div>
        <div className="divide-y divide-paper_border">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-mono text-[12px] text-muted uppercase tracking-wider">E-mail</span>
            <span className="font-mono text-sm text-ink">{typedUser?.email ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-mono text-[12px] text-muted uppercase tracking-wider">Plán</span>
            <span className="font-mono text-sm text-ink capitalize">{typedUser?.plan ?? 'Hobby'}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-mono text-[12px] text-muted uppercase tracking-wider">Člen od</span>
            <span className="font-mono text-sm text-ink">
              {typedUser?.created_at
                ? new Date(typedUser.created_at).toLocaleDateString('cs-CZ')
                : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Placeholder for more settings */}
      <div className="border border-paper_border border-dashed px-6 py-10 text-center" style={{ borderRadius: '2px' }}>
        <Settings className="h-7 w-7 text-muted mx-auto mb-3" />
        <p className="font-mono text-sm text-ink uppercase tracking-wide mb-1">Další nastavení brzy</p>
        <p className="text-sm text-muted">Notifikace, API klíče, team seats.</p>
      </div>
    </div>
  )
}
