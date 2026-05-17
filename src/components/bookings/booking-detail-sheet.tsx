import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { CompanyBadge } from '@/components/shared/company-badge'
import { RelativeTime } from '@/components/shared/relative-time'
import { StatusBadge } from '@/components/shared/status-badge'
import type { Booking } from '@/types/booking'

type BookingDetailSheetProps = {
  booking: Booking | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingDetailSheet({
  booking,
  open,
  onOpenChange,
}: BookingDetailSheetProps) {
  const { t } = useTranslation()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        {booking ? (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 font-mono">
                {booking.id}
              </SheetTitle>
              <SheetDescription className="flex flex-wrap items-center gap-2">
                <CompanyBadge companyId={booking.companyId} />
                <StatusBadge status={booking.status} />
                {booking.whatsappSent && (
                  <Badge variant="outline" className="text-[10px]">
                    ✓ WhatsApp
                  </Badge>
                )}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4 px-4">
              <Field label={t('bookings.customer')}>
                <bdi>{booking.customerName}</bdi>
              </Field>
              {booking.customerEmail && (
                <Field label={t('callers.email')}>
                  <span className="break-all">{booking.customerEmail}</span>
                  {booking.customerEmail.includes(' at ') && (
                    <Badge
                      variant="outline"
                      className="ms-2 border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[10px]"
                    >
                      ⚠ {t('bookings.needsNormalization')}
                    </Badge>
                  )}
                </Field>
              )}
              {booking.customerPhone && (
                <Field label={t('callers.phone')}>
                  <span className="font-mono">
                    <bdi>{booking.customerPhone}</bdi>
                  </span>
                </Field>
              )}
              <Field label={t('bookings.dateTime')}>
                <div>
                  {booking.preferredDate} · {booking.preferredTime}
                </div>
                {booking.preferredDateRaw && (
                  <div className="text-muted-foreground mt-1 text-xs">
                    {t('bookings.rawValue')} {booking.preferredDateRaw}
                  </div>
                )}
              </Field>
              <Field label={t('bookings.topic')}>
                <p className="whitespace-pre-wrap">{booking.discussionOutline}</p>
              </Field>
              <Field label={t('bookings.bookedAt')}>
                <RelativeTime iso={booking.bookedAt} className="text-sm" />
              </Field>
              {booking.notes && (
                <Field label={t('bookings.notes')}>
                  <p className="whitespace-pre-wrap text-sm">{booking.notes}</p>
                </Field>
              )}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
        {label}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  )
}
