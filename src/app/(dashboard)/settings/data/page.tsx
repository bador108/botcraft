import { Database } from 'lucide-react'

export default function DataSettings() {
  return (
    <div className="bg-white rounded-xl border border-paper_border border-dashed px-6 py-12 text-center">
      <Database className="h-10 w-10 text-muted mx-auto mb-4" />
      <p className="font-semibold text-ink mb-1">Data & Export</p>
      <p className="text-sm text-muted max-w-xs mx-auto">
        Export konverzací, smazání dat, GDPR. Brzy k dispozici.
      </p>
    </div>
  )
}
