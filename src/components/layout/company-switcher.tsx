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
import { cn } from '@/lib/utils'
import { allCompaniesAggregate, mockCompanies } from '@/mocks/companies'
import { useSelectedCompany } from '@/store/selected-company'
import { CompanyCardRow } from './company-card-row'

export function CompanySwitcher() {
  const [open, setOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const { selectedCompanyId, setSelectedCompany } = useSelectedCompany()
  const selected =
    selectedCompanyId === 'all'
      ? null
      : mockCompanies.find((c) => c.id === selectedCompanyId)

  const selectedLabel = selected
    ? isArabic && selected.nameAr
      ? selected.nameAr
      : selected.name
    : t('companies.all')

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
          <span
            aria-hidden
            className={cn(
              'h-2 w-2 rounded-full',
              !selected?.brand?.color && 'bg-muted-foreground/40',
            )}
            style={
              selected?.brand?.color
                ? { backgroundColor: selected.brand.color }
                : undefined
            }
          />
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
                aggregate={allCompaniesAggregate}
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
              {mockCompanies.map((company) => (
                <CompanyCardRow
                  key={company.id}
                  company={company}
                  isSelected={selectedCompanyId === company.id}
                  onSelect={() => {
                    if (selectedCompanyId !== company.id) {
                      setSelectedCompany(company.id)
                      const name =
                        isArabic && company.nameAr ? company.nameAr : company.name
                      toast.success(t('companies.switchedTo', { name }))
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
