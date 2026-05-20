import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { dataClient } from '@/data/client'
import type { CompanyCreate } from '@/types/company'

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

export function useCreateCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CompanyCreate) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })
}
