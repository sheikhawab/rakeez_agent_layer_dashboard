import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { mockCompanies } from '@/mocks/companies'

/**
 * Compact company indicator with brand color dot. Shown in tables / activity
 * feed when scope is "All Companies" so user can tell which company a row
 * belongs to.
 */
export function CompanyBadge({
  companyId,
  className,
}: {
  companyId: string
  className?: string
}) {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const company = mockCompanies.find((c) => c.id === companyId)
  if (!company) return null

  const name = isArabic && company.nameAr ? company.nameAr : company.name
  const color = company.brand?.color

  return (
    <Badge
      variant="outline"
      className={cn(
        'border-muted-foreground/20 bg-muted/40 gap-1.5 font-normal',
        className,
      )}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color ?? 'var(--color-muted-foreground)' }}
      />
      <bdi className="truncate max-w-[120px]">{name}</bdi>
    </Badge>
  )
}
