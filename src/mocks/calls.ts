import { computeCallCost } from '@/lib/cost-calculator'
import type { Call } from '@/types/call'

/**
 * Helper to build a call with realistic computed cost from usage.
 */
function makeCall(args: {
  id: string
  companyId: string
  callerId: string
  startedAt: string
  durationSec: number
  language: Call['language']
  status?: Call['status']
  bookingId?: string
  transcriptId: string
  summary?: string
  /** Approximate token usage profile */
  tokenProfile?: 'short' | 'medium' | 'long'
  whatsappSent?: boolean
}): Call {
  const profile = args.tokenProfile ?? 'medium'
  const minutes = args.durationSec / 60

  // Realistic per-minute ratios derived from a typical voice agent session:
  // STT runs over whole audio, LLM avg 250 input + 80 output tokens/turn,
  // TTS produces ~120 chars/turn, ~4 turns/minute.
  const turnsPerMinute = 4
  const totalTurns = Math.max(1, Math.round(minutes * turnsPerMinute))
  const inputPerTurn = profile === 'short' ? 180 : profile === 'long' ? 380 : 260
  const outputPerTurn = profile === 'short' ? 50 : profile === 'long' ? 140 : 85
  const ttsCharsPerTurn = profile === 'short' ? 80 : profile === 'long' ? 180 : 130

  const cost = computeCallCost({
    audioSeconds: args.durationSec,
    llmModel: 'gpt-4.1-mini',
    llmInputTokens: totalTurns * inputPerTurn,
    llmOutputTokens: totalTurns * outputPerTurn,
    ttsChars: totalTurns * ttsCharsPerTurn,
    /** Two participants (caller + agent) → ~2x call minutes */
    livekitParticipantMinutes: minutes * 2,
    whatsappMessages: args.whatsappSent
      ? { template: 1, freeForm: 0 }
      : { template: 0, freeForm: 0 },
  })

  const startedAt = new Date(args.startedAt)
  const endedAt = new Date(startedAt.getTime() + args.durationSec * 1000)

  return {
    id: args.id,
    companyId: args.companyId,
    callerId: args.callerId,
    startedAt: startedAt.toISOString(),
    endedAt: endedAt.toISOString(),
    durationSec: args.durationSec,
    language: args.language,
    status: args.status ?? 'completed',
    bookingId: args.bookingId,
    cost,
    summary: args.summary,
    transcriptId: args.transcriptId,
  }
}

export const mockCalls: Call[] = [
  // ── Rakeez Sales (the real ones map to real bookings) ──
  makeCall({
    id: 'call-az-1',
    companyId: 'rakeez-sales',
    callerId: 'cl-azan',
    startedAt: '2026-05-07T14:30:00.000Z',
    durationSec: 248,
    language: 'mixed',
    bookingId: 'RKZ-934AC927',
    transcriptId: 'tr-featured-1',
    summary: 'Discussed AI voice agent build for logistics; booked follow-up.',
    tokenProfile: 'medium',
    whatsappSent: true,
  }),
  makeCall({
    id: 'call-az-2',
    companyId: 'rakeez-sales',
    callerId: 'cl-azan',
    startedAt: '2026-05-07T16:48:00.000Z',
    durationSec: 312,
    language: 'en',
    bookingId: 'RKZ-3259A814',
    transcriptId: 'tr-stub-en',
    summary: 'NLP model pricing and scaling discussion.',
    tokenProfile: 'long',
    whatsappSent: true,
  }),
  makeCall({
    id: 'call-az-3',
    companyId: 'rakeez-sales',
    callerId: 'cl-azan',
    startedAt: '2026-05-13T10:20:00.000Z',
    durationSec: 52,
    language: 'en',
    status: 'dropped',
    transcriptId: 'tr-stub-en',
    summary: 'Brief connection check; user hung up.',
    tokenProfile: 'short',
  }),
  makeCall({
    id: 'call-awwab-1',
    companyId: 'rakeez-sales',
    callerId: 'cl-awwab',
    startedAt: '2026-05-07T14:36:00.000Z',
    durationSec: 198,
    language: 'ar',
    bookingId: 'RKZ-278216F3',
    transcriptId: 'tr-featured-2',
    summary: 'مناقشة نظام ERP والميزانية المتوقعة.',
    tokenProfile: 'medium',
    whatsappSent: true,
  }),
  makeCall({
    id: 'call-awwab-2',
    companyId: 'rakeez-sales',
    callerId: 'cl-awwab',
    startedAt: '2026-05-13T16:13:00.000Z',
    durationSec: 210,
    language: 'mixed',
    bookingId: 'RKZ-9AD22345',
    transcriptId: 'tr-featured-2',
    summary: 'SEO consultation and mobile app inquiry.',
    tokenProfile: 'medium',
    whatsappSent: true,
  }),
  makeCall({
    id: 'call-ahmed-butt-1',
    companyId: 'rakeez-sales',
    callerId: 'cl-ahmed-butt',
    startedAt: '2026-05-13T10:11:00.000Z',
    durationSec: 248,
    language: 'ar',
    bookingId: 'RKZ-5AAA74A4',
    transcriptId: 'tr-featured-2',
    summary: 'استفسار عن خدمات الزكاة الصناعية.',
    tokenProfile: 'medium',
    whatsappSent: true,
  }),
  makeCall({
    id: 'call-majid-1',
    companyId: 'rakeez-sales',
    callerId: 'cl-majid',
    startedAt: '2026-05-13T10:21:00.000Z',
    durationSec: 197,
    language: 'ar',
    bookingId: 'RKZ-D70DF905',
    transcriptId: 'tr-featured-2',
    summary: 'إنشاء موقع جديد وحجز موعد.',
    tokenProfile: 'medium',
    whatsappSent: true,
  }),
  makeCall({
    id: 'call-ahmed-1',
    companyId: 'rakeez-sales',
    callerId: 'cl-ahmed',
    startedAt: '2026-05-09T13:00:00.000Z',
    durationSec: 134,
    language: 'en',
    bookingId: 'RKZ-E281D05E',
    transcriptId: 'tr-stub-en',
    summary: 'AI project inquiry, brief booking.',
    tokenProfile: 'short',
    whatsappSent: true,
  }),

  // ── Live in-progress (for Active Now testing) ──
  makeCall({
    id: 'call-live-1',
    companyId: 'rakeez-sales',
    callerId: 'cl-azan',
    startedAt: new Date(Date.now() - 84_000).toISOString(),
    durationSec: 84,
    language: 'ar',
    status: 'in-progress',
    transcriptId: 'tr-featured-1',
    tokenProfile: 'short',
  }),
  makeCall({
    id: 'call-live-2',
    companyId: 'client-alpha',
    callerId: 'cl-sara-khan',
    startedAt: new Date(Date.now() - 36_000).toISOString(),
    durationSec: 36,
    language: 'en',
    status: 'in-progress',
    transcriptId: 'tr-stub-en',
    tokenProfile: 'short',
  }),

  // ── Client Alpha ──
  makeCall({
    id: 'call-sara-1',
    companyId: 'client-alpha',
    callerId: 'cl-sara-khan',
    startedAt: '2026-05-13T14:00:00.000Z',
    durationSec: 192,
    language: 'en',
    bookingId: 'ALP-001A2B3C',
    transcriptId: 'tr-stub-en',
    summary: 'Web platform redesign discussion, booked.',
    tokenProfile: 'medium',
    whatsappSent: true,
  }),
  makeCall({
    id: 'call-sara-2',
    companyId: 'client-alpha',
    callerId: 'cl-sara-khan',
    startedAt: '2026-05-10T11:00:00.000Z',
    durationSec: 145,
    language: 'en',
    transcriptId: 'tr-stub-en',
    summary: 'Initial inquiry, no booking.',
    tokenProfile: 'short',
  }),
  makeCall({
    id: 'call-sara-3',
    companyId: 'client-alpha',
    callerId: 'cl-sara-khan',
    startedAt: '2026-04-28T09:30:00.000Z',
    durationSec: 220,
    language: 'en',
    transcriptId: 'tr-stub-en',
    summary: 'Follow-up about pricing.',
    tokenProfile: 'medium',
  }),
  makeCall({
    id: 'call-sara-4',
    companyId: 'client-alpha',
    callerId: 'cl-sara-khan',
    startedAt: '2026-04-20T10:12:00.000Z',
    durationSec: 132,
    language: 'en',
    transcriptId: 'tr-stub-en',
    tokenProfile: 'short',
  }),
  makeCall({
    id: 'call-james-1',
    companyId: 'client-alpha',
    callerId: 'cl-james',
    startedAt: '2026-05-12T11:40:00.000Z',
    durationSec: 232,
    language: 'en',
    transcriptId: 'tr-stub-en',
    summary: 'Asked about timeline, no booking yet.',
    tokenProfile: 'medium',
  }),
  makeCall({
    id: 'call-james-2',
    companyId: 'client-alpha',
    callerId: 'cl-james',
    startedAt: '2026-05-02T08:30:00.000Z',
    durationSec: 180,
    language: 'en',
    transcriptId: 'tr-stub-en',
    tokenProfile: 'medium',
  }),

  // ── Client Beta (Arabic-only healthcare) ──
  makeCall({
    id: 'call-khalid-1',
    companyId: 'client-beta',
    callerId: 'cl-khalid',
    startedAt: '2026-05-13T15:25:00.000Z',
    durationSec: 213,
    language: 'ar',
    bookingId: 'BTA-001X9Y8Z',
    transcriptId: 'tr-featured-2',
    summary: 'حجز استشارة طبية افتراضية.',
    tokenProfile: 'medium',
    whatsappSent: true,
  }),
  makeCall({
    id: 'call-khalid-2',
    companyId: 'client-beta',
    callerId: 'cl-khalid',
    startedAt: '2026-05-05T09:15:00.000Z',
    durationSec: 175,
    language: 'ar',
    transcriptId: 'tr-featured-2',
    summary: 'استفسار عن الخدمات.',
    tokenProfile: 'medium',
  }),
  makeCall({
    id: 'call-khalid-3',
    companyId: 'client-beta',
    callerId: 'cl-khalid',
    startedAt: '2026-04-25T09:00:00.000Z',
    durationSec: 140,
    language: 'ar',
    transcriptId: 'tr-featured-2',
    tokenProfile: 'short',
  }),
  makeCall({
    id: 'call-fatima-1',
    companyId: 'client-beta',
    callerId: 'cl-fatima',
    startedAt: '2026-05-13T09:55:00.000Z',
    durationSec: 198,
    language: 'ar',
    bookingId: 'BTA-002A1B2C',
    transcriptId: 'tr-featured-2',
    summary: 'حجز موعد للفحص الدوري.',
    tokenProfile: 'medium',
    whatsappSent: true,
  }),
  makeCall({
    id: 'call-fatima-2',
    companyId: 'client-beta',
    callerId: 'cl-fatima',
    startedAt: '2026-05-05T13:15:00.000Z',
    durationSec: 169,
    language: 'ar',
    transcriptId: 'tr-featured-2',
    tokenProfile: 'medium',
  }),

  // ── Client Gamma ──
  makeCall({
    id: 'call-omar-1',
    companyId: 'client-gamma',
    callerId: 'cl-omar',
    startedAt: '2026-05-13T13:55:00.000Z',
    durationSec: 178,
    language: 'en',
    bookingId: 'GMA-001P3Q4R',
    transcriptId: 'tr-stub-en',
    summary: 'Software prototype scope discussion.',
    tokenProfile: 'medium',
    whatsappSent: true,
  }),
  makeCall({
    id: 'call-omar-2',
    companyId: 'client-gamma',
    callerId: 'cl-omar',
    startedAt: '2026-05-08T11:00:00.000Z',
    durationSec: 120,
    language: 'mixed',
    transcriptId: 'tr-stub-en',
    tokenProfile: 'short',
  }),

  // ── Client Delta (low traffic) ──
  makeCall({
    id: 'call-noor-1',
    companyId: 'client-delta',
    callerId: 'cl-noor',
    startedAt: '2026-05-12T17:25:00.000Z',
    durationSec: 95,
    language: 'ar',
    status: 'missed',
    transcriptId: 'tr-featured-2',
    tokenProfile: 'short',
  }),
  makeCall({
    id: 'call-noor-2',
    companyId: 'client-delta',
    callerId: 'cl-noor',
    startedAt: '2026-05-10T16:00:00.000Z',
    durationSec: 89,
    language: 'ar',
    transcriptId: 'tr-featured-2',
    tokenProfile: 'short',
  }),

  // ── Client Epsilon (premium, longer calls) ──
  makeCall({
    id: 'call-yusuf-1',
    companyId: 'client-epsilon',
    callerId: 'cl-yusuf',
    startedAt: '2026-05-13T13:10:00.000Z',
    durationSec: 482,
    language: 'en',
    bookingId: 'EPS-001T5U6V',
    transcriptId: 'tr-stub-en',
    summary: 'Enterprise migration plan, architecture review booked.',
    tokenProfile: 'long',
    whatsappSent: true,
  }),
  makeCall({
    id: 'call-yusuf-2',
    companyId: 'client-epsilon',
    callerId: 'cl-yusuf',
    startedAt: '2026-05-06T10:30:00.000Z',
    durationSec: 398,
    language: 'en',
    transcriptId: 'tr-stub-en',
    summary: 'Initial enterprise discovery.',
    tokenProfile: 'long',
  }),
  makeCall({
    id: 'call-yusuf-3',
    companyId: 'client-epsilon',
    callerId: 'cl-yusuf',
    startedAt: '2026-04-28T10:00:00.000Z',
    durationSec: 302,
    language: 'ar',
    transcriptId: 'tr-featured-2',
    tokenProfile: 'long',
  }),
]
