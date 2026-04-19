import { FileText } from 'lucide-react'

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight">Dokumenty</h1>
        <p className="text-sm text-muted mt-0.5">Knowledge base pro tvoje chatboty</p>
      </div>

      <div className="bg-white rounded-xl border border-paper_border border-dashed shadow-sm px-6 py-14 text-center">
        <div className="h-12 w-12 bg-bone rounded-xl flex items-center justify-center mx-auto mb-4">
          <FileText className="h-6 w-6 text-muted" />
        </div>
        <p className="font-semibold text-ink mb-1">Brzy k dispozici</p>
        <p className="text-sm text-muted max-w-xs mx-auto">
          Globální správa dokumentů přes všechny chatboty. Prozatím nahrej dokumenty přímo v nastavení chatbota.
        </p>
      </div>
    </div>
  )
}
