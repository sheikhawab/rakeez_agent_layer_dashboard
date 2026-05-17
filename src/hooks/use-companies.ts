import { useQuery } from '@tanstack/react-query'

import { dataClient } from '@/data/client'

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: () => dataClient.getCompanies(),
  })
}

export function useCompany(id: string | undefined) {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => (id ? dataClient.getCompany(id) : undefined),
    enabled: Boolean(id),
  })
}
