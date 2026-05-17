import { API_PRICING, type LLMModel } from './pricing'
import type { CostBreakdown } from '@/types/cost'

export type CallUsage = {
  /** Total audio duration in seconds */
  audioSeconds: number
  llmModel: LLMModel
  llmInputTokens: number
  llmOutputTokens: number
  ttsChars: number
  /** Participant-minutes (caller + agent typically 2x audioMinutes) */
  livekitParticipantMinutes: number
  whatsappMessages?: {
    template: number
    freeForm: number
  }
}

export function computeCallCost(usage: CallUsage): CostBreakdown {
  const audioMinutes = usage.audioSeconds / 60
  const stt = audioMinutes * API_PRICING.openai.stt.perMinute

  const llmRates = API_PRICING.openai.llm[usage.llmModel]
  const llmInput = (usage.llmInputTokens / 1_000_000) * llmRates.inputPer1M
  const llmOutput = (usage.llmOutputTokens / 1_000_000) * llmRates.outputPer1M

  const tts = (usage.ttsChars / 1000) * API_PRICING.elevenlabs.tts.per1kChars
  const livekit =
    usage.livekitParticipantMinutes * API_PRICING.livekit.perParticipantMinute

  const whatsapp =
    (usage.whatsappMessages?.template ?? 0) * API_PRICING.whatsapp.template +
    (usage.whatsappMessages?.freeForm ?? 0) * API_PRICING.whatsapp.freeForm

  const total = stt + llmInput + llmOutput + tts + livekit + whatsapp

  return {
    total,
    stt,
    llm: { input: llmInput, output: llmOutput, total: llmInput + llmOutput },
    tts,
    livekit,
    whatsapp,
  }
}
