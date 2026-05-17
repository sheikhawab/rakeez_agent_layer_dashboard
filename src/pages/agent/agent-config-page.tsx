import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { AgentConfigForm } from '@/components/settings/agent-config-form'
import { PageHeader } from '@/components/shared/page-header'
import { SelectCompanyPrompt } from '@/components/shared/select-company-prompt'
import { useAgentConfig } from '@/hooks/use-prompts'
import { useSelectedCompany } from '@/store/selected-company'

export function AgentConfigPage() {
  const { t } = useTranslation()
  const { selectedCompanyId } = useSelectedCompany()

  if (selectedCompanyId === 'all') {
    return <SelectCompanyPrompt feature={t('nav.agent')} />
  }

  return <AgentConfigWorkspace companyId={selectedCompanyId} />
}

function AgentConfigWorkspace({ companyId }: { companyId: string }) {
  const { t } = useTranslation()
  const { data: config, isLoading } = useAgentConfig(companyId)

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <PageHeader title={t('nav.agent')} />

      {isLoading || !config ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : (
        <AgentConfigForm config={config} />
      )}
    </div>
  )
}
