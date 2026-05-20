import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Phone,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Bot,
  Plug,
  Settings,
  Building2,
} from 'lucide-react'

export type NavItem = {
  to: string
  icon: LucideIcon
  /** i18n key under `nav.*` namespace */
  labelKey: string
  /** Optional badge — 'live' renders pulsing dot, string renders count badge */
  badge?: 'live' | string
}

export type NavGroup = {
  /** i18n key under `nav.*` */
  labelKey: string
  items: NavItem[]
}

export const navConfig: NavGroup[] = [
  {
    labelKey: 'insights',
    items: [
      { to: '/', icon: LayoutDashboard, labelKey: 'overview' },
      { to: '/calls', icon: Phone, labelKey: 'calls', badge: 'live' },
      { to: '/callers', icon: Users, labelKey: 'callers' },
      { to: '/bookings', icon: Calendar, labelKey: 'bookings' },
      { to: '/costs', icon: DollarSign, labelKey: 'costs' },
    ],
  },
  {
    labelKey: 'configuration',
    items: [
      { to: '/prompts', icon: FileText, labelKey: 'prompts' },
      { to: '/agent', icon: Bot, labelKey: 'agent' },
      { to: '/integrations', icon: Plug, labelKey: 'integrations' },
      { to: '/settings', icon: Settings, labelKey: 'settings' },
      { to: '/companies/new', icon: Building2, labelKey: 'companies' },
    ],
  },
]
