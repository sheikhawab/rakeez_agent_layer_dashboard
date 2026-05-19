import { Building2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCompanies } from '@/hooks/use-companies'
import { useSelectedCompany } from '@/store/selected-company'

export function SelectCompanyPrompt({ feature }: { feature: string }) {
  const { t } = useTranslation()
  const { setSelectedCompany } = useSelectedCompany()
  const { data: companies = [] } = useCompanies()

  return (
    <div className="flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardContent className="space-y-5 py-8 text-center">
          <div className="bg-muted/60 text-muted-foreground mx-auto flex h-14 w-14 items-center justify-center rounded-full">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">
              {t('selectCompany.title', { feature })}
            </h2>
            <p className="text-muted-foreground text-sm">
              {t('selectCompany.description', { feature })}
            </p>
          </div>
          <div className="mx-auto flex max-w-md flex-wrap justify-center gap-2 pt-2">
            {companies.map((company) => (
              <Button
                key={company.id}
                variant="outline"
                size="sm"
                onClick={() => setSelectedCompany(company.id)}
              >
                <bdi>{company.business_name}</bdi>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
