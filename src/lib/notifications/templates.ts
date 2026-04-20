export function limitReachedHtml(params: {
  email: string
  plan: string
  limit: number
  percent: 80 | 100
  upgradeUrl: string
}): string {
  const isHit = params.percent === 100
  return `
<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0A0A0A">
<h2 style="font-size:20px;font-weight:700;margin-bottom:8px">
  ${isHit ? 'Dosáhl jsi měsíčního limitu' : 'Blížíš se měsíčnímu limitu'} 📊
</h2>
<p style="color:#6B6B6B;line-height:1.6">
  ${isHit
    ? `Tvůj chatbot právě vyčerpal měsíční limit <strong>${params.limit.toLocaleString('cs-CZ')} zpráv</strong>. Nové zprávy budou odmítány až do 1. dne příštího měsíce.`
    : `Tvůj chatbot využil <strong>${params.percent}%</strong> měsíčního limitu <strong>${params.limit.toLocaleString('cs-CZ')} zpráv</strong>.`
  }
</p>
<a href="${params.upgradeUrl}" style="display:inline-block;margin-top:16px;background:#D4500A;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600">
  Upgrade plánu
</a>
<p style="color:#A8A8A8;font-size:12px;margin-top:24px">BotCraft · Tuto zprávu dostáváš protože jsi majitel chatbota</p>
</body></html>`
}

export function weeklyHtml(params: {
  totalMessages: number
  uniqueSessions: number
  topBot: string
  period: string
}): string {
  return `
<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0A0A0A">
<h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Týdenní přehled 📈</h2>
<p style="color:#6B6B6B">Období: ${params.period}</p>
<table style="border-collapse:collapse;width:100%;margin:16px 0">
  <tr style="border-bottom:1px solid #F2F2EF">
    <td style="padding:8px 0;color:#6B6B6B">Celkem zpráv</td>
    <td style="padding:8px 0;font-weight:600;text-align:right">${params.totalMessages.toLocaleString('cs-CZ')}</td>
  </tr>
  <tr style="border-bottom:1px solid #F2F2EF">
    <td style="padding:8px 0;color:#6B6B6B">Unikátní uživatelé</td>
    <td style="padding:8px 0;font-weight:600;text-align:right">${params.uniqueSessions.toLocaleString('cs-CZ')}</td>
  </tr>
  <tr>
    <td style="padding:8px 0;color:#6B6B6B">Nejaktivnější bot</td>
    <td style="padding:8px 0;font-weight:600;text-align:right">${params.topBot || '—'}</td>
  </tr>
</table>
<a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://botcraft.app'}/analytics" style="display:inline-block;margin-top:8px;background:#0A0A0A;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600">
  Zobrazit analytiku
</a>
<p style="color:#A8A8A8;font-size:12px;margin-top:24px">BotCraft · Odhlásit ze souhrnů v nastavení</p>
</body></html>`
}

export function failedPaymentHtml(params: { invoiceUrl: string }): string {
  return `
<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0A0A0A">
<h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Platba se nezdařila ⚠️</h2>
<p style="color:#6B6B6B;line-height:1.6">
  Nepodařilo se nám strhnout platbu za tvůj BotCraft plán. Tvůj přístup k prémiovým funkcím bude omezen, pokud platbu neprovedeme do 3 dnů.
</p>
<a href="${params.invoiceUrl}" style="display:inline-block;margin-top:16px;background:#D4500A;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600">
  Zaplatit fakturu
</a>
<p style="color:#A8A8A8;font-size:12px;margin-top:24px">BotCraft</p>
</body></html>`
}
