import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { useTranslation } from 'react-i18next'
import { ar, enUS } from 'date-fns/locale'
import {
  endOfMonth,
  format,
  startOfMonth,
  startOfToday,
  subDays,
  subMonths,
} from 'date-fns'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

type Preset = {
  key: string
  label: string
  getRange: () => DateRange
}

function buildPresets(t: (k: string) => string): Preset[] {
  const today = startOfToday()
  return [
    { key: 'today', label: t('today'), getRange: () => ({ from: today, to: today }) },
    {
      key: 'yesterday',
      label: t('yesterday'),
      getRange: () => {
        const y = subDays(today, 1)
        return { from: y, to: y }
      },
    },
    {
      key: '7d',
      label: t('last7d'),
      getRange: () => ({ from: subDays(today, 6), to: today }),
    },
    {
      key: '30d',
      label: t('last30d'),
      getRange: () => ({ from: subDays(today, 29), to: today }),
    },
    {
      key: '90d',
      label: t('last90d'),
      getRange: () => ({ from: subDays(today, 89), to: today }),
    },
    {
      key: 'thisMonth',
      label: t('thisMonth'),
      getRange: () => ({ from: startOfMonth(today), to: today }),
    },
    {
      key: 'lastMonth',
      label: t('lastMonth'),
      getRange: () => {
        const lastMonth = subMonths(today, 1)
        return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
      },
    },
  ]
}

type DateRangePickerProps = {
  value: DateRange | undefined
  onChange: (range: DateRange | undefined) => void
  /** Optional className for the trigger button */
  className?: string
  align?: 'start' | 'center' | 'end'
}

export function DateRangePicker({
  value,
  onChange,
  className,
  align = 'start',
}: DateRangePickerProps) {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const isArabic = i18n.language === 'ar'
  const locale = isArabic ? ar : enUS

  // Minimal local strings — full i18n keys can be added later
  const labels = isArabic
    ? {
        pickRange: 'اختر نطاق التاريخ',
        today: 'اليوم',
        yesterday: 'أمس',
        last7d: 'آخر ٧ أيام',
        last30d: 'آخر ٣٠ يوم',
        last90d: 'آخر ٩٠ يوم',
        thisMonth: 'هذا الشهر',
        lastMonth: 'الشهر الماضي',
      }
    : {
        pickRange: 'Pick a date range',
        today: 'Today',
        yesterday: 'Yesterday',
        last7d: 'Last 7 days',
        last30d: 'Last 30 days',
        last90d: 'Last 90 days',
        thisMonth: 'This month',
        lastMonth: 'Last month',
      }

  const presets = buildPresets((k) => labels[k as keyof typeof labels])

  const buttonLabel =
    value?.from && value?.to
      ? `${format(value.from, 'PP', { locale })} – ${format(value.to, 'PP', { locale })}`
      : value?.from
        ? format(value.from, 'PP', { locale })
        : labels.pickRange

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('h-8 gap-2 font-normal', className)}
        >
          <CalendarIcon className="h-3.5 w-3.5 opacity-70" />
          <span>{buttonLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className="flex w-auto flex-col gap-0 p-0 sm:flex-row"
      >
        <div className="flex flex-col gap-1 p-2 sm:w-[160px]">
          {presets.map((preset) => (
            <Button
              key={preset.key}
              variant="ghost"
              size="sm"
              className="justify-start font-normal"
              onClick={() => {
                onChange(preset.getRange())
                setOpen(false)
              }}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <Separator className="sm:hidden" />
        <Separator orientation="vertical" className="hidden sm:block" />
        <div className="p-2">
          <Calendar
            mode="range"
            selected={value}
            onSelect={(range) => {
              onChange(range)
              if (range?.from && range?.to) setOpen(false)
            }}
            numberOfMonths={2}
            locale={locale}
            defaultMonth={value?.from ?? new Date()}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
