import { BarChart2 } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-mono text-2xl font-medium text-ink uppercase tracking-tight">Analytika</h1>
        <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1">
          Výkon a statistiky chatbotů
        </p>
      </div>

      <div className="border border-paper_border border-dashed px-6 py-14 text-center" style={{ borderRadius: '2px' }}>
        <BarChart2 className="h-8 w-8 text-muted mx-auto mb-3" />
        <p className="font-mono text-sm text-ink uppercase tracking-wide mb-1">Brzy k dispozici</p>
        <p className="text-sm text-muted max-w-xs mx-auto">
          Graf zpráv, top dotazy, konverzní metriky. Dostupné od plánu Maker.
        </p>
      </div>
    </div>
  )
}
