const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://botcraft.app'

export function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BotCraft</title>
</head>
<body style="margin:0;padding:0;background:#F2F2EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F2EF;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <!-- Logo -->
          <tr>
            <td style="padding:0 0 24px 0;">
              <a href="${appUrl}" style="text-decoration:none;font-size:15px;font-weight:700;color:#0A0A0A;letter-spacing:-0.02em;">
                BOTCRAFT
              </a>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background:#FFFFFF;border-radius:12px;padding:32px 36px;border:1px solid rgba(0,0,0,0.08);">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 0 0 0;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:12px;color:#A8A8A8;">
                Dostal/a jsi tento email, protože máš účet v BotCraftu.
              </p>
              <p style="margin:0;font-size:12px;color:#A8A8A8;">
                <a href="${appUrl}/settings/notifications" style="color:#A8A8A8;">Upravit notifikace</a>
                &nbsp;·&nbsp;
                <a href="${appUrl}" style="color:#A8A8A8;">BotCraft</a>
              </p>
            </td>
          </tr>
          <!-- Copyright -->
          <tr>
            <td style="padding:16px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:11px;color:#A8A8A8;">© ${new Date().getFullYear()} BotCraft</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
