export default function SettingsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-36 bg-paper_border rounded-lg mb-8" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-white rounded-xl border border-paper_border" />
        ))}
      </div>
    </div>
  )
}
