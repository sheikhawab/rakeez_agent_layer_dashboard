import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { CostPill } from '@/components/shared/cost-pill'
import { mockCompanies } from '@/mocks/companies'
import { useSelectedCompany } from '@/store/selected-company'

type TopCompaniesCardProps = {
  /** Already aggregated: companyId → { calls, cost } */
  data:
    | Array<{ companyId: string; calls: number; cost: number }>
    | undefined
  isLoading: boolean
}

export function TopCompaniesCard({ data, isLoading }: TopCompaniesCardProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const { setSelectedCompany } = useSelectedCompany()

  const ranked = data
    ?.slice()
    .sort((a, b) => b.calls - a.calls)
    .slice(0, 5)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          {t('overview.topCompanies')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {isLoading || !ranked ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-full" />
            ))}
          </>
        ) : ranked.length === 0 ? (
          <div className="text-muted-foreground py-4 text-center text-xs">
            {t('common.noData')}
          </div>
        ) : (
          ranked.map((row, i) => {
            const company = mockCompanies.find((c) => c.id === row.companyId)
            if (!company) return null
            const name = isArabic && company.nameAr ? company.nameAr : company.name
            return (
              <Button
                key={row.companyId}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCompany(row.companyId)}
                className="h-auto w-full justify-between px-2 py-1.5 font-normal"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="text-muted-foreground w-4 text-right text-[10px] tabular-nums">
                    {i + 1}.
                  </span>
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: company.brand?.color }}
                  />
                  <bdi className="truncate text-sm">{name}</bdi>
                </span>
                <span className="text-muted-foreground flex items-center gap-3 text-xs tabular-nums">
                  <span>{row.calls}</span>
                  <CostPill usd={row.cost} variant="usd-only" />
                </span>
              </Button>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
