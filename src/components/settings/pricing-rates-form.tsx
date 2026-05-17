import { Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { API_PRICING, USD_TO_SAR } from '@/lib/pricing'
import { cn } from '@/lib/utils'

type Rates = {
  sttPerMin: number
  llmInputPer1M: number
  llmOutputPer1M: number
  ttsPer1k: number
  livekitPerMin: number
  whatsappTemplate: number
  whatsappFreeForm: number
  usdToSar: number
}

const STORAGE_KEY = 'mithasii-pricing-rates'

function loadRates(): Rates {
  if (typeof window === 'undefined') return defaultRates()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultRates(), ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return defaultRates()
}

function defaultRates(): Rates {
  return {
    sttPerMin: API_PRICING.openai.stt.perMinute,
    llmInputPer1M: API_PRICING.openai.llm['gpt-4.1-mini'].inputPer1M,
    llmOutputPer1M: API_PRICING.openai.llm['gpt-4.1-mini'].outputPer1M,
    ttsPer1k: API_PRICING.elevenlabs.tts.per1kChars,
    livekitPerMin: API_PRICING.livekit.perParticipantMinute,
    whatsappTemplate: API_PRICING.whatsapp.template,
    whatsappFreeForm: API_PRICING.whatsapp.freeForm,
    usdToSar: USD_TO_SAR,
  }
}

export function PricingRatesForm() {
  const { t } = useTranslation()
  const [rates, setRates] = useState<Rates>(() => loadRates())
  const [initial, setInitial] = useState<Rates>(() => loadRates())

  useEffect(() => {
    const loaded = loadRates()
    setRates(loaded)
    setInitial(loaded)
  }, [])

  const dirty = JSON.stringify(rates) !== JSON.stringify(initial)

  const save = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rates))
    setInitial(rates)
    toast.success(t('actions.save'))
  }

  const reset = () => {
    const d = defaultRates()
    setRates(d)
  }

  const update = <K extends keyof Rates>(key: K, value: number) => {
    setRates((r) => ({ ...r, [key]: Number.isFinite(value) ? value : 0 }))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RateField
          label="OpenAI STT — per minute"
          value={rates.sttPerMin}
          step="0.001"
          onChange={(v) => update('sttPerMin', v)}
        />
        <RateField
          label="OpenAI LLM input — per 1M tokens"
          value={rates.llmInputPer1M}
          step="0.01"
          onChange={(v) => update('llmInputPer1M', v)}
        />
        <RateField
          label="OpenAI LLM output — per 1M tokens"
          value={rates.llmOutputPer1M}
          step="0.01"
          onChange={(v) => update('llmOutputPer1M', v)}
        />
        <RateField
          label="ElevenLabs TTS — per 1k chars"
          value={rates.ttsPer1k}
          step="0.01"
          onChange={(v) => update('ttsPer1k', v)}
        />
        <RateField
          label="LiveKit — per participant-min"
          value={rates.livekitPerMin}
          step="0.0001"
          onChange={(v) => update('livekitPerMin', v)}
        />
        <RateField
          label="WhatsApp template — per message"
          value={rates.whatsappTemplate}
          step="0.001"
          onChange={(v) => update('whatsappTemplate', v)}
        />
        <RateField
          label="WhatsApp free-form — per message"
          value={rates.whatsappFreeForm}
          step="0.001"
          onChange={(v) => update('whatsappFreeForm', v)}
        />
        <RateField
          label="USD → SAR rate"
          value={rates.usdToSar}
          step="0.01"
          onChange={(v) => update('usdToSar', v)}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className={cn('text-xs', dirty ? 'text-foreground' : 'text-muted-foreground')}>
          {dirty ? 'Unsaved changes' : 'All changes saved'}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={reset} disabled={!dirty}>
            Reset to defaults
          </Button>
          <Button size="sm" onClick={save} disabled={!dirty} className="gap-2">
            <Save className="h-4 w-4" />
            {t('actions.save')}
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground text-xs">
        Note: rates persist locally only. Backend integration in Phase 6 will sync these to the
        cost-calculator across all companies.
      </p>
    </div>
  )
}

function RateField({
  label,
  value,
  step,
  onChange,
}: {
  label: string
  value: number
  step: string
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="relative">
        <span className="text-muted-foreground absolute start-2.5 top-1/2 -translate-y-1/2 text-xs">
          $
        </span>
        <Input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="ps-6 tabular-nums"
        />
      </div>
    </div>
  )
}
