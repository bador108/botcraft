import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  className?: string
  variant?: 'horizontal' | 'icon'
  /** Pass a string to override the link target, or false to render without a link */
  linkTo?: string | false
}

export function Logo({ className, variant = 'horizontal', linkTo = '/' }: LogoProps) {
  const src = variant === 'horizontal' ? '/logo.svg' : '/icon.svg'
  const width = variant === 'horizontal' ? 140 : 28
  const height = variant === 'horizontal' ? 28 : 28

  const img = <Image src={src} alt="BotCraft" width={width} height={height} priority />

  if (linkTo === false) {
    return <span className={className}>{img}</span>
  }

  return (
    <Link href={linkTo} className={className}>
      {img}
    </Link>
  )
}
