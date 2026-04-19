import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="font-mono text-[11px] uppercase tracking-wider text-ink"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          style={{ borderRadius: '2px' }}
          className={cn(
            'w-full border border-paper_border bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors',
            error && 'border-rust_hover',
            className
          )}
          {...props}
        />
        {error && (
          <p className="font-mono text-[11px] text-rust_hover">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
