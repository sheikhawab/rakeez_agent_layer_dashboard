import type { Company } from '@/types/company'

/**
 * Phase 1 mock companies. Phase 2 will expand each with full agent config,
 * system prompts, integrations, etc. For now just enough to test the
 * Company Switcher UI.
 */
export const mockCompanies: Company[] = [
  {
    id: 'rakeez-sales',
    name: 'Rakeez Sales',
    nameAr: 'ركيز سيلز',
    brand: { color: '#0ea5e9' },
    todaysCalls: 47,
    todaysCost: 5.2,
    status: 'active',
  },
  {
    id: 'client-alpha',
    name: 'Client Alpha',
    nameAr: 'العميل ألفا',
    brand: { color: '#10b981' },
    todaysCalls: 32,
    todaysCost: 3.84,
    status: 'active',
  },
  {
    id: 'client-beta',
    name: 'Client Beta',
    nameAr: 'العميل بيتا',
    brand: { color: '#f59e0b' },
    todaysCalls: 18,
    todaysCost: 1.92,
    status: 'active',
  },
  {
    id: 'client-gamma',
    name: 'Client Gamma',
    nameAr: 'العميل غاما',
    brand: { color: '#8b5cf6' },
    todaysCalls: 9,
    todaysCost: 0.84,
    status: 'active',
  },
  {
    id: 'client-delta',
    name: 'Client Delta',
    nameAr: 'العميل دلتا',
    brand: { color: '#ef4444' },
    todaysCalls: 4,
    todaysCost: 0.4,
    status: 'paused',
  },
  {
    id: 'client-epsilon',
    name: 'Client Epsilon',
    nameAr: 'العميل إبسيلون',
    brand: { color: '#ec4899' },
    todaysCalls: 6,
    todaysCost: 0.92,
    status: 'active',
  },
]

/** Aggregate stats across all companies (for "All Companies" view) */
export const allCompaniesAggregate = {
  totalCalls: mockCompanies.reduce((sum, c) => sum + (c.todaysCalls ?? 0), 0),
  totalCost: mockCompanies.reduce((sum, c) => sum + (c.todaysCost ?? 0), 0),
  count: mockCompanies.length,
}
