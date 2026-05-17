import { format as dfFormat, formatDistanceToNow } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

import { USD_TO_SAR } from './pricing'

type Locale = 'en' | 'ar'

const locales = { en: enUS, ar }

/** Format an ISO date for display. */
export function formatDate(iso: string, locale: Locale = 'en', pattern = 'PP'): string {
  return dfFormat(new Date(iso), pattern, { locale: locales[locale] })
}

/** Format a date with time. */
export function formatDateTime(iso: string, locale: Locale = 'en'): string {
  return dfFormat(new Date(iso), 'PPp', { locale: locales[locale] })
}

/** "3 minutes ago" / "منذ ٣ دقائق" */
export function formatRelative(iso: string, locale: Locale = 'en'): string {
  return formatDistanceToNow(new Date(iso), {
    addSuffix: true,
    locale: locales[locale],
  })
}

/** Duration in seconds → "mm:ss" */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/** Long form: "3m 24s" */
export function formatDurationLong(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return secs ? `${mins}m ${secs}s` : `${mins}m`
}

/**
 * Format cost in dual currency (USD + SAR).
 * Returns separate parts so caller can lay out as needed.
 */
export function formatCost(usd: number): {
  usd: string
  sar: string
  /** Compact one-line: "$0.082 / 0.31 SAR" */
  combined: string
} {
  const usdStr = `$${usd.toFixed(usd < 1 ? 3 : 2)}`
  const sar = usd * USD_TO_SAR
  const sarStr = `${sar.toFixed(sar < 1 ? 3 : 2)} SAR`
  return { usd: usdStr, sar: sarStr, combined: `${usdStr} / ${sarStr}` }
}

/** Locale-aware number formatting (handles Arabic-Indic toggle later via settings). */
export function formatNumber(n: number, locale: Locale = 'en'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'en-US' : 'en-US').format(n)
}

/** Percentage with sign-aware delta indicator. Returns "+5%" or "-12%". */
export function formatDelta(percent: number): string {
  const sign = percent >= 0 ? '+' : ''
  return `${sign}${percent.toFixed(0)}%`
}
