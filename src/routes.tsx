import { createBrowserRouter } from 'react-router-dom'

import { AppShell } from '@/components/layout/app-shell'
import { RouteErrorBoundary } from '@/components/shared/error-boundary'

import { OverviewPage } from './pages/overview/overview-page'
import { CallsListPage } from './pages/calls/calls-list-page'
import { CallDetailPage } from './pages/calls/call-detail-page'
import { CallersListPage } from './pages/callers/callers-list-page'
import { CallerDetailPage } from './pages/callers/caller-detail-page'
import { BookingsListPage } from './pages/bookings/bookings-list-page'
import { BookingsCalendarPage } from './pages/bookings/bookings-calendar-page'
import { CostsPage } from './pages/costs/costs-page'
import { PromptsPage } from './pages/prompts/prompts-page'
import { AgentConfigPage } from './pages/agent/agent-config-page'
import { IntegrationsPage } from './pages/integrations/integrations-page'
import { SettingsPage } from './pages/settings/settings-page'
import { CompaniesNewPage } from './pages/companies/companies-new-page'
import { NotFoundPage } from './pages/not-found-page'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '/', element: <OverviewPage />, errorElement: <RouteErrorBoundary /> },
      { path: '/calls', element: <CallsListPage />, errorElement: <RouteErrorBoundary /> },
      { path: '/calls/:id', element: <CallDetailPage />, errorElement: <RouteErrorBoundary /> },
      { path: '/callers', element: <CallersListPage />, errorElement: <RouteErrorBoundary /> },
      { path: '/callers/:id', element: <CallerDetailPage />, errorElement: <RouteErrorBoundary /> },
      { path: '/bookings', element: <BookingsListPage />, errorElement: <RouteErrorBoundary /> },
      { path: '/bookings/calendar', element: <BookingsCalendarPage />, errorElement: <RouteErrorBoundary /> },
      { path: '/costs', element: <CostsPage />, errorElement: <RouteErrorBoundary /> },
      { path: '/prompts', element: <PromptsPage />, errorElement: <RouteErrorBoundary /> },
      { path: '/agent', element: <AgentConfigPage />, errorElement: <RouteErrorBoundary /> },
      { path: '/integrations', element: <IntegrationsPage />, errorElement: <RouteErrorBoundary /> },
      { path: '/settings', element: <SettingsPage />, errorElement: <RouteErrorBoundary /> },
      { path: '/companies/new', element: <CompaniesNewPage />, errorElement: <RouteErrorBoundary /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
