import { useQuery } from '@tanstack/react-query'

import type { CostFilters } from '@/data/client'
import { dataClient } from '@/data/client'
import { useSelectedCompany } from '@/store/selected-company'

export function useUsage(filters: Omit<CostFilters, 'companyId'> = {}) {
  const { selectedCompanyId } = useSelectedCompany()
  return useQuery({
    queryKey: ['usage', selectedCompanyId, filters],
    queryFn: () =>
      dataClient.getUsage({ ...filters, companyId: selectedCompanyId }),
  })
}

export function useOverviewStats(filters: Omit<CostFilters, 'companyId'> = {}) {
  const { selectedCompanyId } = useSelectedCompany()
  return useQuery({
    queryKey: ['overview', selectedCompanyId, filters],
    queryFn: () =>
      dataClient.getOverviewStats({
        ...filters,
        companyId: selectedCompanyId,
      }),
  })
}
