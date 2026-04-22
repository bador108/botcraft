import type { ReactNode } from 'react'

export interface BotAvatarPreset {
  id: string
  svg: ReactNode
}

export const PRESET_AVATARS: BotAvatarPreset[] = [
  {
    id: 'bot-classic',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#F0EBE3"/>
        <rect x="10" y="14" width="20" height="16" rx="4" fill="#1A1814"/>
        <circle cx="15" cy="21" r="2.5" fill="#F5F1EA"/>
        <circle cx="25" cy="21" r="2.5" fill="#F5F1EA"/>
        <rect x="16" y="26" width="8" height="1.5" rx="0.75" fill="#F5F1EA"/>
        <rect x="19" y="9" width="2" height="5" rx="1" fill="#1A1814"/>
        <circle cx="20" cy="8" r="2" fill="#D4500A"/>
      </svg>
    ),
  },
  {
    id: 'bot-round',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#1A1814"/>
        <circle cx="14" cy="19" r="3" fill="white"/>
        <circle cx="26" cy="19" r="3" fill="white"/>
        <circle cx="15" cy="18" r="1.2" fill="#1A1814"/>
        <circle cx="27" cy="18" r="1.2" fill="#1A1814"/>
        <path d="M14 25 Q20 29 26 25" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <rect x="18" y="6" width="4" height="5" rx="1.5" fill="white"/>
        <circle cx="20" cy="5" r="2" fill="#D4500A"/>
      </svg>
    ),
  },
  {
    id: 'bot-chip',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#D4500A"/>
        <rect x="11" y="11" width="18" height="18" rx="3" fill="white"/>
        <rect x="14" y="14" width="5" height="5" rx="1" fill="#D4500A"/>
        <rect x="21" y="14" width="5" height="5" rx="1" fill="#D4500A"/>
        <rect x="14" y="21" width="12" height="2" rx="1" fill="#D4500A"/>
        <rect x="8" y="15" width="3" height="2" rx="1" fill="white"/>
        <rect x="8" y="19" width="3" height="2" rx="1" fill="white"/>
        <rect x="8" y="23" width="3" height="2" rx="1" fill="white"/>
        <rect x="29" y="15" width="3" height="2" rx="1" fill="white"/>
        <rect x="29" y="19" width="3" height="2" rx="1" fill="white"/>
        <rect x="29" y="23" width="3" height="2" rx="1" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'bot-bubble',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="20" fill="#2563EB"/>
        <path d="M10 16 Q10 11 15 11 H27 Q32 11 32 16 V23 Q32 28 27 28 H21 L15 33 V28 Q10 28 10 23 Z" fill="white"/>
        <circle cx="16" cy="20" r="2" fill="#2563EB"/>
        <circle cx="21" cy="20" r="2" fill="#2563EB"/>
        <circle cx="26" cy="20" r="2" fill="#2563EB"/>
      </svg>
    ),
  },
  {
    id: 'bot-star',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#059669"/>
        <path d="M20 8 L22.9 16.1 H31.6 L24.8 21.2 L27.6 29.4 L20 24.3 L12.4 29.4 L15.2 21.2 L8.4 16.1 H17.1 Z" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'bot-zap',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="20" fill="#F59E0B"/>
        <path d="M23 8 L14 22 H20 L17 32 L28 17 H22 Z" fill="white" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'bot-eye',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#1A1814"/>
        <ellipse cx="20" cy="20" rx="13" ry="8" stroke="#D4500A" strokeWidth="2" fill="none"/>
        <circle cx="20" cy="20" r="5" fill="#D4500A"/>
        <circle cx="20" cy="20" r="2.5" fill="#1A1814"/>
        <circle cx="21.5" cy="18.5" r="1" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'bot-minimal',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#F0EBE3"/>
        <circle cx="14" cy="19" r="3" fill="#1A1814"/>
        <circle cx="26" cy="19" r="3" fill="#1A1814"/>
        <path d="M15 26 Q20 30 25 26" stroke="#1A1814" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
]

export function getPresetAvatar(id: string): BotAvatarPreset | undefined {
  return PRESET_AVATARS.find(p => p.id === id)
}

export function isImageUrl(avatar: string) {
  return avatar.startsWith('http') || avatar.startsWith('data:') || avatar.startsWith('/')
}

export function isPresetId(avatar: string) {
  return PRESET_AVATARS.some(p => p.id === avatar)
}
