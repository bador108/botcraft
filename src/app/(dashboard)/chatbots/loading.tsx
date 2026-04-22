export default function ChatbotsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-36 bg-paper_border rounded-lg mb-2" />
      <div className="h-4 w-64 bg-paper_border rounded mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-white rounded-xl border border-paper_border" />
        ))}
      </div>
    </div>
  )
}
