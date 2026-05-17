import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useEffect } from 'react'
import type { Path, UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AgentConfig } from '@/types/agent-config'

const schema = z.object({
  llm: z.object({
    provider: z.enum(['openai', 'groq']),
    model: z.string().min(1),
    temperature: z.number().min(0).max(2),
    maxTokens: z.number().int().min(50).max(4000),
  }),
  stt: z.object({
    provider: z.enum(['openai', 'deepgram']),
    model: z.string().min(1),
    serverVadThreshold: z.number().min(0).max(1),
  }),
  tts: z.object({
    provider: z.enum(['elevenlabs', 'cartesia']),
    model: z.string().min(1),
    voiceIdAr: z.string().min(1),
    voiceIdEn: z.string().min(1),
  }),
  vad: z.object({
    sileroActivationThreshold: z.number().min(0).max(1),
    minInterruptionDurationSec: z.number().min(0).max(5),
    minInterruptionWords: z.number().int().min(1).max(20),
  }),
  callLimits: z.object({
    maxDurationSec: z.number().int().min(30).max(3600),
    endpointingDelaySec: z.number().min(0).max(10),
  }),
})

type FormValues = z.infer<typeof schema>
type AgentForm = UseFormReturn<FormValues>

export function AgentConfigForm({ config }: { config: AgentConfig }) {
  const { t } = useTranslation()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      llm: config.llm,
      stt: config.stt,
      tts: config.tts,
      vad: config.vad,
      callLimits: config.callLimits,
    },
  })

  useEffect(() => {
    form.reset({
      llm: config.llm,
      stt: config.stt,
      tts: config.tts,
      vad: config.vad,
      callLimits: config.callLimits,
    })
  }, [config, form])

  const onSubmit = (values: FormValues) => {
    Object.assign(config, { ...values, companyId: config.companyId })
    toast.success(t('actions.save'))
    form.reset(values)
  }

  const isDirty = form.formState.isDirty

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Section title="LLM">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="llm.provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="groq">Groq</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextField form={form} name="llm.model" label="Model" />
            <NumberField form={form} name="llm.temperature" label="Temperature" step="0.05" />
            <NumberField form={form} name="llm.maxTokens" label="Max tokens" />
          </div>
        </Section>

        <Section title="STT">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="stt.provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="deepgram">Deepgram</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextField form={form} name="stt.model" label="Model" />
            <NumberField
              form={form}
              name="stt.serverVadThreshold"
              label="Server VAD threshold"
              step="0.01"
              hint="0–1; higher = stricter speech detection"
            />
          </div>
        </Section>

        <Section title="TTS">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="tts.provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                      <SelectItem value="cartesia">Cartesia</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextField form={form} name="tts.model" label="Model" />
            <TextField form={form} name="tts.voiceIdAr" label="Arabic voice ID" />
            <TextField form={form} name="tts.voiceIdEn" label="English voice ID" />
          </div>
        </Section>

        <Section title="VAD">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <NumberField
              form={form}
              name="vad.sileroActivationThreshold"
              label="Silero activation"
              step="0.01"
              hint="0–1"
            />
            <NumberField
              form={form}
              name="vad.minInterruptionDurationSec"
              label="Min interruption (s)"
              step="0.1"
            />
            <NumberField
              form={form}
              name="vad.minInterruptionWords"
              label="Min interruption words"
            />
          </div>
        </Section>

        <Section title="Call limits">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <NumberField
              form={form}
              name="callLimits.maxDurationSec"
              label="Max duration (s)"
            />
            <NumberField
              form={form}
              name="callLimits.endpointingDelaySec"
              label="Endpointing delay (s)"
              step="0.1"
            />
          </div>
        </Section>

        <div className="bg-background sticky bottom-0 -mx-4 flex items-center justify-between gap-3 border-t px-4 py-3 sm:-mx-6 sm:px-6">
          <div className="text-muted-foreground text-xs">
            {isDirty ? 'Unsaved changes' : 'All changes saved'}
          </div>
          <Button type="submit" disabled={!isDirty} size="sm" className="gap-2">
            <Save className="h-4 w-4" />
            {t('actions.save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

type FieldProps = {
  form: AgentForm
  name: Path<FormValues>
  label: string
  hint?: string
}

function TextField({ form, name, label, hint }: FieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              value={(field.value as string | number | undefined) ?? ''}
            />
          </FormControl>
          {hint && <FormDescription>{hint}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function NumberField({
  form,
  name,
  label,
  hint,
  step = '1',
}: FieldProps & { step?: string }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              step={step}
              value={(field.value as number | undefined) ?? ''}
              onChange={(e) => {
                const v = e.target.value
                field.onChange(v === '' ? undefined : Number(v))
              }}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          </FormControl>
          {hint && <FormDescription>{hint}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
