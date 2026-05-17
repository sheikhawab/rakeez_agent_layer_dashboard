import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Language } from '@/types/call'

const LANG_STYLES: Record<Language, string> = {
  ar: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30',
  en: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30',
  mixed: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
}

const LANG_LABELS: Record<Language, string> = {
  ar: 'AR',
  en: 'EN',
  mixed: 'AR/EN',
}

export function LanguageBadge({
  language,
  className,
}: {
  language: Language
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wider',
        LANG_STYLES[language],
        className,
      )}
    >
      {LANG_LABELS[language]}
    </Badge>
  )
}
