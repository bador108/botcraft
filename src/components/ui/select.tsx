import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, id, children, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={selectId}
            className="font-mono text-[11px] uppercase tracking-wider text-ink"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          style={{ borderRadius: '2px' }}
          className={cn(
            'w-full border border-paper_border bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink transition-colors',
            className
          )}
          {...props}
        >
          {children}
        </select>
      </div>
    )
  }
)
Select.displayName = 'Select'
