export default function BillingLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-32 bg-paper_border rounded-lg mb-2" />
      <div className="h-4 w-60 bg-paper_border rounded mb-8" />
      <div className="grid md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-56 bg-white rounded-xl border border-paper_border" />
        ))}
      </div>
    </div>
  )
}
