import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  className?: string
  variant?: 'horizontal' | 'icon'
  href?: string
}

export function Logo({ className, variant = 'horizontal', href = '/' }: LogoProps) {
  const src = variant === 'horizontal' ? '/logo.svg' : '/icon.svg'
  const width = variant === 'horizontal' ? 140 : 28
  const height = variant === 'horizontal' ? 28 : 28

  return (
    <Link href={href} className={className}>
      <Image src={src} alt="BotCraft" width={width} height={height} priority />
    </Link>
  )
}
