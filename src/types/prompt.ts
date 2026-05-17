export type PromptLanguage = 'ar' | 'en' | 'shared'

export type SystemPrompt = {
  id: string
  companyId: string
  /** Logical name e.g. "main", "language_switch", "booking_flow" */
  name: string
  language: PromptLanguage
  content: string
  version: number
  isActive: boolean
  updatedAt: string
  updatedBy: string
}
