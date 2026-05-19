import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { CommandItem } from '@/components/ui/command'
import type { Company } from '@/types/company'

type CompanyCardRowProps = {
  /** Pass null for the "All Companies" virtual entry */
  company: Company | null
  /** Aggregate stats (used when company is null) */
  aggregate?: { totalCalls: number; totalCost: number }
  isSelected: boolean
  onSelect: () => void
}

export function CompanyCardRow({
  company,
  aggregate,
  isSelected,
  onSelect,
}: CompanyCardRowProps) {
  const { t } = useTranslation()

  const name = company ? company.business_name : t('companies.all')

  const calls = company?.todaysCalls ?? aggregate?.totalCalls ?? 0
  const cost = company?.todaysCost ?? aggregate?.totalCost ?? 0

  return (
    <CommandItem
      value={company?.id ?? 'all'}
      keywords={[name]}
      onSelect={onSelect}
      className="flex items-start gap-3 py-2.5"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium">
          <bdi>{name}</bdi>
        </span>
        <span className="text-muted-foreground text-xs tabular-nums">
          {calls} {t('nav.calls').toLowerCase()} · ${cost.toFixed(2)} /{' '}
          {(cost * 3.75).toFixed(2)} SAR
        </span>
      </div>
      {isSelected && (
        <Check className="text-muted-foreground mt-1 h-4 w-4 shrink-0" />
      )}
    </CommandItem>
  )
}
