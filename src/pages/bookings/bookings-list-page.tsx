import { useMemo, useState } from 'react'
import { Calendar as CalendarIcon, CalendarDays } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { DateRange } from 'react-day-picker'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BookingDetailSheet } from '@/components/bookings/booking-detail-sheet'
import { CompanyBadge } from '@/components/shared/company-badge'
import { DataTable, DataTableSkeleton } from '@/components/shared/data-table'
import { DateRangePicker } from '@/components/shared/date-range-picker'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { RelativeTime } from '@/components/shared/relative-time'
import { StatusBadge } from '@/components/shared/status-badge'
import { useBookings } from '@/hooks/use-bookings'
import { useSelectedCompany } from '@/store/selected-company'
import type { Booking, BookingStatus } from '@/types/booking'

const STATUSES: BookingStatus[] = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'no-show',
]

export function BookingsListPage() {
  const { t } = useTranslation()
  const { selectedCompanyId } = useSelectedCompany()
  const isAggregate = selectedCompanyId === 'all'

  const [search, setSearch] = useState('')
  const [range, setRange] = useState<DateRange | undefined>()
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const { data: bookings, isLoading } = useBookings({
    search: search || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    from: range?.from?.toISOString().slice(0, 10),
    to: range?.to?.toISOString().slice(0, 10),
  })

  const columns = useMemo<ColumnDef<Booking, unknown>[]>(() => {
    const cols: ColumnDef<Booking, unknown>[] = [
      {
        accessorKey: 'id',
        header: t('bookings.confirmation'),
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.id}</span>
        ),
      },
      {
        accessorKey: 'customerName',
        header: t('bookings.customer'),
        cell: ({ row }) => (
          <span className="font-medium">
            <bdi>{row.original.customerName}</bdi>
          </span>
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
        accessorKey: 'preferredDate',
        header: t('bookings.dateTime'),
        cell: ({ row }) => (
          <span className="tabular-nums text-xs">
            {row.original.preferredDate} · {row.original.preferredTime}
          </span>
        ),
      },
      {
        accessorKey: 'discussionOutline',
        header: t('bookings.topic'),
        cell: ({ row }) => (
          <span className="text-muted-foreground line-clamp-1 max-w-[280px] text-xs">
            {row.original.discussionOutline}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: t('calls.status'),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'whatsappSent',
        header: t('bookings.whatsappSent'),
        cell: ({ row }) =>
          row.original.whatsappSent ? (
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10px]"
            >
              ✓
            </Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: 'bookedAt',
        header: t('bookings.bookedAt'),
        cell: ({ row }) => (
          <RelativeTime iso={row.original.bookedAt} className="text-xs" />
        ),
      },
    )

    return cols
  }, [isAggregate, t])

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <PageHeader
        title={t('nav.bookings')}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to="/bookings/calendar">
              <CalendarDays className="me-2 h-4 w-4" />
              Calendar
            </Link>
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`${t('topbar.search')}...`}
          className="h-8 max-w-xs"
        />
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as BookingStatus | 'all')}
        >
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue placeholder={t('calls.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('companies.all')}</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {t(`status.${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {isLoading ? (
        <DataTableSkeleton cols={isAggregate ? 8 : 7} rows={8} />
      ) : !bookings || bookings.length === 0 ? (
        <EmptyState icon={CalendarIcon} title={t('bookings.noBookingsFound')} />
      ) : (
        <DataTable
          columns={columns}
          data={bookings}
          onRowClick={(b) => setSelectedBooking(b)}
        />
      )}

      <BookingDetailSheet
        booking={selectedBooking}
        open={Boolean(selectedBooking)}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
      />
    </div>
  )
}
