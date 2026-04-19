import { cn } from '@/lib/utils'

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      style={{ borderRadius: '2px' }}
      className={cn('bg-paper border border-paper_border', className)}
    >
      {children}
    </div>
  )
}
