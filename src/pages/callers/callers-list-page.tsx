import { useMemo, useState } from 'react'
import { Users } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { CompanyBadge } from '@/components/shared/company-badge'
import { CostPill } from '@/components/shared/cost-pill'
import { DataTable, DataTableSkeleton } from '@/components/shared/data-table'
import { Duration } from '@/components/shared/duration'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { RelativeTime } from '@/components/shared/relative-time'
import { useCallers } from '@/hooks/use-callers'
import { useSelectedCompany } from '@/store/selected-company'
import type { Caller } from '@/types/caller'

export function CallersListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { selectedCompanyId } = useSelectedCompany()
  const isAggregate = selectedCompanyId === 'all'
  const [search, setSearch] = useState('')

  const { data: callers, isLoading } = useCallers({
    search: search || undefined,
  })

  const columns = useMemo<ColumnDef<Caller, unknown>[]>(() => {
    const cols: ColumnDef<Caller, unknown>[] = [
      {
        accessorKey: 'name',
        header: t('callers.name'),
        cell: ({ row }) => (
          <span className="font-medium">
            <bdi>{row.original.name ?? 'Unknown'}</bdi>
          </span>
        ),
      },
      {
        accessorKey: 'email',
        header: t('callers.email'),
        cell: ({ row }) =>
          row.original.email ? (
            <span className="text-muted-foreground truncate text-xs">
              {row.original.email}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: 'phone',
        header: t('callers.phone'),
        cell: ({ row }) =>
          row.original.phone ? (
            <span className="text-muted-foreground font-mono text-xs">
              <bdi>{row.original.phone}</bdi>
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
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
        accessorKey: 'totalCalls',
        header: t('callers.totalCalls'),
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.totalCalls}</span>
        ),
      },
      {
        accessorKey: 'totalDurationSec',
        header: t('callers.totalDuration'),
        cell: ({ row }) => (
          <Duration seconds={row.original.totalDurationSec} className="text-xs" />
        ),
      },
      {
        accessorKey: 'totalCost',
        header: t('callers.totalCost'),
        cell: ({ row }) => (
          <CostPill usd={row.original.totalCost} variant="usd-only" className="text-xs" />
        ),
      },
      {
        accessorKey: 'hasBooking',
        header: t('calls.booking'),
        cell: ({ row }) =>
          row.original.hasBooking ? (
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
            >
              ✓
            </Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: 'lastSeenAt',
        header: t('callers.lastSeen'),
        cell: ({ row }) => (
          <RelativeTime iso={row.original.lastSeenAt} className="text-xs" />
        ),
      },
    )

    return cols
  }, [isAggregate, t])

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <PageHeader title={t('nav.callers')} />

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`${t('topbar.search')}...`}
        className="h-8 max-w-xs"
      />

      {isLoading ? (
        <DataTableSkeleton cols={isAggregate ? 9 : 8} rows={6} />
      ) : !callers || callers.length === 0 ? (
        <EmptyState icon={Users} title={t('callers.noCallersFound')} />
      ) : (
        <DataTable
          columns={columns}
          data={callers}
          onRowClick={(c) => navigate(`/callers/${c.id}`)}
        />
      )}
    </div>
  )
}
