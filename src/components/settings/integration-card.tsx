import type { LucideIcon } from 'lucide-react'
import { Check, Settings as SettingsIcon, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type IntegrationStatus = 'connected' | 'not-connected'

type IntegrationCardProps = {
  icon: LucideIcon
  name: string
  description: string
  status: IntegrationStatus
  /** Free-form details shown when connected (e.g. masked credentials) */
  details?: { label: string; value: string }[]
  onConfigure?: () => void
  onConnect?: () => void
  onDisconnect?: () => void
}

export function IntegrationCard({
  icon: Icon,
  name,
  description,
  status,
  details,
  onConfigure,
  onConnect,
  onDisconnect,
}: IntegrationCardProps) {
  const connected = status === 'connected'

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-md',
                connected
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{name}</CardTitle>
              <p className="text-muted-foreground text-xs">{description}</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              connected
                ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                : 'border-muted-foreground/20 text-muted-foreground',
            )}
          >
            {connected ? <Check className="me-1 h-3 w-3" /> : <X className="me-1 h-3 w-3" />}
            {connected ? 'Connected' : 'Not connected'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {connected && details && details.length > 0 && (
          <dl className="space-y-1 text-xs">
            {details.map((d) => (
              <div key={d.label} className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{d.label}</dt>
                <dd className="font-mono truncate">{d.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="flex gap-2">
          {connected ? (
            <>
              <Button variant="outline" size="sm" onClick={onConfigure} className="flex-1 gap-2">
                <SettingsIcon className="h-3.5 w-3.5" /> Configure
              </Button>
              <Button variant="ghost" size="sm" onClick={onDisconnect}>
                Disconnect
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" onClick={onConnect} className="flex-1">
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
