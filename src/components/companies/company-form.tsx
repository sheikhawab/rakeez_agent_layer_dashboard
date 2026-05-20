import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
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
import { Textarea } from '@/components/ui/textarea'
import { useCreateCompany } from '@/hooks/use-companies'
import type { CompanyCreate } from '@/types/company'

const schema = z.object({
  slug: z.string().min(1, 'Required'),
  business_name: z.string().min(1, 'Required'),
  system_prompt: z.string().min(1, 'Required'),
  tts_voice_id_ar: z.string().min(1, 'Required'),
  tts_voice_id_en: z.string().min(1, 'Required'),
  status: z.enum(['active', 'paused', 'suspended']),
  language_prompt: z.string(),
  tts_default_language: z.enum(['ar', 'en']),
  tts_model: z.string(),
  llm_model: z.string(),
  stt_model: z.string(),
  whatsapp_phone_to: z.string(),
  whatsapp_template_name: z.string(),
  currency: z.string(),
  timezone: z.string(),
  max_call_seconds: z.string(),
  max_concurrent_calls: z.string(),
  monthly_budget_usd: z.string(),
})

type FormValues = z.infer<typeof schema>

export function CompanyForm() {
  const navigate = useNavigate()
  const { mutateAsync, isPending } = useCreateCompany()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: '',
      business_name: '',
      system_prompt: '',
      tts_voice_id_ar: '',
      tts_voice_id_en: '',
      status: 'active',
      language_prompt: '',
      tts_default_language: 'ar',
      tts_model: '',
      llm_model: '',
      stt_model: '',
      whatsapp_phone_to: '',
      whatsapp_template_name: '',
      currency: '',
      timezone: '',
      max_call_seconds: '',
      max_concurrent_calls: '',
      monthly_budget_usd: '',
    },
  })

  async function onSubmit(values: FormValues) {
    const payload: CompanyCreate = {
      slug: values.slug,
      business_name: values.business_name,
      system_prompt: values.system_prompt,
      tts_voice_id_ar: values.tts_voice_id_ar,
      tts_voice_id_en: values.tts_voice_id_en,
      status: values.status,
      ...(values.language_prompt && { language_prompt: values.language_prompt }),
      ...(values.tts_default_language && { tts_default_language: values.tts_default_language }),
      ...(values.tts_model && { tts_model: values.tts_model }),
      ...(values.llm_model && { llm_model: values.llm_model }),
      ...(values.stt_model && { stt_model: values.stt_model }),
      ...(values.whatsapp_phone_to && { whatsapp_phone_to: values.whatsapp_phone_to }),
      ...(values.whatsapp_template_name && { whatsapp_template_name: values.whatsapp_template_name }),
      ...(values.currency && { currency: values.currency }),
      ...(values.timezone && { timezone: values.timezone }),
      ...(values.max_call_seconds && { max_call_seconds: parseInt(values.max_call_seconds) }),
      ...(values.max_concurrent_calls && { max_concurrent_calls: parseInt(values.max_concurrent_calls) }),
      ...(values.monthly_budget_usd && { monthly_budget_usd: parseFloat(values.monthly_budget_usd) }),
    }

    try {
      await mutateAsync(payload)
      toast.success(`${values.business_name} created`)
      navigate('/')
    } catch {
      toast.error('Failed to create company')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Mithasii Bakery" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="mithasii-bakery" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Currency <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="SAR" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Timezone <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Asia/Riyadh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* AI Prompts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">AI Prompts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="system_prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="You are a helpful voice agent for..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language_prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Language Prompt <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Respond in Arabic unless the user writes in English..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Voice Config */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Voice Config</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="tts_voice_id_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TTS Voice ID (Arabic)</FormLabel>
                  <FormControl>
                    <Input placeholder="ElevenLabs voice ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tts_voice_id_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TTS Voice ID (English)</FormLabel>
                  <FormControl>
                    <Input placeholder="ElevenLabs voice ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tts_default_language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Language</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tts_model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    TTS Model <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="eleven_multilingual_v2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Models */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Models{' '}
              <span className="text-muted-foreground text-xs font-normal">(optional)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="llm_model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LLM Model</FormLabel>
                  <FormControl>
                    <Input placeholder="gpt-4o-mini" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stt_model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>STT Model</FormLabel>
                  <FormControl>
                    <Input placeholder="whisper-1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* WhatsApp */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              WhatsApp{' '}
              <span className="text-muted-foreground text-xs font-normal">(optional)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="whatsapp_phone_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+966500000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp_template_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name</FormLabel>
                  <FormControl>
                    <Input placeholder="booking_confirmation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Limits & Budget */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Limits & Budget{' '}
              <span className="text-muted-foreground text-xs font-normal">(optional)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="max_call_seconds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Call Seconds</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="300" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="max_concurrent_calls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Concurrent Calls</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthly_budget_usd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Budget (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="100.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Company'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
