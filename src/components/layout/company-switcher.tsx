import { useState } from 'react'
import { Building2, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useCompanies } from '@/hooks/use-companies'
import { useSelectedCompany } from '@/store/selected-company'
import { CompanyCardRow } from './company-card-row'

export function CompanySwitcher() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  const { selectedCompanyId, setSelectedCompany } = useSelectedCompany()
  const { data: companies = [] } = useCompanies()
  const selected =
    selectedCompanyId === 'all'
      ? null
      : companies.find((c) => c.id === selectedCompanyId)

  const aggregate = {
    totalCalls: companies.reduce((s, c) => s + (c.todaysCalls ?? 0), 0),
    totalCost: companies.reduce((s, c) => s + (c.todaysCost ?? 0), 0),
    count: companies.length,
  }

  const selectedLabel = selected ? selected.business_name : t('companies.all')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label={t('companies.switchCompany')}
          className="h-8 gap-2 px-2.5 font-medium"
        >
          {!selected && <Building2 className="h-3.5 w-3.5 opacity-70" />}
          <span className="max-w-[160px] truncate">
            <bdi>{selectedLabel}</bdi>
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start" sideOffset={6}>
        <Command>
          <CommandInput placeholder={t('companies.searchPlaceholder')} />
          <CommandList>
            <CommandEmpty>{t('common.noData')}</CommandEmpty>
            <CommandGroup>
              <CompanyCardRow
                company={null}
                aggregate={aggregate}
                isSelected={selectedCompanyId === 'all'}
                onSelect={() => {
                  if (selectedCompanyId !== 'all') {
                    setSelectedCompany('all')
                    toast.success(t('companies.switchedToAll'))
                  }
                  setOpen(false)
                }}
              />
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              {companies.map((company) => (
                <CompanyCardRow
                  key={company.id}
                  company={company}
                  isSelected={selectedCompanyId === company.id}
                  onSelect={() => {
                    if (selectedCompanyId !== company.id) {
                      setSelectedCompany(company.id)
                      toast.success(t('companies.switchedTo', { name: company.business_name }))
                    }
                    setOpen(false)
                  }}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
