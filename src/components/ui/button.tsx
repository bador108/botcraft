'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={{ borderRadius: '2px' }}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-mono uppercase tracking-wider transition-colors duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-rust text-bone hover:bg-rust_hover': variant === 'primary',
            'bg-paper border border-paper_border text-ink hover:bg-paper_border': variant === 'secondary',
            'text-muted hover:text-ink border border-paper_border': variant === 'ghost',
            'bg-rust_hover text-bone hover:opacity-90': variant === 'danger',
            'px-3 py-1.5 text-[10px]': size === 'sm',
            'px-4 py-2 text-[11px]': size === 'md',
            'px-6 py-3 text-sm': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
