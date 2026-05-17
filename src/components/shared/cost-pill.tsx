import { formatCost } from '@/lib/format'
import { cn } from '@/lib/utils'

type CostPillProps = {
  usd: number
  /** "inline" shows compact "$x / y SAR", "stacked" shows USD on top, SAR below */
  variant?: 'inline' | 'stacked' | 'usd-only'
  className?: string
}

export function CostPill({ usd, variant = 'inline', className }: CostPillProps) {
  const { usd: usdStr, sar, combined } = formatCost(usd)

  if (variant === 'usd-only') {
    return <span className={cn('tabular-nums', className)}>{usdStr}</span>
  }

  if (variant === 'stacked') {
    return (
      <div className={cn('flex flex-col leading-tight tabular-nums', className)}>
        <span className="font-medium">{usdStr}</span>
        <span className="text-muted-foreground text-[10px]">{sar}</span>
      </div>
    )
  }

  return (
    <span className={cn('tabular-nums', className)}>{combined}</span>
  )
}
