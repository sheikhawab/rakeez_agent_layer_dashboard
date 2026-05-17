import { useTranslation } from 'react-i18next'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CostPill } from '@/components/shared/cost-pill'

type ActiveNowCardProps = {
  activeCalls: number | undefined
  burnRatePerMin: number | undefined
  isLoading: boolean
}

export function ActiveNowCard({ activeCalls, burnRatePerMin, isLoading }: ActiveNowCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col justify-between py-5">
        <div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
          {t('overview.activeNow')}
        </div>

        {isLoading || activeCalls === undefined || burnRatePerMin === undefined ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              {activeCalls > 0 && (
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              )}
              <span className="text-3xl font-semibold tabular-nums">{activeCalls}</span>
              <span className="text-muted-foreground text-xs">
                {t('overview.inProgress')}
              </span>
            </div>
            {activeCalls > 0 ? (
              <div className="space-y-0.5">
                <div className="text-sm">
                  <CostPill usd={burnRatePerMin} variant="usd-only" /> / min
                </div>
                <div className="text-muted-foreground text-[10px]">
                  {t('overview.burnRate')}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground text-xs">
                {t('overview.allQuiet')}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
