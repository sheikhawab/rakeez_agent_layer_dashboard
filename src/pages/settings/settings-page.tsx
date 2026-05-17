import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from '@/components/shared/page-header'
import { PricingRatesForm } from '@/components/settings/pricing-rates-form'

export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <PageHeader title={t('nav.settings')} />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Appearance & Language</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">{t('topbar.toggleTheme')}</Label>
            <Select value={theme ?? 'system'} onValueChange={(v) => setTheme(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <span className="flex items-center gap-2">
                    <Sun className="h-3.5 w-3.5" /> {t('theme.light')}
                  </span>
                </SelectItem>
                <SelectItem value="dark">
                  <span className="flex items-center gap-2">
                    <Moon className="h-3.5 w-3.5" /> {t('theme.dark')}
                  </span>
                </SelectItem>
                <SelectItem value="system">
                  <span className="flex items-center gap-2">
                    <Monitor className="h-3.5 w-3.5" /> {t('theme.system')}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">{t('topbar.toggleLanguage')}</Label>
            <Select
              value={i18n.language}
              onValueChange={(v) => void i18n.changeLanguage(v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('language.english')}</SelectItem>
                <SelectItem value="ar">{t('language.arabic')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{t('costs.editRates')}</CardTitle>
        </CardHeader>
        <CardContent>
          <PricingRatesForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">About</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-1 text-xs">
          <div className="flex justify-between">
            <span>App</span>
            <span className="font-mono">Mithasii</span>
          </div>
          <div className="flex justify-between">
            <span>Version</span>
            <span className="font-mono">0.0.0 (Phase 4)</span>
          </div>
          <div className="flex justify-between">
            <span>Stack</span>
            <span className="font-mono">React 19 · Vite 8 · Tailwind 4 · shadcn/ui</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
