import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { CallCostPanel } from '@/components/calls/call-cost-panel'
import { TranscriptViewer } from '@/components/calls/transcript-viewer'
import { CompanyBadge } from '@/components/shared/company-badge'
import { Duration } from '@/components/shared/duration'
import { LanguageBadge } from '@/components/shared/language-badge'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useBooking } from '@/hooks/use-bookings'
import { useCall, useTranscript } from '@/hooks/use-calls'
import { useCaller } from '@/hooks/use-callers'

export function CallDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const { data: call, isLoading: callLoading } = useCall(id)
  const { data: transcript, isLoading: transcriptLoading } = useTranscript(
    call?.transcriptId,
  )
  const { data: caller } = useCaller(call?.callerId)
  const { data: booking } = useBooking(call?.bookingId)

  if (callLoading) {
    return (
      <div className="space-y-4 p-4 sm:p-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  if (!call) {
    return (
      <div className="p-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/calls">
            <ArrowLeft className="me-2 h-4 w-4" />
            {t('actions.back')}
          </Link>
        </Button>
        <p className="text-muted-foreground mt-4 text-sm">Call not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="space-y-3">
        <Button variant="ghost" size="sm" asChild className="-ms-2">
          <Link to="/calls">
            <ArrowLeft className="me-1 h-4 w-4" />
            {t('actions.back')}
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            <span className="font-mono">{call.id}</span>
          </h1>
          <CompanyBadge companyId={call.companyId} />
          <LanguageBadge language={call.language} />
          <Duration seconds={call.durationSec} className="text-muted-foreground text-sm" />
          <StatusBadge status={call.status} />
        </div>
        {call.summary && (
          <p className="text-muted-foreground text-sm max-w-3xl">
            {call.summary}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left column — Transcript / Audio / Events tabs */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="transcript">
              <TabsList>
                <TabsTrigger value="transcript">{t('calls.transcript')}</TabsTrigger>
                <TabsTrigger value="audio" disabled>
                  {t('calls.audio')}
                </TabsTrigger>
                <TabsTrigger value="events" disabled>
                  {t('calls.events')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="transcript" className="mt-4">
                <TranscriptViewer
                  transcript={transcript}
                  isLoading={transcriptLoading}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Right column — Cost, Caller, Booking, Metadata */}
        <div className="space-y-4">
          <CallCostPanel breakdown={call.cost} />

          {caller && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('calls.caller')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="font-medium">
                  <bdi>{caller.name ?? 'Unknown'}</bdi>
                </div>
                {caller.email && (
                  <div className="text-muted-foreground truncate text-xs">
                    {caller.email}
                  </div>
                )}
                {caller.phone && (
                  <div className="text-muted-foreground text-xs font-mono">
                    <bdi>{caller.phone}</bdi>
                  </div>
                )}
                <Button
                  variant="link"
                  size="sm"
                  asChild
                  className="-ms-3 mt-1 h-7 px-3"
                >
                  <Link to={`/callers/${caller.id}`}>
                    {isArabic ? 'عرض المتصل' : 'View caller'} →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {booking && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('nav.bookings')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="font-mono">{booking.id}</div>
                <div className="text-muted-foreground text-xs">
                  {booking.preferredDate} · {booking.preferredTime}
                </div>
                <StatusBadge status={booking.status} className="mt-1" />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs">
              <Meta label="Started" value={new Date(call.startedAt).toLocaleString()} />
              <Meta label="Ended" value={new Date(call.endedAt).toLocaleString()} />
              <Meta label="Transcript ID" value={call.transcriptId} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-mono">{value}</span>
    </div>
  )
}
