import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Transcript, TranscriptSegment } from '@/types/call'

type TranscriptViewerProps = {
  transcript: Transcript | undefined
  isLoading: boolean
}

function formatTs(ms: number): string {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text
  const re = new RegExp(`(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi')
  const parts = text.split(re)
  return parts.map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/60 rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

export function TranscriptViewer({ transcript, isLoading }: TranscriptViewerProps) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')

  const segments = useMemo(() => {
    if (!transcript) return []
    if (!query.trim()) return transcript.segments
    const q = query.toLowerCase()
    return transcript.segments.filter((s) => s.text.toLowerCase().includes(q))
  }, [transcript, query])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={cn('flex gap-2', i % 2 === 0 ? 'justify-start' : 'justify-end')}
          >
            <Skeleton className="h-16 w-2/3 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (!transcript || transcript.segments.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        {t('calls.noTranscript')}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="text-muted-foreground absolute start-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('calls.searchTranscript')}
          className="ps-8 h-8 text-sm"
        />
      </div>

      <div className="space-y-2.5">
        {segments.map((seg, idx) => (
          <Segment key={`${seg.startMs}-${idx}`} segment={seg} query={query} />
        ))}
      </div>
    </div>
  )
}

function Segment({ segment, query }: { segment: TranscriptSegment; query: string }) {
  const isAgent = segment.speaker === 'agent'
  return (
    <div
      className={cn(
        'flex',
        isAgent ? 'justify-start' : 'justify-end',
      )}
    >
      <div
        className={cn(
          'max-w-[85%] space-y-1 rounded-lg border px-3 py-2',
          isAgent
            ? 'border-border bg-muted/40'
            : 'border-primary/20 bg-primary/5',
        )}
        dir={segment.language === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider">
          <span>{segment.speaker}</span>
          <span className="text-muted-foreground/60">·</span>
          <span>{segment.language.toUpperCase()}</span>
          <span className="text-muted-foreground/60">·</span>
          <span className="tabular-nums">{formatTs(segment.startMs)}</span>
        </div>
        <p className="text-sm leading-relaxed">
          <bdi>{highlightMatch(segment.text, query)}</bdi>
        </p>
      </div>
    </div>
  )
}
