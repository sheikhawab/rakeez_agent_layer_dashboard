export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no-show'

export type Booking = {
  /** Confirmation number, e.g. "RKZ-934AC927" */
  id: string
  companyId: string
  /** Linked call if booking was made via voice agent */
  callId?: string
  customerName: string
  customerEmail?: string
  /** Raw phone as captured */
  customerPhone?: string
  discussionOutline: string
  /** Normalized ISO date (YYYY-MM-DD) */
  preferredDate: string
  preferredTime: string
  /** Raw input from caller (Arabic numerals, spoken format) — for audit */
  preferredDateRaw?: string
  /** ISO timestamp */
  bookedAt: string
  status: BookingStatus
  whatsappSent: boolean
  notes?: string
}
