import { useTranslation } from 'react-i18next'

import { formatRelative } from '@/lib/format'
import { cn } from '@/lib/utils'

export function RelativeTime({
  iso,
  className,
}: {
  iso: string
  className?: string
}) {
  const { i18n } = useTranslation()
  return (
    <time
      dateTime={iso}
      className={cn('text-muted-foreground tabular-nums', className)}
      title={iso}
    >
      {formatRelative(iso, i18n.language === 'ar' ? 'ar' : 'en')}
    </time>
  )
}
