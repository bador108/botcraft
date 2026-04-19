import { FileText } from 'lucide-react'

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-mono text-2xl font-medium text-ink uppercase tracking-tight">Dokumenty</h1>
        <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1">
          Knowledge base pro tvoje chatboty
        </p>
      </div>

      <div className="border border-paper_border border-dashed px-6 py-14 text-center" style={{ borderRadius: '2px' }}>
        <FileText className="h-8 w-8 text-muted mx-auto mb-3" />
        <p className="font-mono text-sm text-ink uppercase tracking-wide mb-1">Brzy k dispozici</p>
        <p className="text-sm text-muted max-w-xs mx-auto">
          Globální správa dokumentů přes všechny chatboty. Prozatím nahrej dokumenty přímo v nastavení chatbota.
        </p>
      </div>
    </div>
  )
}
