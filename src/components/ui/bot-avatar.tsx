'use client'

import Image from 'next/image'
import { getPresetAvatar, isImageUrl } from '@/lib/bot-avatars'

interface BotAvatarProps {
  avatar: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = {
  xs: { container: 'h-6 w-6', svgSize: 20, imgSize: 24, text: 'text-base' },
  sm: { container: 'h-8 w-8', svgSize: 26, imgSize: 32, text: 'text-xl' },
  md: { container: 'h-10 w-10', svgSize: 32, imgSize: 40, text: 'text-2xl' },
  lg: { container: 'h-14 w-14', svgSize: 44, imgSize: 56, text: 'text-3xl' },
}

export function BotAvatar({ avatar, size = 'md', className = '' }: BotAvatarProps) {
  const { container, svgSize, imgSize, text } = SIZES[size]
  const preset = getPresetAvatar(avatar)

  if (preset) {
    return (
      <div className={`${container} flex items-center justify-center shrink-0 ${className}`}>
        <div style={{ width: svgSize, height: svgSize }}>
          {preset.svg}
        </div>
      </div>
    )
  }

  if (isImageUrl(avatar)) {
    return (
      <div className={`${container} rounded-lg overflow-hidden shrink-0 ${className}`}
        style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
        <Image
          src={avatar}
          alt="Bot avatar"
          width={imgSize}
          height={imgSize}
          className="object-cover w-full h-full"
          unoptimized={avatar.startsWith('data:')}
        />
      </div>
    )
  }

  return (
    <span className={`${container} ${text} flex items-center justify-center shrink-0 ${className}`}>
      {avatar}
    </span>
  )
}
