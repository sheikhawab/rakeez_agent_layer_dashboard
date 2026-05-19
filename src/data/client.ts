import { mockAgentConfigs } from '@/mocks/agent-configs'
import { mockBookings } from '@/mocks/bookings'
import { mockCalls } from '@/mocks/calls'
import { mockCallers } from '@/mocks/callers'
import { mockCompanies } from '@/mocks/companies'
import { mockUsage } from '@/mocks/costs'
import { mockPrompts } from '@/mocks/prompts'
import { mockTranscriptsById } from '@/mocks/transcripts'
import type { AgentConfig } from '@/types/agent-config'
import type { Booking, BookingStatus } from '@/types/booking'
import type { Call, Language, Transcript } from '@/types/call'
import type { Caller } from '@/types/caller'
import type { Company } from '@/types/company'
import type { APIUsage } from '@/types/cost'
import type { SystemPrompt } from '@/types/prompt'

/**
 * Filter to scope a list by selected company.
 * `companyId === undefined | 'all'` returns everything.
 */
type CompanyScope = { companyId?: string | 'all' }

export type DateRangeFilter = {
  /** YYYY-MM-DD inclusive */
  from?: string
  to?: string
}

export type CallFilters = CompanyScope &
  DateRangeFilter & {
    language?: Language
    status?: Call['status']
    hasBooking?: boolean
    minDurationSec?: number
    callerId?: string
    /** Free-text search over caller name / phone / email */
    search?: string
  }

export type BookingFilters = CompanyScope &
  DateRangeFilter & {
    status?: BookingStatus
    search?: string
  }

export type CallerFilters = CompanyScope &
  DateRangeFilter & {
    hasBooking?: boolean
    search?: string
  }

export type CostFilters = CompanyScope & DateRangeFilter

export type OverviewStats = {
  companyId: string | 'all'
  totalCalls: number
  totalBookings: number
  totalCostUsd: number
  /** Companies count (1 when scoped, total when 'all') */
  companiesCount: number
  /** Average call duration in seconds */
  avgDurationSec: number
  /** Cost per booking */
  costPerBooking: number
  /** Calls → bookings % */
  conversionRate: number
  languageSplit: { ar: number; en: number; mixed: number }
  /** Active in-progress calls count */
  activeCalls: number
  /** Burn rate $/min based on currently active calls */
  burnRatePerMin: number
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Helpers                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

const isAll = (s?: string | 'all'): boolean => !s || s === 'all'

const scopeMatches =
  (filters: CompanyScope) =>
  <T extends { companyId: string }>(item: T): boolean =>
    isAll(filters.companyId) || item.companyId === filters.companyId

const inDateRange = (
  iso: string,
  range: DateRangeFilter,
): boolean => {
  if (!range.from && !range.to) return true
  const date = iso.slice(0, 10)
  if (range.from && date < range.from) return false
  if (range.to && date > range.to) return false
  return true
}

const searchMatch = (haystack: string | undefined, needle?: string): boolean => {
  if (!needle) return true
  if (!haystack) return false
  return haystack.toLowerCase().includes(needle.toLowerCase())
}

/** Simulate async network latency for realistic loading states. */
async function tick<T>(value: T, ms = 120): Promise<T> {
  await new Promise((r) => setTimeout(r, ms))
  return value
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Public API                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

export const dataClient = {
  /* Companies */
  async getCompanies(): Promise<Company[]> {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/tenants`)
    return res.json()
  },

  async getCompany(id: string): Promise<Company | undefined> {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/tenants/${id}`)
    if (!res.ok) return undefined
    return res.json()
  },

  /* Calls */
  async getCalls(filters: CallFilters = {}): Promise<Call[]> {
    return tick(
      mockCalls
        .filter(scopeMatches(filters))
        .filter((c) => inDateRange(c.startedAt, filters))
        .filter((c) => !filters.language || c.language === filters.language)
        .filter((c) => !filters.status || c.status === filters.status)
        .filter((c) =>
          filters.hasBooking === undefined
            ? true
            : filters.hasBooking
              ? Boolean(c.bookingId)
              : !c.bookingId,
        )
        .filter(
          (c) =>
            !filters.minDurationSec || c.durationSec >= filters.minDurationSec,
        )
        .filter((c) => !filters.callerId || c.callerId === filters.callerId)
        .filter((c) => {
          if (!filters.search) return true
          const caller = mockCallers.find((cl) => cl.id === c.callerId)
          return (
            searchMatch(caller?.name, filters.search) ||
            searchMatch(caller?.email, filters.search) ||
            searchMatch(caller?.phone, filters.search) ||
            searchMatch(c.summary, filters.search) ||
            searchMatch(c.id, filters.search)
          )
        })
        .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1)),
    )
  },

  async getCall(id: string): Promise<Call | undefined> {
    return tick(mockCalls.find((c) => c.id === id))
  },

  async getTranscript(id: string): Promise<Transcript | undefined> {
    return tick(mockTranscriptsById.get(id))
  },

  /* Callers */
  async getCallers(filters: CallerFilters = {}): Promise<Caller[]> {
    return tick(
      mockCallers
        .filter(scopeMatches(filters))
        .filter((cl) => inDateRange(cl.lastSeenAt, filters))
        .filter((cl) =>
          filters.hasBooking === undefined
            ? true
            : cl.hasBooking === filters.hasBooking,
        )
        .filter(
          (cl) =>
            searchMatch(cl.name, filters.search) ||
            searchMatch(cl.email, filters.search) ||
            searchMatch(cl.phone, filters.search),
        )
        .sort((a, b) => (a.lastSeenAt < b.lastSeenAt ? 1 : -1)),
    )
  },

  async getCaller(id: string): Promise<Caller | undefined> {
    return tick(mockCallers.find((cl) => cl.id === id))
  },

  /* Bookings */
  async getBookings(filters: BookingFilters = {}): Promise<Booking[]> {
    return tick(
      mockBookings
        .filter(scopeMatches(filters))
        .filter((b) => inDateRange(b.bookedAt, filters))
        .filter((b) => !filters.status || b.status === filters.status)
        .filter(
          (b) =>
            searchMatch(b.customerName, filters.search) ||
            searchMatch(b.customerEmail, filters.search) ||
            searchMatch(b.customerPhone, filters.search) ||
            searchMatch(b.id, filters.search) ||
            searchMatch(b.discussionOutline, filters.search),
        )
        .sort((a, b) => (a.bookedAt < b.bookedAt ? 1 : -1)),
    )
  },

  async getBooking(id: string): Promise<Booking | undefined> {
    return tick(mockBookings.find((b) => b.id === id))
  },

  /* Costs / Usage */
  async getUsage(filters: CostFilters = {}): Promise<APIUsage[]> {
    return tick(
      mockUsage
        .filter(scopeMatches(filters))
        .filter((u) => inDateRange(`${u.date}T00:00:00Z`, filters))
        .sort((a, b) => (a.date < b.date ? -1 : 1)),
    )
  },

  /* Prompts */
  async getPrompts(companyId: string): Promise<SystemPrompt[]> {
    return tick(mockPrompts.filter((p) => p.companyId === companyId))
  },

  /* Agent config */
  async getAgentConfig(companyId: string): Promise<AgentConfig | undefined> {
    return tick(mockAgentConfigs.find((c) => c.companyId === companyId))
  },

  /* Overview stats */
  async getOverviewStats(
    filters: CompanyScope & DateRangeFilter = {},
  ): Promise<OverviewStats> {
    const scopedCalls = mockCalls
      .filter(scopeMatches(filters))
      .filter((c) => inDateRange(c.startedAt, filters))
    const scopedBookings = mockBookings
      .filter(scopeMatches(filters))
      .filter((b) => inDateRange(b.bookedAt, filters))

    const completedCalls = scopedCalls.filter((c) => c.status !== 'in-progress')
    const totalCalls = completedCalls.length
    const totalBookings = scopedBookings.length
    const totalCostUsd = completedCalls.reduce((s, c) => s + c.cost.total, 0)

    const avgDurationSec =
      totalCalls === 0
        ? 0
        : completedCalls.reduce((s, c) => s + c.durationSec, 0) / totalCalls

    const conversionRate =
      totalCalls === 0 ? 0 : (totalBookings / totalCalls) * 100

    const costPerBooking =
      totalBookings === 0 ? 0 : totalCostUsd / totalBookings

    const lang = { ar: 0, en: 0, mixed: 0 }
    for (const c of completedCalls) lang[c.language]++

    const active = scopedCalls.filter((c) => c.status === 'in-progress')
    /** Typical per-call per-minute spend from mock cost ratios. */
    const PER_CALL_BURN_PER_MIN = 0.17
    const burnRatePerMin = active.length * PER_CALL_BURN_PER_MIN

    const companiesCount = isAll(filters.companyId)
      ? mockCompanies.length
      : 1

    return tick({
      companyId: filters.companyId ?? 'all',
      totalCalls,
      totalBookings,
      totalCostUsd,
      companiesCount,
      avgDurationSec,
      costPerBooking,
      conversionRate,
      languageSplit: lang,
      activeCalls: active.length,
      burnRatePerMin,
    })
  },
}

export type DataClient = typeof dataClient
