export type Caller = {
  id: string
  companyId: string
  name?: string
  email?: string
  /** Raw phone as captured (may be Arabic digits or as-spoken) */
  phone?: string
  /** Normalized phone for dedup (E.164 best-effort) */
  phoneNormalized?: string
  firstSeenAt: string
  lastSeenAt: string
  totalCalls: number
  totalDurationSec: number
  /** USD */
  totalCost: number
  hasBooking: boolean
}
