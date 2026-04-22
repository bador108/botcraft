export default function DocumentsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-40 bg-paper_border rounded-lg mb-2" />
      <div className="h-4 w-64 bg-paper_border rounded mb-8" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-white rounded-xl border border-paper_border" />
        ))}
      </div>
    </div>
  )
}
