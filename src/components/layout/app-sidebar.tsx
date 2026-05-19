import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import type { NavItem as NavItemConfig } from '@/lib/nav-config'
import { navConfig } from '@/lib/nav-config'
import { useCompanies } from '@/hooks/use-companies'
import { useSelectedCompany } from '@/store/selected-company'

function CurrentlyViewing() {
  const { t } = useTranslation()
  const { selectedCompanyId } = useSelectedCompany()
  const { data: companies = [] } = useCompanies()

  const selected =
    selectedCompanyId === 'all'
      ? null
      : companies.find((c) => c.id === selectedCompanyId)

  const name = selected ? selected.business_name : t('companies.all')

  const totalCalls = companies.reduce((s, c) => s + (c.todaysCalls ?? 0), 0)
  const totalCost = companies.reduce((s, c) => s + (c.todaysCost ?? 0), 0)
  const calls = selected?.todaysCalls ?? totalCalls
  const cost = selected?.todaysCost ?? totalCost

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] tracking-wider uppercase">
        {t('companies.currentlyViewing')}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="flex items-start gap-2 px-2 py-1.5">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-sm font-medium">
              <bdi>{name}</bdi>
            </span>
            <span className="text-muted-foreground text-[11px] tabular-nums">
              {calls} · ${cost.toFixed(2)} / {(cost * 3.75).toFixed(2)} SAR
            </span>
          </div>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function NavRow({ item }: { item: NavItemConfig }) {
  const { t } = useTranslation()
  const location = useLocation()
  const isActive =
    item.to === '/'
      ? location.pathname === '/'
      : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)

  const Icon = item.icon
  const label = t(`nav.${item.labelKey}`)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
        <NavLink to={item.to} end={item.to === '/'}>
          <Icon />
          <span>{label}</span>
        </NavLink>
      </SidebarMenuButton>
      {item.badge === 'live' && (
        <SidebarMenuBadge>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
        </SidebarMenuBadge>
      )}
      {typeof item.badge === 'string' && item.badge !== 'live' && (
        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  )
}

export function AppSidebar() {
  const { t, i18n } = useTranslation()
  const side: 'left' | 'right' = i18n.language === 'ar' ? 'right' : 'left'

  return (
    <Sidebar side={side} collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-md text-sm font-semibold">
            M
          </div>
          <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">
            {t('app.name')}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="group-data-[collapsible=icon]:hidden">
          <CurrentlyViewing />
        </div>
        <SidebarSeparator />

        {navConfig.map((group) => (
          <SidebarGroup key={group.labelKey}>
            <SidebarGroupLabel>{t(`nav.${group.labelKey}`)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <NavRow key={item.to} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <span className="text-muted-foreground px-2 text-[10px] group-data-[collapsible=icon]:hidden">
          ⌘B to toggle
        </span>
      </SidebarFooter>
    </Sidebar>
  )
}
