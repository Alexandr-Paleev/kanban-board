import { cn } from '@/lib/utils'

interface AvatarProps {
  src: string
  alt: string
  size?: 'sm' | 'md'
  className?: string
}

export function Avatar({ src, alt, size = 'sm', className }: AvatarProps) {
  return (
    <img
      src={src}
      alt={alt}
      title={alt}
      className={cn(
        'rounded-full border-2 border-white object-cover',
        size === 'sm' ? 'h-6 w-6' : 'h-8 w-8',
        className,
      )}
    />
  )
}
