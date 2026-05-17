import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkline } from '@/components/shared/sparkline'
import { cn } from '@/lib/utils'

type TrendMiniCardProps = {
  label: string
  value: ReactNode
  /** Delta % vs previous period; null = no comparison */
  deltaPct?: number | null
  /** When delta is positive, is that GOOD or BAD? (e.g. "cost up" is bad) */
  positiveIsBad?: boolean
  trend: number[]
  isLoading?: boolean
}

export function TrendMiniCard({
  label,
  value,
  deltaPct = null,
  positiveIsBad = false,
  trend,
  isLoading,
}: TrendMiniCardProps) {
  const isGoodDelta =
    deltaPct === null
      ? null
      : positiveIsBad
        ? deltaPct < 0
        : deltaPct >= 0

  return (
    <Card>
      <CardContent className="space-y-2 py-4">
        <div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
          {label}
        </div>
        <div className="flex items-end justify-between gap-2">
          <div className="text-2xl font-semibold tabular-nums leading-none">
            {isLoading ? <Skeleton className="h-7 w-16" /> : value}
          </div>
          {deltaPct !== null && !isLoading && (
            <DeltaPill pct={deltaPct} isGood={isGoodDelta} />
          )}
        </div>
        <Sparkline
          data={trend}
          tone={isGoodDelta === false ? 'negative' : 'positive'}
          height={28}
        />
      </CardContent>
    </Card>
  )
}

function DeltaPill({ pct, isGood }: { pct: number; isGood: boolean | null }) {
  const Icon = pct === 0 ? Minus : pct > 0 ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-xs font-medium tabular-nums',
        isGood === true && 'text-emerald-600 dark:text-emerald-400',
        isGood === false && 'text-red-600 dark:text-red-400',
        isGood === null && 'text-muted-foreground',
      )}
    >
      <Icon className="h-3 w-3" />
      {Math.abs(pct).toFixed(0)}%
    </span>
  )
}
