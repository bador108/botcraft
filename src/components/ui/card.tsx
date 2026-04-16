import { cn } from '@/lib/utils'

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-[#0E0E12] rounded-xl border border-white/[0.07]', className)}>
      {children}
    </div>
  )
}
