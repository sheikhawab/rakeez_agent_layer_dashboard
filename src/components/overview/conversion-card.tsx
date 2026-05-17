import { useTranslation } from 'react-i18next'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ConversionDonut } from '@/components/charts/conversion-donut'

type ConversionCardProps = {
  calls: number | undefined
  bookings: number | undefined
  isLoading: boolean
}

export function ConversionCard({ calls, bookings, isLoading }: ConversionCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col items-center justify-between gap-2 py-5">
        <div className="text-muted-foreground self-start text-[10px] font-semibold tracking-wider uppercase">
          {t('overview.conversion')}
        </div>

        {isLoading || calls === undefined || bookings === undefined ? (
          <Skeleton className="h-[120px] w-[120px] rounded-full" />
        ) : (
          <ConversionDonut calls={calls} bookings={bookings} size={120} />
        )}

        <div className="text-muted-foreground text-[10px]">
          {t('overview.callsToBookings')}
        </div>
      </CardContent>
    </Card>
  )
}
