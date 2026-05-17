import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

import { Breadcrumbs } from './breadcrumbs'
import { CommandPalette } from './command-palette'
import { CompanySwitcher } from './company-switcher'
import { LanguageToggle } from './language-toggle'
import { ThemeToggle } from './theme-toggle'

export function AppTopbar() {
  const { t } = useTranslation()

  return (
    <header className="bg-background sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-3 sm:px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <Breadcrumbs />

      <div className="ms-auto flex items-center gap-1.5">
        <CompanySwitcher />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <CommandPalette />
        <LanguageToggle />
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label={t('topbar.notifications')}
        >
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
