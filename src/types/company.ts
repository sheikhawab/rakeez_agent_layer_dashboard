export type Company = {
  id: string
  business_name: string
  /** Mini-stats shown in company switcher rows (computed; will come from backend) */
  todaysCalls?: number
  todaysCost?: number
  status?: 'active' | 'paused' | 'suspended'
}
