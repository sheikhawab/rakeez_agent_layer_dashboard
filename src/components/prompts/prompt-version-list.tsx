import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RelativeTime } from '@/components/shared/relative-time'
import { cn } from '@/lib/utils'
import type { SystemPrompt } from '@/types/prompt'

type PromptVersionListProps = {
  prompts: SystemPrompt[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function PromptVersionList({
  prompts,
  selectedId,
  onSelect,
}: PromptVersionListProps) {
  const { t } = useTranslation()

  if (prompts.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm">
        {t('common.noData')}
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-1 p-2">
        {prompts.map((prompt) => {
          const isActive = selectedId === prompt.id
          return (
            <Button
              key={prompt.id}
              variant={isActive ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onSelect(prompt.id)}
              className={cn(
                'h-auto justify-start gap-2 px-3 py-2 text-start font-normal',
              )}
            >
              <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                <div className="flex w-full items-center gap-2">
                  <span className="truncate text-sm font-medium capitalize">
                    {prompt.name.replace(/_/g, ' ')}
                  </span>
                  {prompt.isActive && (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 ms-auto h-4 px-1 text-[10px]"
                    >
                      active
                    </Badge>
                  )}
                </div>
                <div className="text-muted-foreground flex w-full items-center gap-2 text-[10px]">
                  <span className="font-mono">v{prompt.version}</span>
                  <span>·</span>
                  <span className="uppercase">{prompt.language}</span>
                  <span>·</span>
                  <RelativeTime iso={prompt.updatedAt} className="text-[10px]" />
                </div>
              </div>
            </Button>
          )
        })}
      </div>
    </ScrollArea>
  )
}
