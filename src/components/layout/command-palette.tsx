import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { navConfig } from '@/lib/nav-config'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate()

  // ⌘K / Ctrl+K to open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const goTo = (to: string) => {
    navigate(to)
    setOpen(false)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={t('topbar.search')}
        className="text-muted-foreground h-8 gap-2 px-2.5 font-normal"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t('topbar.search')}</span>
        <kbd className="bg-muted ms-1 hidden rounded px-1.5 py-0.5 text-[10px] font-medium sm:inline">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t('topbar.searchPlaceholder')} />
        <CommandList>
          <CommandEmpty>{t('common.noData')}</CommandEmpty>
          {navConfig.map((group) => (
            <CommandGroup key={group.labelKey} heading={t(`nav.${group.labelKey}`)}>
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <CommandItem
                    key={item.to}
                    value={t(`nav.${item.labelKey}`)}
                    onSelect={() => goTo(item.to)}
                  >
                    <Icon className="me-2 h-4 w-4" />
                    <span>{t(`nav.${item.labelKey}`)}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
