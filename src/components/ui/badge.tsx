import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'rust' | 'purple'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      style={{ borderRadius: '2px' }}
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider border',
        {
          'text-muted border-paper_border bg-paper': variant === 'default',
          'text-success border-success bg-success/5': variant === 'success',
          'text-rust border-rust bg-rust/5': variant === 'rust' || variant === 'purple',
          'text-amber-700 border-amber-300 bg-amber-50': variant === 'warning',
          'text-rust_hover border-rust_hover bg-rust/5': variant === 'danger',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
