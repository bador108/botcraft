import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  className?: string
  variant?: 'horizontal' | 'icon'
  size?: number
  /** Pass a string to override the link target, or false to render without a link */
  linkTo?: string | false
}

export function Logo({ className, variant = 'horizontal', size, linkTo = '/' }: LogoProps) {
  const src = variant === 'horizontal' ? '/logo.svg' : '/icon.svg'
  const defaultW = variant === 'horizontal' ? 130 : 24
  const defaultH = variant === 'horizontal' ? 30 : 24
  const w = size ?? defaultW
  const h = size ?? defaultH

  const img = <Image src={src} alt="BotCraft" width={w} height={h} priority />

  if (linkTo === false) {
    return <span className={className}>{img}</span>
  }

  return (
    <Link href={linkTo} className={className}>
      {img}
    </Link>
  )
}
