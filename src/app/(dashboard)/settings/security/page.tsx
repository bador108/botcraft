'use client'

import { useClerk } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Shield, Key, LogOut } from 'lucide-react'

export default function SecuritySettings() {
  const { openUserProfile, signOut } = useClerk()

  return (
    <div className="space-y-6">
      {/* Heslo a 2FA */}
      <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-paper_border">
          <p className="text-sm font-semibold text-ink">Přihlašovací údaje</p>
        </div>
        <div className="divide-y divide-paper_border">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Key className="h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium text-ink">Heslo</p>
                <p className="text-xs text-muted mt-0.5">Změna přes Clerk nastavení účtu</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => openUserProfile()}>
              Změnit
            </Button>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium text-ink">Dvoufaktorové ověřování</p>
                <p className="text-xs text-muted mt-0.5">Nastav 2FA přes nastavení účtu</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => openUserProfile()}>
              Nastavit
            </Button>
          </div>
        </div>
      </div>

      {/* Sessions */}
      <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-paper_border">
          <p className="text-sm font-semibold text-ink">Aktivní sessions</p>
          <p className="text-xs text-muted mt-0.5">Detail session přes Clerk nastavení</p>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <p className="text-sm text-muted">Spravuj aktivní přihlášení</p>
          <Button variant="secondary" size="sm" onClick={() => openUserProfile()}>
            Zobrazit
          </Button>
        </div>
      </div>

      {/* Odhlásit ze všeho */}
      <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-paper_border">
          <p className="text-sm font-semibold text-ink">Odhlášení</p>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <p className="text-sm text-muted">Odhlásit se ze všech zařízení</p>
          <Button
            variant="danger"
            size="sm"
            onClick={() => signOut({ redirectUrl: '/sign-in' })}
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            Odhlásit vše
          </Button>
        </div>
      </div>
    </div>
  )
}
