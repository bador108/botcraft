import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

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

function colorScore(hex: string): number {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return 0
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const lightness = (max + min) / 2 / 255
  const saturation = max === min ? 0 : (max - min) / (255 - Math.abs(2 * (max + min) / 2 - 255))
  if (lightness > 0.92 || lightness < 0.08) return 0
  if (saturation < 0.2) return 0
  return saturation * (1 - Math.abs(lightness - 0.45))
}

function extractColors(html: string): { meta: string | null; css: string[] } {
  // meta theme-color
  const metaMatch = html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']theme-color["']/i)
  const meta = metaMatch ? toHex(metaMatch[1]) : null

  const css: string[] = []

  // CSS proměnné brand barev — nové instance regexu každý request
  const brandPattern = /--(?:primary|accent|brand|main|theme|color-primary|color-accent|color-brand|clr-primary|clr-accent)\s*:\s*([^;}\n]{3,30})/g
  let m: RegExpExecArray | null
  while ((m = brandPattern.exec(html)) !== null) {
    const hex = toHex(m[1])
    if (hex) css.push(hex)
  }

  // Hex barvy ze <style> bloků
  const stylePattern = /<style[^>]*>([\s\S]*?)<\/style>/gi
  let styleMatch: RegExpExecArray | null
  while ((styleMatch = stylePattern.exec(html)) !== null) {
    const hexes = styleMatch[1].match(/#[0-9a-f]{6}\b/gi) ?? []
    css.push(...hexes.map((h: string) => h.toLowerCase()))
  }

  return { meta, css }
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { url?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const url = body.url?.trim()
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })

  let parsed: URL
  try {
    parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error()
    if (['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(parsed.hostname)) {
      return NextResponse.json({ error: 'Local URLs not allowed' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    let res: Response
    try {
      res = await fetch(parsed.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BotCraft/1.0)',
          Accept: 'text/html',
        },
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }

    if (!res.ok) {
      return NextResponse.json({ error: `Stránka vrátila ${res.status}` }, { status: 422 })
    }

    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('html') && !contentType.includes('text')) {
      return NextResponse.json({ error: 'URL musí být HTML stránka' }, { status: 422 })
    }

    // Max 400 KB
    const raw = await res.text()
    const html = raw.slice(0, 400_000)

    const { meta, css } = extractColors(html)

    const all: string[] = []
    if (meta) all.push(meta)
    all.push(...css)

    const unique = Array.from(new Set(all))
    const scored = unique
      .map(hex => ({ hex, score: colorScore(hex) }))
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)

    const candidates = scored.slice(0, 5).map(c => c.hex)
    const best = (meta && colorScore(meta) > 0) ? meta : (candidates[0] ?? '#D4500A')

    return NextResponse.json({ theme_color: best, candidates })
  } catch (err) {
    const isAbort = err instanceof Error && (err.name === 'AbortError' || err.name === 'TimeoutError')
    if (isAbort) {
      return NextResponse.json({ error: 'Stránka neodpověděla včas' }, { status: 422 })
    }
    console.error('analyze-style error:', err)
    return NextResponse.json({ error: 'Nepodařilo se načíst stránku' }, { status: 500 })
  }
}
