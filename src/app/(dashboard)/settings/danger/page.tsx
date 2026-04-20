'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function DangerSettings() {
  const [confirm, setConfirm] = useState('')

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-red-200 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <p className="text-sm font-semibold text-red-700">Nebezpečná zóna</p>
          </div>
          <p className="text-xs text-red-500 mt-0.5">Tyto akce jsou nevratné</p>
        </div>
        <div className="px-5 py-5 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">Smazat účet</p>
              <p className="text-xs text-muted mt-0.5">
                Nenávratně smaže všechna data — chatboty, dokumenty, konverzace.
                Předplatné se zruší.
              </p>
            </div>
            <Button variant="danger" size="sm" disabled>
              Smazat účet
            </Button>
          </div>
          <p className="text-xs text-muted font-mono border border-paper_border rounded-md px-3 py-2">
            Smazání účtu kontaktuj support@botcraft.cz — manuálně ověříme a provedeme do 24 h.
          </p>
        </div>
      </div>
    </div>
  )
}
