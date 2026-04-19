import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="font-mono text-[11px] uppercase tracking-wider text-ink"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          style={{ borderRadius: '2px' }}
          className={cn(
            'w-full border border-paper_border bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors resize-none',
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
Textarea.displayName = 'Textarea'
