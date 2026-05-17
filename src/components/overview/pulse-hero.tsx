import { useTranslation } from 'react-i18next'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CostPill } from '@/components/shared/cost-pill'
import { Sparkline } from '@/components/shared/sparkline'
import type { OverviewStats } from '@/data/client'
import { cn } from '@/lib/utils'

type PulseHeroProps = {
  stats: OverviewStats | undefined
  isLoading: boolean
  /** Last 24h activity values (call counts per hour bucket) */
  activityTrend: number[]
  isAggregate: boolean
}

export function PulseHero({ stats, isLoading, activityTrend, isAggregate }: PulseHeroProps) {
  const { t } = useTranslation()

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="space-y-30 py-5">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
            {t('overview.todaysPulse')}
          </span>
          {stats && stats.activeCalls > 0 && (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              {t('overview.live')}
            </span>
          )}
        </div>

        <div
          className={cn(
            'grid gap-6',
            isAggregate ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3',
          )}
        >
          
          <Metric
            label={t('nav.calls')}
            value={isLoading || !stats ? null : stats.totalCalls.toString()}
          />
          <Metric
            label={t('nav.bookings')}
            value={isLoading || !stats ? null : stats.totalBookings.toString()}
          />
          <Metric
            label={t('overview.spent')}
            value={
              isLoading || !stats ? null : (
                <CostPill usd={stats.totalCostUsd} variant="stacked" />
              )
            }
          />
          {isAggregate && (
            <Metric
              label={t('overview.companies')}
              value={isLoading || !stats ? null : stats.companiesCount.toString()}
            />
          )}
        </div>

        <div>
          <Sparkline data={activityTrend} tone="positive" height={44} />
          <div className="text-muted-foreground mt-1 text-[10px]">
            {t('overview.last24h')}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Metric({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
        {label}
      </div>
      <div className="text-2xl font-semibold tabular-nums leading-none">
        {value ?? <Skeleton className="h-7 w-16" />}
      </div>
    </div>
  )
}
