import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function LanguageToggle() {
  const { i18n, t } = useTranslation()
  const isArabic = i18n.language === 'ar'

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => void i18n.changeLanguage(isArabic ? 'en' : 'ar')}
      aria-label={t('topbar.toggleLanguage')}
      className="h-8 min-w-9 px-2 font-medium"
    >
      {isArabic ? 'EN' : 'ع'}
    </Button>
  )
}
