import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type Crumb = { to?: string; labelKey?: string; rawLabel?: string }

/** Maps a pathname into breadcrumb segments. */
function buildCrumbs(pathname: string, params: Record<string, string | undefined>): Crumb[] {
  if (pathname === '/') return [{ labelKey: 'overview' }]

  const segments = pathname.split('/').filter(Boolean)
  const crumbs: Crumb[] = []

  // First segment maps to a nav item label
  const first = segments[0]
  const firstLabelMap: Record<string, string> = {
    calls: 'calls',
    callers: 'callers',
    bookings: 'bookings',
    costs: 'costs',
    prompts: 'prompts',
    agent: 'agent',
    integrations: 'integrations',
    settings: 'settings',
  }
  if (firstLabelMap[first]) {
    crumbs.push({ to: `/${first}`, labelKey: firstLabelMap[first] })
  }

  // Second segment: dynamic ID or sub-route
  if (segments.length > 1) {
    const second = segments[1]
    if (second === 'calendar') {
      crumbs.push({ rawLabel: 'Calendar' })
    } else if (params.id) {
      crumbs.push({ rawLabel: params.id })
    } else {
      crumbs.push({ rawLabel: second })
    }
  }

  return crumbs
}

export function Breadcrumbs() {
  const { t } = useTranslation()
  const location = useLocation()
  const params = useParams()
  const crumbs = buildCrumbs(location.pathname, params)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1
          const label = crumb.labelKey ? t(`nav.${crumb.labelKey}`) : crumb.rawLabel ?? ''

          return (
            <Fragment key={`${crumb.to ?? crumb.rawLabel ?? 'crumb'}-${index}`}>
              <BreadcrumbItem>
                {isLast || !crumb.to ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.to}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
