import { useQuery } from '@tanstack/react-query'

import type { CallFilters } from '@/data/client'
import { dataClient } from '@/data/client'
import { useSelectedCompany } from '@/store/selected-company'

/**
 * Scope-aware calls list hook. Reads selected company from Zustand and
 * applies it as `companyId` filter unless caller explicitly overrides.
 */
export function useCalls(filters: Omit<CallFilters, 'companyId'> = {}) {
  const { selectedCompanyId } = useSelectedCompany()
  return useQuery({
    queryKey: ['calls', selectedCompanyId, filters],
    queryFn: () =>
      dataClient.getCalls({ ...filters, companyId: selectedCompanyId }),
  })
}

export function useCall(id: string | undefined) {
  return useQuery({
    queryKey: ['call', id],
    queryFn: () => (id ? dataClient.getCall(id) : undefined),
    enabled: Boolean(id),
  })
}

export function useTranscript(id: string | undefined) {
  return useQuery({
    queryKey: ['transcript', id],
    queryFn: () => (id ? dataClient.getTranscript(id) : undefined),
    enabled: Boolean(id),
  })
}
