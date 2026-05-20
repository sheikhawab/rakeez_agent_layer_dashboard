export type Company = {
  id: string
  business_name: string
  /** Mini-stats shown in company switcher rows (computed; will come from backend) */
  todaysCalls?: number
  todaysCost?: number
  status?: 'active' | 'paused' | 'suspended'
}

export type CompanyCreate = {
  slug: string
  business_name: string
  system_prompt: string
  tts_voice_id_ar: string
  tts_voice_id_en: string
  language_prompt?: string
  tts_default_language?: 'ar' | 'en'
  tts_model?: string
  llm_model?: string
  stt_model?: string
  whatsapp_phone_to?: string
  whatsapp_template_name?: string
  currency?: string
  timezone?: string
  max_call_seconds?: number
  max_concurrent_calls?: number
  monthly_budget_usd?: number
  status?: 'active' | 'paused' | 'suspended'
}
