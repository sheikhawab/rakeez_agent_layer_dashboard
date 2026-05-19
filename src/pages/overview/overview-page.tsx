import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CostByCompanyChart } from '@/components/charts/cost-by-company-chart'
import { CostTrendChart } from '@/components/charts/cost-trend-chart'
import { LanguageSplitChart } from '@/components/charts/language-split-chart'
import { ActiveNowCard } from '@/components/overview/active-now-card'
import { ConversionCard } from '@/components/overview/conversion-card'
import { PulseHero } from '@/components/overview/pulse-hero'
import { RecentActivityFeed } from '@/components/overview/recent-activity-feed'
import { TopCompaniesCard } from '@/components/overview/top-companies-card'
import { TrendMiniCard } from '@/components/overview/trend-mini-card'
import { CostPill } from '@/components/shared/cost-pill'
import { Duration } from '@/components/shared/duration'
import { PageHeader } from '@/components/shared/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { useCalls } from '@/hooks/use-calls'
import { useOverviewStats } from '@/hooks/use-costs'
import { useUsage } from '@/hooks/use-costs'
import { useCompanies } from '@/hooks/use-companies'
import { useSelectedCompany } from '@/store/selected-company'

/**
 * Compute 24 hourly buckets of call counts from the current calls list.
 */
function buildActivityTrend(calls: { startedAt: string }[]): number[] {
  const buckets = new Array<number>(24).fill(0)
  const now = Date.now()
  const dayAgo = now - 24 * 60 * 60 * 1000
  for (const c of calls) {
    const t = new Date(c.startedAt).getTime()
    if (t < dayAgo || t > now) continue
    const idx = Math.floor((t - dayAgo) / (60 * 60 * 1000))
    if (idx >= 0 && idx < 24) buckets[idx]++
  }
  return buckets
}

export function OverviewPage() {
  const { t } = useTranslation()
  const { selectedCompanyId } = useSelectedCompany()
  const isAggregate = selectedCompanyId === 'all'

  const { data: companies = [] } = useCompanies()
  const { data: stats, isLoading: statsLoading } = useOverviewStats()
  const { data: calls, isLoading: callsLoading } = useCalls()
  const { data: usage, isLoading: usageLoading } = useUsage()

  const activityTrend = useMemo(
    () => (calls ? buildActivityTrend(calls) : new Array<number>(24).fill(0)),
    [calls],
  )

  // Top companies aggregate (only used in aggregate view)
  const topCompaniesData = useMemo(() => {
    if (!isAggregate || !calls) return undefined
    const byCompany = new Map<string, { calls: number; cost: number }>()
    for (const c of calls) {
      if (c.status === 'in-progress') continue
      const existing = byCompany.get(c.companyId) ?? { calls: 0, cost: 0 }
      existing.calls += 1
      existing.cost += c.cost.total
      byCompany.set(c.companyId, existing)
    }
    return [...byCompany.entries()].map(([companyId, agg]) => ({
      companyId,
      ...agg,
    }))
  }, [isAggregate, calls])

  // Mini-card trend series (last 7 days of avg duration and cost-per-booking)
  const miniTrends = useMemo(() => {
    if (!calls) return { duration: [], costPerBooking: [] }
    const buckets: Record<string, { dur: number; n: number; cost: number; bookings: number }> = {}
    for (const c of calls) {
      if (c.status === 'in-progress') continue
      const day = c.startedAt.slice(0, 10)
      const b = buckets[day] ?? { dur: 0, n: 0, cost: 0, bookings: 0 }
      b.dur += c.durationSec
      b.n += 1
      b.cost += c.cost.total
      if (c.bookingId) b.bookings += 1
      buckets[day] = b
    }
    const sortedDays = Object.keys(buckets).sort().slice(-7)
    return {
      duration: sortedDays.map((d) => buckets[d].dur / Math.max(1, buckets[d].n)),
      costPerBooking: sortedDays.map(
        (d) => buckets[d].cost / Math.max(1, buckets[d].bookings),
      ),
    }
  }, [calls])

  const scopeName = isAggregate
    ? t('companies.all')
    : (() => {
        const c = companies.find((x) => x.id === selectedCompanyId)
        return c ? c.business_name : selectedCompanyId
      })()

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title={
          <>
            {t('nav.overview')}{' '}
            <span className="text-muted-foreground">·</span>{' '}
            <bdi>{scopeName}</bdi>
          </>
        }
      />

      {/* Row 1: Pulse hero (large) + Active Now + Conversion */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PulseHero
            stats={stats}
            isLoading={statsLoading}
            activityTrend={activityTrend}
            isAggregate={isAggregate}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <ActiveNowCard
            activeCalls={stats?.activeCalls}
            burnRatePerMin={stats?.burnRatePerMin}
            isLoading={statsLoading}
          />
          <ConversionCard
            calls={stats?.totalCalls}
            bookings={stats?.totalBookings}
            isLoading={statsLoading}
          />
        </div>
      </div>

      {/* Row 2: Two mini trend cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TrendMiniCard
          label={t('overview.avgDuration')}
          value={
            stats ? <Duration seconds={stats.avgDurationSec} /> : null
          }
          trend={miniTrends.duration}
          isLoading={statsLoading || callsLoading}
        />
        <TrendMiniCard
          label={t('overview.costPerBooking')}
          value={stats ? <CostPill usd={stats.costPerBooking} variant="usd-only" /> : null}
          trend={miniTrends.costPerBooking}
          positiveIsBad
          isLoading={statsLoading || callsLoading}
        />
      </div>

      {/* Row 3: Cost trend (wide) + Language split */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('overview.costTrend')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usageLoading || !usage ? (
              <Skeleton className="h-[260px] w-full" />
            ) : (
              <CostTrendChart usage={usage} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('overview.languageSplit')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading || !stats ? (
              <Skeleton className="mx-auto h-[140px] w-[140px] rounded-full" />
            ) : (
              <LanguageSplitChart data={stats.languageSplit} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 4 (aggregate only): Top companies + Cost by company */}
      {isAggregate && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TopCompaniesCard data={topCompaniesData} isLoading={callsLoading} />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {t('overview.costByCompany')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usageLoading || !usage ? (
                <Skeleton className="h-[220px] w-full" />
              ) : (
                <CostByCompanyChart usage={usage} />
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Row 5: Recent Activity */}
      <RecentActivityFeed
        calls={calls}
        isLoading={callsLoading}
        showCompanyBadge={isAggregate}
      />
    </div>
  )
}
