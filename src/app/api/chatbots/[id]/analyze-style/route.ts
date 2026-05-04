import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'

// Převede libovolný CSS color string na hex (pouze jednoduché rgb/rgba/#hex)
function toHex(color: string): string | null {
  color = color.trim()
  if (/^#[0-9a-f]{3,8}$/i.test(color)) {
    if (color.length === 4) {
      return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
    }
    return color.substring(0, 7).toLowerCase()
  }
  const rgb = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (rgb) {
    const r = parseInt(rgb[1]).toString(16).padStart(2, '0')
    const g = parseInt(rgb[2]).toString(16).padStart(2, '0')
    const b = parseInt(rgb[3]).toString(16).padStart(2, '0')
    return `#${r}${g}${b}`
  }
  return null
}

// Skóre barvy — upřednostní výrazné/nasycené barvy před bílou/černou/šedou
function colorScore(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  // Přeskočí příliš světlé (bílá) nebo příliš tmavé (černá) nebo šedé
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const lightness = (max + min) / 2 / 255
  const saturation = max === min ? 0 : (max - min) / (255 - Math.abs(2 * (max + min) / 2 - 255))

  if (lightness > 0.92 || lightness < 0.08) return 0  // příliš světlá/tmavá
  if (saturation < 0.2) return 0                        // příliš šedá

  return saturation * (1 - Math.abs(lightness - 0.45))  // nejlepší skóre pro středně nasycené
}

// CSS proměnné které typicky obsahují brand barvu
const BRAND_VAR_PATTERNS = [
  /--(?:primary|accent|brand|main|theme|color-primary|color-accent|color-brand|color-main|clr-primary|clr-accent)\s*:\s*([^;}\n]+)/gi,
]

// Inline <meta name="theme-color">
function extractMetaThemeColor(html: string): string | null {
  const match = html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']theme-color["']/i)
  if (match) return toHex(match[1])
  return null
}

function extractCssColors(html: string): string[] {
  const colors: string[] = []

  // CSS proměnné brand barev
  for (const pattern of BRAND_VAR_PATTERNS) {
    let m: RegExpExecArray | null
    while ((m = pattern.exec(html)) !== null) {
      const hex = toHex(m[1].trim())
      if (hex) colors.push(hex)
    }
  }

  // Hex barvy v <style> blocích a inline style atributech
  const styleBlocks = Array.from(html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi))
  for (const block of styleBlocks) {
    const hexes = block[1].match(/#[0-9a-f]{6}\b/gi) ?? []
    colors.push(...hexes.map(h => h.toLowerCase()))
  }

  return colors
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Ověř vlastnictví bota
  const db = createServiceClient()
  const { data: bot } = await db
    .from('chatbots')
    .select('id')
    .eq('id', params.id)
    .eq('user_id', userId)
    .single()

  if (!bot) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { url } = await req.json() as { url?: string }
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })

  // Základní URL validace — pouze http/https, žádné interní adresy
  let parsed: URL
  try {
    parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('bad protocol')
    if (['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(parsed.hostname)) {
      return NextResponse.json({ error: 'Local URLs are not allowed' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  try {
    const res = await fetch(parsed.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BotCraft-StyleAnalyzer/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) return NextResponse.json({ error: `Failed to fetch page: ${res.status}` }, { status: 422 })

    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('html')) {
      return NextResponse.json({ error: 'URL must point to an HTML page' }, { status: 422 })
    }

    // Načteme max 300 KB — stačí pro <head> + CSS
    const reader = res.body!.getReader()
    const chunks: Uint8Array[] = []
    let total = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done || total > 300_000) break
      chunks.push(value)
      total += value.length
    }
    const html = new TextDecoder().decode(
      chunks.reduce((a, b) => { const c = new Uint8Array(a.length + b.length); c.set(a); c.set(b, a.length); return c }, new Uint8Array())
    )

    // Extrakce
    const metaColor = extractMetaThemeColor(html)
    const cssColors = extractCssColors(html)

    // Seřaď podle skóre, deduplikuj
    const all: string[] = []
    if (metaColor) all.push(metaColor)
    all.push(...cssColors)

    const unique = Array.from(new Set(all))
    const scored = unique
      .map(hex => ({ hex, score: colorScore(hex) }))
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)

    // Vezmi top 5 jako candidates
    const candidates = scored.slice(0, 5).map(c => c.hex)

    // Nejlepší barva = první z meta nebo první scored
    const best = metaColor && colorScore(metaColor) > 0
      ? metaColor
      : (candidates[0] ?? '#D4500A')

    return NextResponse.json({ theme_color: best, candidates })
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      return NextResponse.json({ error: 'Page took too long to respond' }, { status: 422 })
    }
    return NextResponse.json({ error: 'Failed to analyze page' }, { status: 500 })
  }
}
