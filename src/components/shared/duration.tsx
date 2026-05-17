import { formatDuration } from '@/lib/format'
import { cn } from '@/lib/utils'

export function Duration({
  seconds,
  className,
}: {
  seconds: number
  className?: string
}) {
  return (
    <span className={cn('tabular-nums', className)}>{formatDuration(seconds)}</span>
  )
}
