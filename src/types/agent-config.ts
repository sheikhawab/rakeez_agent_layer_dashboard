export type LLMProvider = 'openai' | 'groq'
export type STTProvider = 'openai' | 'deepgram'
export type TTSProvider = 'elevenlabs' | 'cartesia'

export type AgentConfig = {
  companyId: string
  llm: {
    provider: LLMProvider
    model: string
    temperature: number
    maxTokens: number
  }
  stt: {
    provider: STTProvider
    model: string
    serverVadThreshold: number
  }
  tts: {
    provider: TTSProvider
    model: string
    voiceIdAr: string
    voiceIdEn: string
  }
  vad: {
    sileroActivationThreshold: number
    minInterruptionDurationSec: number
    minInterruptionWords: number
  }
  callLimits: {
    maxDurationSec: number
    endpointingDelaySec: number
  }
}
