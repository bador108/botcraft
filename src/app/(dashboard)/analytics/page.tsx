'use client'

import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Download, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { format } from 'date-fns'

interface Stats {
  totalMessages: number
  uniqueSessions: number
  avgResponseMs: number
  satisfactionRate: number | null
  unansweredCount: number
  modelUsage: { fast: number; balanced: number; premium: number }
  dailyData: Array<{ date: string; user_messages: number; unique_sessions: number }>
  previousPeriod: { totalMessages: number; uniqueSessions: number }
}

interface Query { query: string; count: number }
interface Chatbot { id: string; name: string }

const RANGE_OPTIONS = [
  { label: '7 dní', value: 7 },
  { label: '30 dní', value: 30 },
  { label: '90 dní', value: 90 },
]

const MODEL_COLORS = ['#D4500A', '#2563EB', '#059669']

function pct(curr: number, prev: number) {
  if (!prev) return null
  return Math.round(((curr - prev) / prev) * 100)
}

function StatCard({ label, value, prev, unit = '' }: {
  label: string; value: number | null; prev?: number | null; unit?: string
}) {
  const change = (value != null && prev != null) ? pct(value, prev) : null
  return (
    <div className="bg-white rounded-xl border border-paper_border shadow-sm p-5">
      <p className="text-xs font-mono text-muted uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-bold text-ink tracking-tight">
        {value == null ? '—' : `${value.toLocaleString('cs-CZ')}${unit}`}
      </p>
      {change != null && (
        <p className={`text-xs font-mono mt-1 flex items-center gap-1 ${
          change > 0 ? 'text-success' : change < 0 ? 'text-red-500' : 'text-muted'
        }`}>
          {change > 0 ? <TrendingUp className="h-3 w-3" /> : change < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
          {change > 0 ? '+' : ''}{change}% vs. předchozí období
        </p>
      )}
    </div>
  )
}

export default function AnalyticsPage() {
  const [days, setDays] = useState(30)
  const [chatbotId, setChatbotId] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)
  const [topQueries, setTopQueries] = useState<Query[]>([])
  const [unanswered, setUnanswered] = useState<Query[]>([])
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/chatbots').then(r => r.json()).then(d => Array.isArray(d) && setChatbots(d)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const q = chatbotId ? `&chatbotId=${chatbotId}` : ''
    Promise.all([
      fetch(`/api/analytics/stats?days=${days}${q}`).then(r => r.json()),
      fetch(`/api/analytics/top-queries?type=top${q}`).then(r => r.json()),
      fetch(`/api/analytics/top-queries?type=unanswered${q}`).then(r => r.json()),
    ]).then(([s, tq, un]) => {
      setStats(s)
      setTopQueries(Array.isArray(tq) ? tq : [])
      setUnanswered(Array.isArray(un) ? un : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [days, chatbotId])

  const modelPieData = stats ? [
    { name: 'Fast', value: stats.modelUsage.fast },
    { name: 'Balanced', value: stats.modelUsage.balanced },
    { name: 'Premium', value: stats.modelUsage.premium },
  ].filter(d => d.value > 0) : []

  const dailyChartData = (stats?.dailyData ?? [])
    .map(d => ({ ...d, label: format(new Date(d.date), 'd.M.') }))
    .sort((a, b) => a.date.localeCompare(b.date))

  function exportCsv() {
    const q = chatbotId ? `&chatbotId=${chatbotId}` : ''
    window.open(`/api/analytics/export?days=${days}${q}`, '_blank')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Analytika</h1>
          <p className="text-sm text-muted mt-0.5">Výkon a statistiky chatbotů</p>
        </div>
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted border border-paper_border rounded-lg hover:text-ink hover:bg-bone transition-colors"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="inline-flex border border-paper_border rounded-lg overflow-hidden">
          {RANGE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setDays(opt.value)}
              className={`px-4 py-1.5 text-sm font-mono transition-colors ${
                days === opt.value
                  ? 'bg-ink text-white'
                  : 'text-muted hover:text-ink hover:bg-bone'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {chatbots.length > 0 && (
          <select
            value={chatbotId}
            onChange={e => setChatbotId(e.target.value)}
            className="px-3 py-1.5 text-sm border border-paper_border rounded-lg bg-white text-ink focus:outline-none focus:ring-1 focus:ring-ink/20"
          >
            <option value="">Všichni chatboti</option>
            {chatbots.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Zprávy" value={stats?.totalMessages ?? null} prev={stats?.previousPeriod.totalMessages} />
        <StatCard label="Unikátní uživatelé" value={stats?.uniqueSessions ?? null} prev={stats?.previousPeriod.uniqueSessions} />
        <StatCard label="Prům. odezva" value={stats ? Math.round(stats.avgResponseMs) : null} unit=" ms" />
        <StatCard label="Satisfaction" value={stats?.satisfactionRate ?? null} unit="%" />
      </div>

      {/* Line chart */}
      <div className="bg-white rounded-xl border border-paper_border shadow-sm p-5">
        <p className="text-sm font-semibold text-ink mb-4">Zprávy v čase</p>
        {loading ? (
          <div className="h-48 flex items-center justify-center text-muted text-sm">Načítání…</div>
        ) : dailyChartData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-muted text-sm">Zatím žádná data</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dailyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2F2EF" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#A8A8A8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#A8A8A8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #F2F2EF', fontSize: 12 }} />
              <Line type="monotone" dataKey="user_messages" name="Zprávy" stroke="#D4500A" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="unique_sessions" name="Sessiony" stroke="#2563EB" strokeWidth={2} dot={false} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Model usage + Unanswered */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-paper_border shadow-sm p-5">
          <p className="text-sm font-semibold text-ink mb-4">Využití modelů</p>
          {modelPieData.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-muted text-sm">Zatím žádná data</div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={modelPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {modelPieData.map((_, i) => <Cell key={i} fill={MODEL_COLORS[i % MODEL_COLORS.length]} />)}
                </Pie>
                <Legend iconType="circle" iconSize={8} />
                <Tooltip formatter={(v) => [`${v} zpráv`, '']} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-paper_border shadow-sm p-5">
          <p className="text-sm font-semibold text-ink mb-1">Nezodpovězené dotazy</p>
          <p className="text-xs text-muted mb-4">Bot nenašel relevantní chunk</p>
          {unanswered.length === 0 ? (
            <div className="h-24 flex items-center justify-center text-muted text-sm">Žádné nezodpovězené</div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {unanswered.slice(0, 10).map((q, i) => (
                <div key={i} className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-ink truncate max-w-[220px]" title={q.query}>{q.query}</span>
                  <span className="font-mono text-muted shrink-0">{q.count}×</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top queries */}
      <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-paper_border">
          <p className="text-sm font-semibold text-ink">Top dotazy (30 dní)</p>
        </div>
        {topQueries.length === 0 ? (
          <div className="px-5 py-10 text-center text-muted text-sm">Zatím žádná data</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-paper border-b border-paper_border">
                <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Dotaz</th>
                <th className="text-right px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Počet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper_border">
              {topQueries.map((q, i) => (
                <tr key={i} className="hover:bg-bone/30 transition-colors">
                  <td className="px-5 py-3 text-ink max-w-[500px] truncate" title={q.query}>{q.query}</td>
                  <td className="px-5 py-3 text-right font-mono text-muted">{q.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
