export default function AnalyticsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-40 bg-paper_border rounded-lg mb-2" />
      <div className="h-4 w-56 bg-paper_border rounded mb-8" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-white rounded-xl border border-paper_border" />
        ))}
      </div>
      <div className="h-64 bg-white rounded-xl border border-paper_border" />
    </div>
  )
}
