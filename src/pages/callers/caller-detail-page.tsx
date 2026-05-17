import { ArrowLeft, Mail, Phone as PhoneIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CompanyBadge } from '@/components/shared/company-badge'
import { CostPill } from '@/components/shared/cost-pill'
import { DataTable } from '@/components/shared/data-table'
import { Duration } from '@/components/shared/duration'
import { LanguageBadge } from '@/components/shared/language-badge'
import { RelativeTime } from '@/components/shared/relative-time'
import { StatusBadge } from '@/components/shared/status-badge'
import { useCalls } from '@/hooks/use-calls'
import { useCaller } from '@/hooks/use-callers'
import type { Call } from '@/types/call'

export function CallerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: caller, isLoading: callerLoading } = useCaller(id)
  const { data: allCalls } = useCalls({ callerId: id })
  const callerCalls = allCalls?.filter((c) => c.callerId === id) ?? []

  const columns = useMemo<ColumnDef<Call, unknown>[]>(
    () => [
      {
        accessorKey: 'startedAt',
        header: t('calls.time'),
        cell: ({ row }) => (
          <RelativeTime iso={row.original.startedAt} className="text-xs" />
        ),
      },
      {
        accessorKey: 'durationSec',
        header: t('calls.duration'),
        cell: ({ row }) => <Duration seconds={row.original.durationSec} className="text-xs" />,
      },
      {
        accessorKey: 'language',
        header: t('calls.language'),
        cell: ({ row }) => <LanguageBadge language={row.original.language} />,
      },
      {
        accessorKey: 'status',
        header: t('calls.status'),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'booking',
        header: t('calls.booking'),
        cell: ({ row }) =>
          row.original.bookingId ? (
            <span className="font-mono text-xs">{row.original.bookingId}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: 'cost',
        header: t('calls.cost'),
        cell: ({ row }) => (
          <CostPill usd={row.original.cost.total} variant="usd-only" className="text-xs" />
        ),
      },
    ],
    [t],
  )

  if (callerLoading) {
    return (
      <div className="space-y-4 p-4 sm:p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!caller) {
    return (
      <div className="p-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/callers">
            <ArrowLeft className="me-2 h-4 w-4" />
            {t('actions.back')}
          </Link>
        </Button>
        <p className="text-muted-foreground mt-4 text-sm">Caller not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <Button variant="ghost" size="sm" asChild className="-ms-2">
        <Link to="/callers">
          <ArrowLeft className="me-1 h-4 w-4" />
          {t('actions.back')}
        </Link>
      </Button>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              <bdi>{caller.name ?? 'Unknown'}</bdi>
            </h1>
            <CompanyBadge companyId={caller.companyId} />
          </div>
          <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
            {caller.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {caller.email}
              </span>
            )}
            {caller.phone && (
              <span className="flex items-center gap-1.5 font-mono">
                <PhoneIcon className="h-3.5 w-3.5" />
                <bdi>{caller.phone}</bdi>
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryStat label={t('callers.totalCalls')} value={caller.totalCalls.toString()} />
        <SummaryStat
          label={t('callers.totalDuration')}
          value={<Duration seconds={caller.totalDurationSec} />}
        />
        <SummaryStat
          label={t('callers.totalCost')}
          value={<CostPill usd={caller.totalCost} variant="usd-only" />}
        />
        <SummaryStat
          label={t('callers.lastSeen')}
          value={<RelativeTime iso={caller.lastSeenAt} className="text-base" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            {t('nav.calls')} ({callerCalls.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {callerCalls.length === 0 ? (
            <div className="text-muted-foreground py-6 text-center text-sm">
              {t('common.noData')}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={callerCalls}
              onRowClick={(c) => navigate(`/calls/${c.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryStat({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="space-y-1 py-4">
        <div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
          {label}
        </div>
        <div className="text-xl font-semibold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  )
}
