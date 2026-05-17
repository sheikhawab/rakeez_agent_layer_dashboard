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
import { cn } from '@/lib/utils'
import { allCompaniesAggregate, mockCompanies } from '@/mocks/companies'
import { useSelectedCompany } from '@/store/selected-company'

function CurrentlyViewing() {
  const { t, i18n } = useTranslation()
  const { selectedCompanyId } = useSelectedCompany()
  const isArabic = i18n.language === 'ar'

  const selected =
    selectedCompanyId === 'all'
      ? null
      : mockCompanies.find((c) => c.id === selectedCompanyId)

  const name = selected
    ? isArabic && selected.nameAr
      ? selected.nameAr
      : selected.name
    : t('companies.all')

  const calls = selected?.todaysCalls ?? allCompaniesAggregate.totalCalls
  const cost = selected?.todaysCost ?? allCompaniesAggregate.totalCost
  const brandColor = selected?.brand?.color

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] tracking-wider uppercase">
        {t('companies.currentlyViewing')}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="flex items-start gap-2 px-2 py-1.5">
          <span
            aria-hidden
            className={cn(
              'mt-1.5 h-2 w-2 shrink-0 rounded-full',
              !brandColor && 'bg-muted-foreground/50',
            )}
            style={brandColor ? { backgroundColor: brandColor } : undefined}
          />
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
