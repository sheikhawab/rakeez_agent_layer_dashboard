/**
 * API pricing constants (USD).
 *
 * Source: official provider pricing as of 2026-05.
 * Editable later via the Settings page (overrides persist to localStorage).
 *
 * NOTE: For SAR display, multiply USD by `USD_TO_SAR`.
 */

export const USD_TO_SAR = 3.75

export const API_PRICING = {
  openai: {
    stt: {
      /** Per minute of audio transcribed */
      perMinute: 0.006,
    },
    llm: {
      'gpt-4.1-mini': { inputPer1M: 0.4, outputPer1M: 1.6 },
      'gpt-4.1-nano': { inputPer1M: 0.1, outputPer1M: 0.4 },
    } as const,
  },
  elevenlabs: {
    tts: {
      /** Per 1000 characters synthesized */
      per1kChars: 0.3,
    },
  },
  livekit: {
    /** Per participant-minute */
    perParticipantMinute: 0.0005,
  },
  whatsapp: {
    /** Per message via approved template (works 24/7) */
    template: 0.0145,
    /** Per message via free-form text (only within 24h window) */
    freeForm: 0.0083,
  },
} as const

export type LLMModel = keyof typeof API_PRICING.openai.llm
