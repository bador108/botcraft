import { emailLayout } from './layout'

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://botcraft.app'

export function limitReachedHtml(params: {
  email: string
  plan: string
  limit: number
  percent: 80 | 100
  upgradeUrl: string
}): string {
  const isHit = params.percent === 100
  return emailLayout(`
    <h2 style="margin:0 0 12px 0;font-size:20px;font-weight:700;color:#0A0A0A;letter-spacing:-0.02em;">
      ${isHit ? 'Dosáhl jsi měsíčního limitu' : 'Blížíš se měsíčnímu limitu'}
    </h2>
    <p style="margin:0 0 20px 0;color:#6B6B6B;line-height:1.7;font-size:15px;">
      ${isHit
        ? `Tvůj chatbot právě vyčerpal měsíční limit <strong style="color:#0A0A0A;">${params.limit.toLocaleString('cs-CZ')} zpráv</strong>. Nové zprávy budou odmítány až do 1. dne příštího měsíce.`
        : `Tvůj chatbot využil <strong style="color:#0A0A0A;">${params.percent}%</strong> měsíčního limitu <strong style="color:#0A0A0A;">${params.limit.toLocaleString('cs-CZ')} zpráv</strong>.`
      }
    </p>
    <a href="${params.upgradeUrl}" style="display:inline-block;background:#D4500A;color:#FAFAF8;padding:11px 22px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
      Upgrade plánu →
    </a>
  `)
}

export function weeklyHtml(params: {
  totalMessages: number
  uniqueSessions: number
  topBot: string
  period: string
}): string {
  return emailLayout(`
    <h2 style="margin:0 0 6px 0;font-size:20px;font-weight:700;color:#0A0A0A;letter-spacing:-0.02em;">
      Týdenní přehled
    </h2>
    <p style="margin:0 0 20px 0;color:#A8A8A8;font-size:13px;">${params.period}</p>
    <table style="border-collapse:collapse;width:100%;margin:0 0 24px 0;">
      <tr style="border-bottom:1px solid #F2F2EF;">
        <td style="padding:10px 0;color:#6B6B6B;font-size:14px;">Celkem zpráv</td>
        <td style="padding:10px 0;font-weight:600;text-align:right;color:#0A0A0A;">${params.totalMessages.toLocaleString('cs-CZ')}</td>
      </tr>
      <tr style="border-bottom:1px solid #F2F2EF;">
        <td style="padding:10px 0;color:#6B6B6B;font-size:14px;">Unikátní uživatelé</td>
        <td style="padding:10px 0;font-weight:600;text-align:right;color:#0A0A0A;">${params.uniqueSessions.toLocaleString('cs-CZ')}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#6B6B6B;font-size:14px;">Nejaktivnější bot</td>
        <td style="padding:10px 0;font-weight:600;text-align:right;color:#0A0A0A;">${params.topBot || '—'}</td>
      </tr>
    </table>
    <a href="${appUrl}/analytics" style="display:inline-block;background:#0A0A0A;color:#FAFAF8;padding:11px 22px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
      Zobrazit analytiku →
    </a>
  `)
}

export function failedPaymentHtml(params: { invoiceUrl: string }): string {
  return emailLayout(`
    <h2 style="margin:0 0 12px 0;font-size:20px;font-weight:700;color:#0A0A0A;letter-spacing:-0.02em;">
      Platba se nezdařila
    </h2>
    <p style="margin:0 0 20px 0;color:#6B6B6B;line-height:1.7;font-size:15px;">
      Nepodařilo se nám strhnout platbu za tvůj BotCraft plán. Tvůj přístup k prémiovým funkcím bude omezen, pokud platbu neprovedeme do 3 dnů.
    </p>
    <a href="${params.invoiceUrl}" style="display:inline-block;background:#D4500A;color:#FAFAF8;padding:11px 22px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
      Zaplatit fakturu →
    </a>
  `)
}
