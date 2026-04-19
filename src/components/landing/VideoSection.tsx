export function VideoSection() {
  return (
    <section id="video" className="border-t border-paper_border py-20 md:py-28">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <h2
          className="font-mono font-medium text-ink mb-8"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
        >
          Podívej se, jak to funguje
        </h2>

        {/* Video or placeholder */}
        <div className="border border-paper_border overflow-hidden" style={{ borderRadius: '2px' }}>
          {/* TODO: Nahraď skutečným /demo.mp4 screencastem */}
          {/* <video
            src="/demo.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full block"
          /> */}
          <div className="bg-paper aspect-video flex items-center justify-center">
            <span className="text-muted font-mono text-sm">[30s screencast placeholder]</span>
          </div>
        </div>

        <p className="text-muted text-sm mt-4">
          Od uploadu dokumentu po embed kód. Reálný záznam, žádné střihy.
        </p>
      </div>
    </section>
  )
}
