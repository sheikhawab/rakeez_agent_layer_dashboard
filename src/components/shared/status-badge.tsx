import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { BookingStatus } from '@/types/booking'
import type { CallStatus } from '@/types/call'

type Status = BookingStatus | CallStatus

const STATUS_STYLES: Record<Status, string> = {
  // Booking
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  confirmed: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
  completed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
  'no-show': 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30',

  // Call
  missed: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
  dropped: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30',
  timeout: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30',
  'in-progress': 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
}

const STATUS_LABELS: Record<Status, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  'no-show': 'No-show',
  missed: 'Missed',
  dropped: 'Dropped',
  timeout: 'Timeout',
  'in-progress': 'In progress',
}

export function StatusBadge({
  status,
  className,
}: {
  status: Status
  className?: string
}) {
  const { t } = useTranslation()
  // Try i18n key first, fall back to English label
  const label = t(`status.${status}`, { defaultValue: STATUS_LABELS[status] })

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1.5 border font-medium tabular-nums',
        STATUS_STYLES[status],
        className,
      )}
    >
      {status === 'in-progress' && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
      )}
      {label}
    </Badge>
  )
}
