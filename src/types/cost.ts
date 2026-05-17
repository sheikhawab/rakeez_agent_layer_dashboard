export type CostBreakdown = {
  /** Total in USD */
  total: number
  stt: number
  llm: { input: number; output: number; total: number }
  tts: number
  livekit: number
  whatsapp: number
}

export type APIUsage = {
  /** YYYY-MM-DD */
  date: string
  companyId: string
  sttMinutes: number
  llmInputTokens: number
  llmOutputTokens: number
  ttsChars: number
  livekitMinutes: number
  whatsappMessages: number
  /** Computed total cost in USD */
  totalCost: number
}
