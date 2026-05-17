import { MessageSquare, Mic, Radio } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { IntegrationCard } from '@/components/settings/integration-card'
import { PageHeader } from '@/components/shared/page-header'
import { SelectCompanyPrompt } from '@/components/shared/select-company-prompt'
import { useSelectedCompany } from '@/store/selected-company'

export function IntegrationsPage() {
  const { t } = useTranslation()
  const { selectedCompanyId } = useSelectedCompany()

  if (selectedCompanyId === 'all') {
    return <SelectCompanyPrompt feature={t('nav.integrations')} />
  }

  const notImplemented = () => toast.info('Backend integration arrives in Phase 6.')

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <PageHeader title={t('nav.integrations')} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <IntegrationCard
          icon={MessageSquare}
          name="WhatsApp Cloud API"
          description="Send booking confirmations via Meta Cloud API."
          status="connected"
          details={[
            { label: 'Phone ID', value: '·····7821' },
            { label: 'API version', value: 'v21.0' },
            { label: 'Recipient', value: '+966 ··· ···· 4567' },
          ]}
          onConfigure={notImplemented}
          onDisconnect={notImplemented}
        />
        <IntegrationCard
          icon={Radio}
          name="LiveKit"
          description="Real-time voice streaming infrastructure."
          status="connected"
          details={[
            { label: 'URL', value: 'wss://···.livekit.cloud' },
            { label: 'API key', value: 'API···········' },
          ]}
          onConfigure={notImplemented}
          onDisconnect={notImplemented}
        />
        <IntegrationCard
          icon={Mic}
          name="HubSpot CRM"
          description="Sync bookings to CRM contacts and pipelines."
          status="not-connected"
          onConnect={notImplemented}
        />
      </div>
    </div>
  )
}
