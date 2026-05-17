import type { AgentConfig } from '@/types/agent-config'

const defaults: Omit<AgentConfig, 'companyId'> = {
  llm: {
    provider: 'openai',
    model: 'gpt-4.1-mini',
    temperature: 0.7,
    maxTokens: 500,
  },
  stt: {
    provider: 'openai',
    model: 'gpt-4o-mini-transcribe',
    serverVadThreshold: 0.88,
  },
  tts: {
    provider: 'elevenlabs',
    model: 'eleven_multilingual_v2',
    voiceIdAr: 'gVzwmdZzRgBrNjXaTmi5',
    voiceIdEn: 'gVzwmdZzRgBrNjXaTmi5',
  },
  vad: {
    sileroActivationThreshold: 0.82,
    minInterruptionDurationSec: 0.5,
    minInterruptionWords: 3,
  },
  callLimits: {
    maxDurationSec: 300,
    endpointingDelaySec: 0.6,
  },
}

/**
 * Per-company agent configurations. Seeded from
 * `Ai_voice_Agent_without_RAG/.env.example` and `livekit_basic_agent.py`.
 */
export const mockAgentConfigs: AgentConfig[] = [
  { companyId: 'rakeez-sales', ...defaults },
  {
    companyId: 'client-alpha',
    ...defaults,
    llm: { ...defaults.llm, temperature: 0.6 },
  },
  {
    companyId: 'client-beta',
    ...defaults,
    callLimits: { ...defaults.callLimits, maxDurationSec: 420 },
  },
  { companyId: 'client-gamma', ...defaults },
  {
    companyId: 'client-delta',
    ...defaults,
    llm: { ...defaults.llm, model: 'gpt-4.1-nano' },
  },
  {
    companyId: 'client-epsilon',
    ...defaults,
    callLimits: { ...defaults.callLimits, maxDurationSec: 900 },
    llm: { ...defaults.llm, maxTokens: 800 },
  },
]
