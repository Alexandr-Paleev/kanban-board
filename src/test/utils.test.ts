import { cn, formatDate } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('resolves Tailwind conflicts — last wins', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('ignores falsy values', () => {
    const falsy = false
    expect(cn('a', falsy && 'b', null, undefined)).toBe('a')
  })
})

describe('formatDate', () => {
  it('formats an ISO date to Mon DD', () => {
    expect(formatDate('2026-06-28T00:00:00Z')).toMatch(/Jun 2[78]/)
  })
})
