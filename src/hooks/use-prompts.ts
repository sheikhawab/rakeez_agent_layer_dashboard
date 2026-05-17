import { useQuery } from '@tanstack/react-query'

import { dataClient } from '@/data/client'

export function usePrompts(companyId: string | undefined) {
  return useQuery({
    queryKey: ['prompts', companyId],
    queryFn: () => (companyId ? dataClient.getPrompts(companyId) : []),
    enabled: Boolean(companyId),
  })
}

export function useAgentConfig(companyId: string | undefined) {
  return useQuery({
    queryKey: ['agent-config', companyId],
    queryFn: () =>
      companyId ? dataClient.getAgentConfig(companyId) : undefined,
    enabled: Boolean(companyId),
  })
}
