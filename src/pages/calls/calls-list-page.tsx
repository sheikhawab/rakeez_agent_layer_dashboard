import { useMemo, useState } from 'react'
import { Phone } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import type { DateRange } from 'react-day-picker'

import { CompanyBadge } from '@/components/shared/company-badge'
import { CostPill } from '@/components/shared/cost-pill'
import { DataTable, DataTableSkeleton } from '@/components/shared/data-table'
import { DateRangePicker } from '@/components/shared/date-range-picker'
import { Duration } from '@/components/shared/duration'
import { EmptyState } from '@/components/shared/empty-state'
import { LanguageBadge } from '@/components/shared/language-badge'
import { PageHeader } from '@/components/shared/page-header'
import { RelativeTime } from '@/components/shared/relative-time'
import { StatusBadge } from '@/components/shared/status-badge'
import { Input } from '@/components/ui/input'
import { useCalls } from '@/hooks/use-calls'
import { mockCallers } from '@/mocks/callers'
import { useSelectedCompany } from '@/store/selected-company'
import type { Call } from '@/types/call'

export function CallsListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { selectedCompanyId } = useSelectedCompany()
  const isAggregate = selectedCompanyId === 'all'

  const [search, setSearch] = useState('')
  const [range, setRange] = useState<DateRange | undefined>()

  const { data: calls, isLoading } = useCalls({
    search: search || undefined,
    from: range?.from?.toISOString().slice(0, 10),
    to: range?.to?.toISOString().slice(0, 10),
  })

  const columns = useMemo<ColumnDef<Call, unknown>[]>(() => {
    const cols: ColumnDef<Call, unknown>[] = [
      {
        accessorKey: 'startedAt',
        header: t('calls.time'),
        cell: ({ row }) => (
          <RelativeTime iso={row.original.startedAt} className="text-xs" />
        ),
      },
      {
        id: 'caller',
        header: t('calls.caller'),
        cell: ({ row }) => {
          const caller = mockCallers.find((c) => c.id === row.original.callerId)
          return (
            <span className="font-medium">
              <bdi>{caller?.name ?? 'Unknown'}</bdi>
            </span>
          )
        },
      },
    ]

    if (isAggregate) {
      cols.push({
        id: 'company',
        header: t('calls.company'),
        cell: ({ row }) => <CompanyBadge companyId={row.original.companyId} />,
      })
    }

    cols.push(
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
    )

    return cols
  }, [isAggregate, t])

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <PageHeader title={t('nav.calls')} />

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`${t('topbar.search')}...`}
          className="h-8 max-w-xs"
        />
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {isLoading ? (
        <DataTableSkeleton cols={isAggregate ? 8 : 7} rows={8} />
      ) : !calls || calls.length === 0 ? (
        <EmptyState
          icon={Phone}
          title={t('calls.noCallsFound')}
          description={t('calls.noCallsDescription')}
        />
      ) : (
        <DataTable
          columns={columns}
          data={calls}
          onRowClick={(call) => navigate(`/calls/${call.id}`)}
        />
      )}
    </div>
  )
}
