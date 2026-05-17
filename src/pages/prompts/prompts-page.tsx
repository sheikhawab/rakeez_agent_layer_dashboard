import { useEffect, useMemo, useState } from 'react'
import { Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PromptEditor } from '@/components/prompts/prompt-editor'
import { PromptVersionList } from '@/components/prompts/prompt-version-list'
import { PageHeader } from '@/components/shared/page-header'
import { SelectCompanyPrompt } from '@/components/shared/select-company-prompt'
import { usePrompts } from '@/hooks/use-prompts'
import { useSelectedCompany } from '@/store/selected-company'
import type { PromptLanguage } from '@/types/prompt'

export function PromptsPage() {
  const { t } = useTranslation()
  const { selectedCompanyId } = useSelectedCompany()

  if (selectedCompanyId === 'all') {
    return <SelectCompanyPrompt feature={t('nav.prompts')} />
  }

  return <PromptsWorkspace companyId={selectedCompanyId} />
}

function PromptsWorkspace({ companyId }: { companyId: string }) {
  const { t } = useTranslation()
  const { data: prompts, isLoading } = usePrompts(companyId)

  const [language, setLanguage] = useState<PromptLanguage>('shared')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<string>('')
  const [dirty, setDirty] = useState(false)

  const filtered = useMemo(
    () =>
      prompts?.filter(
        (p) => p.language === language || p.language === 'shared',
      ) ?? [],
    [prompts, language],
  )

  // When company / language / prompts change, pick first available prompt
  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedId(null)
      setDraft('')
      setDirty(false)
      return
    }
    if (!selectedId || !filtered.find((p) => p.id === selectedId)) {
      const first = filtered[0]
      setSelectedId(first.id)
      setDraft(first.content)
      setDirty(false)
    }
  }, [filtered, selectedId])

  const selected = useMemo(
    () => filtered.find((p) => p.id === selectedId) ?? null,
    [filtered, selectedId],
  )

  const onSelectPrompt = (id: string) => {
    if (dirty) {
      // Simple guard — could use AlertDialog for confirmation
      const ok = window.confirm('Discard unsaved changes?')
      if (!ok) return
    }
    setSelectedId(id)
    const p = filtered.find((x) => x.id === id)
    if (p) {
      setDraft(p.content)
      setDirty(false)
    }
  }

  const onEdit = (value: string) => {
    setDraft(value)
    setDirty(value !== (selected?.content ?? ''))
  }

  const onSave = () => {
    if (!selected) return
    // Phase 6 will hit the backend; for now: just persist in-memory and toast
    selected.content = draft
    selected.version += 1
    selected.updatedAt = new Date().toISOString()
    setDirty(false)
    toast.success(`${t('actions.save')} → v${selected.version}`)
  }

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <PageHeader
        title={t('nav.prompts')}
        actions={
          <Button
            size="sm"
            disabled={!dirty || !selected}
            onClick={onSave}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {t('actions.save')}
            {dirty && <span className="bg-primary-foreground/30 h-1.5 w-1.5 rounded-full" />}
          </Button>
        }
      />

      <Tabs
        value={language}
        onValueChange={(v) => setLanguage(v as PromptLanguage)}
      >
        <TabsList>
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="ar">AR</TabsTrigger>
          <TabsTrigger value="en">EN</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardContent className="h-[520px] p-0">
            {isLoading ? (
              <div className="space-y-2 p-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : (
              <PromptVersionList
                prompts={filtered}
                selectedId={selectedId}
                onSelect={onSelectPrompt}
              />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardContent className="space-y-3 pt-6">
            {selected ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-medium capitalize">
                    {selected.name.replace(/_/g, ' ')}
                  </h3>
                  <div className="text-muted-foreground text-xs">
                    v{selected.version} · {selected.updatedBy}
                  </div>
                </div>
                <PromptEditor value={draft} onChange={onEdit} minHeight={440} />
              </>
            ) : (
              <div className="text-muted-foreground py-12 text-center text-sm">
                {t('common.noData')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
