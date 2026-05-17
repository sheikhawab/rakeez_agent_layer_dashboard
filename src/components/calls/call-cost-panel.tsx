import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CostBreakdownPie } from '@/components/charts/cost-breakdown-pie'
import type { CostBreakdown } from '@/types/cost'

export function CallCostPanel({ breakdown }: { breakdown: CostBreakdown }) {
  const { t } = useTranslation()
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {t('calls.cost')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CostBreakdownPie breakdown={breakdown} size={120} />
      </CardContent>
    </Card>
  )
}
