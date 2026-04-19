// Clerk v7 — global appearance config
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clerkAppearance: any = {
  layout: {
    logoImageUrl: '/logo.svg',
    logoLinkUrl: '/',
    logoPlacement: 'inside',
    showOptionalFields: true,
    socialButtonsPlacement: 'bottom',
    socialButtonsVariant: 'blockButton',
  },
  variables: {
    colorPrimary: '#D4502A',
    colorBackground: '#F5F1EA',
    colorInputBackground: '#EDE7DC',
    colorInputText: '#1A1814',
    colorText: '#1A1814',
    colorTextSecondary: '#6B6359',
    colorDanger: '#B8421F',
    borderRadius: '2px',
    fontFamily: 'Inter, sans-serif',
  },
  elements: {
    rootBox: 'w-full',
    card: 'bg-bone border border-paper_border shadow-none !rounded-sm',
    headerTitle: '!font-mono uppercase tracking-tight text-ink text-xl',
    headerSubtitle: 'text-muted text-sm',
    formButtonPrimary:
      '!bg-rust hover:!bg-rust_hover !rounded-sm normal-case !font-mono tracking-wide text-sm transition-colors',
    formFieldInput:
      '!bg-paper !border-paper_border !rounded-sm focus:!border-rust focus:!ring-0 text-ink',
    formFieldLabel: 'text-ink font-medium text-sm',
    footerActionLink: 'text-rust hover:text-rust_hover underline-offset-2',
    socialButtonsBlockButton:
      '!bg-paper !border-paper_border !rounded-sm hover:!bg-paper_border text-ink',
    dividerLine: '!bg-paper_border',
    dividerText: 'text-muted !font-mono text-xs uppercase tracking-wider',
    identityPreviewEditButton: 'text-rust',
    otpCodeFieldInput: '!bg-paper !border-paper_border !rounded-sm',
  },
}
