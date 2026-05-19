import type { Company } from '@/types/company'

/**
 * Phase 1 mock companies. Phase 2 will expand each with full agent config,
 * system prompts, integrations, etc. For now just enough to test the
 * Company Switcher UI.
 */
export const mockCompanies: Company[] = [
  {
    id: 'rakeez-sales',
    business_name: 'Rakeez Sales',
    todaysCalls: 47,
    todaysCost: 5.2,
    status: 'active',
  },
  {
    id: 'client-alpha',
    business_name: 'Client Alpha',
    todaysCalls: 32,
    todaysCost: 3.84,
    status: 'active',
  },
  {
    id: 'client-beta',
    business_name: 'Client Beta',
    todaysCalls: 18,
    todaysCost: 1.92,
    status: 'active',
  },
  {
    id: 'client-gamma',
    business_name: 'Client Gamma',
    todaysCalls: 9,
    todaysCost: 0.84,
    status: 'active',
  },
  {
    id: 'client-delta',
    business_name: 'Client Delta',
    todaysCalls: 4,
    todaysCost: 0.4,
    status: 'paused',
  },
  {
    id: 'client-epsilon',
    business_name: 'Client Epsilon',
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
