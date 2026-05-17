import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { AppSidebar } from './app-sidebar'
import { AppTopbar } from './app-topbar'

export function AppShell() {
  const { t } = useTranslation()
  return (
    <SidebarProvider defaultOpen>
      <a
        href="#main-content"
        className="bg-primary text-primary-foreground sr-only z-50 rounded-md px-3 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:inset-s-3 focus:top-3"
      >
        {t('a11y.skipToContent')}
      </a>
      <AppSidebar />
      <SidebarInset>
        <AppTopbar />
        <main id="main-content" className="flex-1 overflow-auto" tabIndex={-1}>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
