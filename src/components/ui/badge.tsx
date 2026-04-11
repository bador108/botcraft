import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'purple'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      {
        'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300': variant === 'default',
        'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400': variant === 'success',
        'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400': variant === 'warning',
        'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400': variant === 'danger',
        'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400': variant === 'purple',
      },
      className
    )}>
      {children}
    </span>
  )
}
