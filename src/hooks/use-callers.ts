import { useQuery } from '@tanstack/react-query'

import type { CallerFilters } from '@/data/client'
import { dataClient } from '@/data/client'
import { useSelectedCompany } from '@/store/selected-company'

export function useCallers(filters: Omit<CallerFilters, 'companyId'> = {}) {
  const { selectedCompanyId } = useSelectedCompany()
  return useQuery({
    queryKey: ['callers', selectedCompanyId, filters],
    queryFn: () =>
      dataClient.getCallers({ ...filters, companyId: selectedCompanyId }),
  })
}

export function useCaller(id: string | undefined) {
  return useQuery({
    queryKey: ['caller', id],
    queryFn: () => (id ? dataClient.getCaller(id) : undefined),
    enabled: Boolean(id),
  })
}
