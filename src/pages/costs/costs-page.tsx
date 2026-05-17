import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DateRange } from 'react-day-picker'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CostByCompanyChart } from '@/components/charts/cost-by-company-chart'
import { CostTrendChart } from '@/components/charts/cost-trend-chart'
import { CostPill } from '@/components/shared/cost-pill'
import { DateRangePicker } from '@/components/shared/date-range-picker'
import { PageHeader } from '@/components/shared/page-header'
import { Sparkline } from '@/components/shared/sparkline'
import { useOverviewStats, useUsage } from '@/hooks/use-costs'
import { useSelectedCompany } from '@/store/selected-company'

export function CostsPage() {
  const { t } = useTranslation()
  const { selectedCompanyId } = useSelectedCompany()
  const isAggregate = selectedCompanyId === 'all'
  const [range, setRange] = useState<DateRange | undefined>()

  const fromIso = range?.from?.toISOString().slice(0, 10)
  const toIso = range?.to?.toISOString().slice(0, 10)

  const { data: usage, isLoading: usageLoading } = useUsage({ from: fromIso, to: toIso })
  const { data: stats, isLoading: statsLoading } = useOverviewStats({ from: fromIso, to: toIso })

  // Build per-API aggregated breakdown across the range
  const apiBreakdown = useMemo(() => {
    if (!usage) return null
    let totalCost = 0
    let sttMinutes = 0
    let llmIn = 0
    let llmOut = 0
    let ttsChars = 0
    let lkMinutes = 0
    let waMessages = 0
    const dailyTotals: number[] = []

    for (const u of usage) {
      totalCost += u.totalCost
      sttMinutes += u.sttMinutes
      llmIn += u.llmInputTokens
      llmOut += u.llmOutputTokens
      ttsChars += u.ttsChars
      lkMinutes += u.livekitMinutes
      waMessages += u.whatsappMessages
      dailyTotals.push(u.totalCost)
    }

    return {
      totalCost,
      sttMinutes,
      llmIn,
      llmOut,
      ttsChars,
      lkMinutes,
      waMessages,
      dailyTotals,
      // Approximate split via ratios (mocks-internal — Phase 6 will provide per-API)
      sttCost: totalCost * 0.18,
      llmCost: totalCost * 0.32,
      ttsCost: totalCost * 0.36,
      lkCost: totalCost * 0.04,
      waCost: totalCost * 0.1,
    }
  }, [usage])

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <PageHeader
        title={t('nav.costs')}
        actions={<DateRangePicker value={range} onChange={setRange} />}
      />

      {/* Top stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label={t('costs.total')}
          value={
            stats ? <CostPill usd={stats.totalCostUsd} variant="stacked" /> : null
          }
          trend={apiBreakdown?.dailyTotals}
          isLoading={statsLoading}
        />
        <SummaryCard
          label={t('costs.avgPerCall')}
          value={
            stats ? (
              <CostPill
                usd={stats.totalCalls > 0 ? stats.totalCostUsd / stats.totalCalls : 0}
                variant="stacked"
              />
            ) : null
          }
          isLoading={statsLoading}
        />
        <SummaryCard
          label={t('costs.perBooking')}
          value={
            stats ? <CostPill usd={stats.costPerBooking} variant="stacked" /> : null
          }
          isLoading={statsLoading}
        />
      </div>

      {/* Charts row */}
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
        {isAggregate && (
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
        )}
      </div>

      {/* Per-API breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            {t('costs.usageBreakdown')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usageLoading || !apiBreakdown ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="divide-y">
              <ApiRow
                name="OpenAI STT"
                detail={`${apiBreakdown.sttMinutes.toFixed(0)} min @ $0.006/min`}
                cost={apiBreakdown.sttCost}
                total={apiBreakdown.totalCost}
              />
              <ApiRow
                name="OpenAI LLM"
                detail={`${(apiBreakdown.llmIn / 1000).toFixed(1)}K in / ${(apiBreakdown.llmOut / 1000).toFixed(1)}K out tokens`}
                cost={apiBreakdown.llmCost}
                total={apiBreakdown.totalCost}
              />
              <ApiRow
                name="ElevenLabs TTS"
                detail={`${(apiBreakdown.ttsChars / 1000).toFixed(1)}K chars @ $0.30/1k`}
                cost={apiBreakdown.ttsCost}
                total={apiBreakdown.totalCost}
              />
              <ApiRow
                name="LiveKit"
                detail={`${apiBreakdown.lkMinutes.toFixed(0)} participant-min @ $0.0005/min`}
                cost={apiBreakdown.lkCost}
                total={apiBreakdown.totalCost}
              />
              <ApiRow
                name="WhatsApp"
                detail={`${apiBreakdown.waMessages} messages`}
                cost={apiBreakdown.waCost}
                total={apiBreakdown.totalCost}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  trend,
  isLoading,
}: {
  label: string
  value: React.ReactNode
  trend?: number[]
  isLoading: boolean
}) {
  return (
    <Card>
      <CardContent className="space-y-2 py-4">
        <div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
          {label}
        </div>
        <div className="text-2xl font-semibold tabular-nums leading-none">
          {isLoading ? <Skeleton className="h-7 w-24" /> : value}
        </div>
        {trend && trend.length > 1 && (
          <Sparkline data={trend} tone="neutral" height={28} />
        )}
      </CardContent>
    </Card>
  )
}

function ApiRow({
  name,
  detail,
  cost,
  total,
}: {
  name: string
  detail: string
  cost: number
  total: number
}) {
  const pct = total === 0 ? 0 : (cost / total) * 100
  return (
    <div className="flex items-center justify-between gap-4 py-3 text-sm">
      <div className="min-w-0 flex-1">
        <div className="font-medium">{name}</div>
        <div className="text-muted-foreground text-xs tabular-nums">{detail}</div>
      </div>
      <div className="flex items-center gap-3 text-end">
        <span className="text-muted-foreground text-xs tabular-nums">
          {pct.toFixed(1)}%
        </span>
        <CostPill usd={cost} variant="stacked" />
      </div>
    </div>
  )
}
