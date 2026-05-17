import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">{t('notFound.title')}</CardTitle>
          <CardDescription>{t('notFound.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/">{t('notFound.backToOverview')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
