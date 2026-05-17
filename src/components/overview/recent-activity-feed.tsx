import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { CompanyBadge } from '@/components/shared/company-badge'
import { CostPill } from '@/components/shared/cost-pill'
import { Duration } from '@/components/shared/duration'
import { LanguageBadge } from '@/components/shared/language-badge'
import { RelativeTime } from '@/components/shared/relative-time'
import { mockCallers } from '@/mocks/callers'
import type { Call } from '@/types/call'
import { cn } from '@/lib/utils'

type RecentActivityFeedProps = {
  calls: Call[] | undefined
  isLoading: boolean
  /** Show [Company] badge per row (aggregate mode only) */
  showCompanyBadge: boolean
  limit?: number
}

export function RecentActivityFeed({
  calls,
  isLoading,
  showCompanyBadge,
  limit = 6,
}: RecentActivityFeedProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const rows = calls?.slice(0, limit)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium">
          {t('overview.recentActivity')}
        </CardTitle>
        <Button variant="ghost" size="sm" asChild className="-mr-2 h-7 text-xs">
          <Link to="/calls">{t('actions.viewAll')} →</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-1.5 pb-3">
        {isLoading || !rows ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </>
        ) : rows.length === 0 ? (
          <div className="text-muted-foreground py-4 text-center text-xs">
            {t('common.noData')}
          </div>
        ) : (
          rows.map((call) => {
            const caller = mockCallers.find((c) => c.id === call.callerId)
            const callerName = caller?.name ?? 'Unknown'
            const isLive = call.status === 'in-progress'
            return (
              <Link
                key={call.id}
                to={`/calls/${call.id}`}
                className="hover:bg-muted/50 -mx-2 flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors"
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 shrink-0 rounded-full',
                    isLive ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/40',
                  )}
                />
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <bdi className="truncate text-sm font-medium">{callerName}</bdi>
                  {showCompanyBadge && <CompanyBadge companyId={call.companyId} />}
                  <LanguageBadge language={call.language} />
                  <Duration seconds={call.durationSec} className="text-muted-foreground text-xs" />
                </div>
                <div className="flex items-center gap-3 text-xs">
                  {call.bookingId ? (
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {isArabic ? 'حُجز' : 'Booked'}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                  <CostPill
                    usd={call.cost.total}
                    variant="usd-only"
                    className="text-muted-foreground"
                  />
                  <RelativeTime iso={call.startedAt} className="text-xs hidden sm:inline" />
                </div>
              </Link>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
