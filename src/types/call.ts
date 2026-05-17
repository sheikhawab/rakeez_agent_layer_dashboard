import type { CostBreakdown } from './cost'

export type Language = 'ar' | 'en' | 'mixed'

export type CallStatus =
  | 'completed'
  | 'missed'
  | 'dropped'
  | 'timeout'
  | 'in-progress'

export type TranscriptSegment = {
  speaker: 'agent' | 'caller'
  text: string
  language: 'ar' | 'en'
  /** Milliseconds from call start */
  startMs: number
  endMs: number
}

export type Transcript = {
  id: string
  callId: string
  segments: TranscriptSegment[]
}

export type Call = {
  id: string
  companyId: string
  callerId: string
  /** ISO timestamp */
  startedAt: string
  endedAt: string
  durationSec: number
  language: Language
  status: CallStatus
  /** Confirmation number if call ended in a booking */
  bookingId?: string
  cost: CostBreakdown
  /** Short LLM-generated summary, optional */
  summary?: string
  transcriptId: string
}
