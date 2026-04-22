export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-bone">
      <div className="hidden md:flex w-60 border-r border-paper_border bg-white shrink-0" />
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
        <div className="max-w-5xl mx-auto px-5 py-8 md:px-8 md:py-10 animate-pulse">
          <div className="h-7 w-48 bg-paper_border rounded-lg mb-2" />
          <div className="h-4 w-72 bg-paper_border rounded mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-xl border border-paper_border" />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
