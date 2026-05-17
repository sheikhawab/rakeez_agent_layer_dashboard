export type Company = {
  id: string
  name: string
  nameAr?: string
  /** Brand visuals — used as accent color in switcher, indicator, badges */
  brand?: {
    color?: string
    logoUrl?: string
  }
  /** Mini-stats shown in company switcher rows (computed; will come from backend) */
  todaysCalls?: number
  todaysCost?: number
  status?: 'active' | 'paused'
}
