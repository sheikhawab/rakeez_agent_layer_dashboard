import { mockCalls } from './calls'
import type { APIUsage } from '@/types/cost'

/**
 * Daily API usage aggregated per company. Computed from `mockCalls` so the
 * numbers stay consistent with what the Calls list / Call detail shows.
 */
function aggregateByDay(): APIUsage[] {
  const byKey = new Map<string, APIUsage>()

  for (const call of mockCalls) {
    if (call.status === 'in-progress') continue
    const date = call.startedAt.slice(0, 10) // YYYY-MM-DD
    const key = `${call.companyId}::${date}`

    const existing: APIUsage = byKey.get(key) ?? {
      date,
      companyId: call.companyId,
      sttMinutes: 0,
      llmInputTokens: 0,
      llmOutputTokens: 0,
      ttsChars: 0,
      livekitMinutes: 0,
      whatsappMessages: 0,
      totalCost: 0,
    }

    const minutes = call.durationSec / 60
    existing.sttMinutes += minutes
    // Reverse-engineer approximate token / TTS char counts from call cost shape
    // (close enough for charts; real backend will provide exact values).
    existing.llmInputTokens += Math.round(minutes * 4 * 260)
    existing.llmOutputTokens += Math.round(minutes * 4 * 85)
    existing.ttsChars += Math.round(minutes * 4 * 130)
    existing.livekitMinutes += minutes * 2
    if (call.cost.whatsapp > 0) existing.whatsappMessages += 1
    existing.totalCost += call.cost.total

    byKey.set(key, existing)
  }

  return [...byKey.values()].sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0,
  )
}

export const mockUsage: APIUsage[] = aggregateByDay()
