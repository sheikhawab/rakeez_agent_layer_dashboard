import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

/**
 * Route-level error boundary. React Router invokes this when a loader
 * or a rendered element throws.
 */
export function RouteErrorBoundary() {
  const error = useRouteError()
  const { t } = useTranslation()
  const navigate = useNavigate()

  let title = t('errorBoundary.title', { defaultValue: 'Something went wrong' })
  let message = t('errorBoundary.description', {
    defaultValue: 'An unexpected error occurred. You can try again or go back to the overview.',
  })

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`
    message = error.data?.message ?? message
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardContent className="space-y-4 pt-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription className="break-words font-mono text-xs">
              {message}
            </AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {t('actions.retry')}
            </Button>
            <Button size="sm" onClick={() => navigate('/')}>
              {t('notFound.backToOverview')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
