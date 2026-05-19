import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useCompanies } from '@/hooks/use-companies'

export function CompanyBadge({
  companyId,
  className,
}: {
  companyId: string
  className?: string
}) {
  const { data: companies = [] } = useCompanies()
  const company = companies.find((c) => c.id === companyId)
  if (!company) return null

  return (
    <Badge
      variant="outline"
      className={cn(
        'border-muted-foreground/20 bg-muted/40 gap-1.5 font-normal',
        className,
      )}
    >
      <bdi className="truncate max-w-[120px]">{company.business_name}</bdi>
    </Badge>
  )
}
