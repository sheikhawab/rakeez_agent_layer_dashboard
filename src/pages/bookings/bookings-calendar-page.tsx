import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, List } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BookingDetailSheet } from '@/components/bookings/booking-detail-sheet'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { useBookings } from '@/hooks/use-bookings'
import { cn } from '@/lib/utils'
import type { Booking } from '@/types/booking'

export function BookingsCalendarPage() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const locale = isArabic ? ar : enUS

  const [cursor, setCursor] = useState(() => new Date())
  const [selected, setSelected] = useState<Booking | null>(null)

  const { data: bookings, isLoading } = useBookings()

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { locale })
    const end = endOfWeek(endOfMonth(cursor), { locale })
    return eachDayOfInterval({ start, end })
  }, [cursor, locale])

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>()
    for (const b of bookings ?? []) {
      const key = b.preferredDate
      const arr = map.get(key) ?? []
      arr.push(b)
      map.set(key, arr)
    }
    return map
  }, [bookings])

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <PageHeader
        title={t('nav.bookings')}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to="/bookings">
              <List className="me-2 h-4 w-4" />
              List
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCursor(subMonths(cursor, 1))}
              className="h-8 w-8"
              aria-label="Previous month"
            >
              <ChevronLeft className="cn-rtl-flip h-4 w-4" />
            </Button>
            <h2 className="text-base font-semibold tabular-nums">
              {format(cursor, 'MMMM yyyy', { locale })}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCursor(addMonths(cursor, 1))}
              className="h-8 w-8"
              aria-label="Next month"
            >
              <ChevronRight className="cn-rtl-flip h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <Skeleton className="h-[500px] w-full" />
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {days.slice(0, 7).map((day, i) => (
                <div
                  key={`hdr-${i}`}
                  className="text-muted-foreground py-2 text-center text-[10px] font-semibold tracking-wider uppercase"
                >
                  {format(day, 'EEE', { locale })}
                </div>
              ))}
              {days.map((day) => {
                const dateKey = format(day, 'yyyy-MM-dd')
                const dayBookings = bookingsByDate.get(dateKey) ?? []
                const inMonth = isSameMonth(day, cursor)
                return (
                  <div
                    key={dateKey}
                    className={cn(
                      'min-h-[88px] rounded-md border p-1.5 text-xs',
                      !inMonth && 'bg-muted/30 opacity-50',
                    )}
                  >
                    <div
                      className={cn(
                        'mb-1 text-[11px] font-medium tabular-nums',
                        inMonth ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {format(day, 'd', { locale })}
                    </div>
                    <div className="space-y-1">
                      {dayBookings.slice(0, 3).map((b) => {
                        return (
                          <button
                            key={b.id}
                            onClick={() => setSelected(b)}
                            className="hover:bg-muted/60 -mx-0.5 flex w-[calc(100%+4px)] items-center gap-1 truncate rounded px-1 py-0.5 text-start text-[10px] transition-colors"
                          >
                            <span
                              className="h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{
                                backgroundColor: 'currentColor',
                              }}
                            />
                            <span className="truncate">
                              <bdi>{b.customerName}</bdi>
                            </span>
                          </button>
                        )
                      })}
                      {dayBookings.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="h-4 px-1 text-[10px]"
                        >
                          +{dayBookings.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selected && (
        <Card>
          <CardContent className="space-y-2 pt-6 text-sm">
            <div className="flex items-center gap-3">
              <span className="font-mono">{selected.id}</span>
              <StatusBadge status={selected.status} />
            </div>
            <div className="text-muted-foreground">
              <bdi>{selected.customerName}</bdi> · {selected.preferredDate} ·{' '}
              {selected.preferredTime}
            </div>
          </CardContent>
        </Card>
      )}

      <BookingDetailSheet
        booking={selected}
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </div>
  )
}
