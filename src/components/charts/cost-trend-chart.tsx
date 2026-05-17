import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { APIUsage } from '@/types/cost'
import { formatCost } from '@/lib/format'

type Row = {
  date: string
  stt: number
  llm: number
  tts: number
  livekit: number
  whatsapp: number
}

function aggregateByDate(usage: APIUsage[]): Row[] {
  const byDate = new Map<string, Row>()
  for (const u of usage) {
    const existing = byDate.get(u.date) ?? {
      date: u.date,
      stt: 0,
      llm: 0,
      tts: 0,
      livekit: 0,
      whatsapp: 0,
    }
    // Reverse-distribute totalCost across APIs using approximate ratios
    // (mocks don't track per-API costs in APIUsage, so we estimate)
    const sttRatio = 0.18
    const llmRatio = 0.32
    const ttsRatio = 0.36
    const lkRatio = 0.04
    const waRatio = 0.1
    existing.stt += u.totalCost * sttRatio
    existing.llm += u.totalCost * llmRatio
    existing.tts += u.totalCost * ttsRatio
    existing.livekit += u.totalCost * lkRatio
    existing.whatsapp += u.totalCost * waRatio
    byDate.set(u.date, existing)
  }
  return [...byDate.values()].sort((a, b) => (a.date < b.date ? -1 : 1))
}

const COLORS = {
  stt: 'var(--color-chart-1)',
  llm: 'var(--color-chart-2)',
  tts: 'var(--color-chart-3)',
  livekit: 'var(--color-chart-4)',
  whatsapp: 'var(--color-chart-5)',
}

export function CostTrendChart({ usage }: { usage: APIUsage[] }) {
  const data = useMemo(() => aggregateByDate(usage), [usage])

  if (data.length === 0) {
    return (
      <div className="text-muted-foreground flex h-[260px] items-center justify-center text-sm">
        No data
      </div>
    )
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            {(Object.keys(COLORS) as Array<keyof typeof COLORS>).map((key) => (
              <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS[key]} stopOpacity={0.6} />
                <stop offset="100%" stopColor={COLORS[key]} stopOpacity={0.05} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          <XAxis
            dataKey="date"
            className="text-[10px]"
            tick={{ fill: 'var(--color-muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: string) => v.slice(5)}
          />
          <YAxis
            className="text-[10px]"
            tick={{ fill: 'var(--color-muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `$${v.toFixed(2)}`}
            width={50}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const total = payload.reduce((s, p) => s + (p.value as number), 0)
              return (
                <div className="bg-popover text-popover-foreground rounded-md border p-2 text-xs shadow-md">
                  <div className="mb-1 font-medium">{label}</div>
                  {payload.map((p) => (
                    <div key={String(p.dataKey)} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                        {String(p.dataKey).toUpperCase()}
                      </span>
                      <span className="tabular-nums">
                        {formatCost(p.value as number).combined}
                      </span>
                    </div>
                  ))}
                  <div className="border-border mt-1 flex justify-between border-t pt-1 font-medium">
                    <span>Total</span>
                    <span className="tabular-nums">{formatCost(total).combined}</span>
                  </div>
                </div>
              )
            }}
          />
          {(['stt', 'llm', 'tts', 'livekit', 'whatsapp'] as const).map((key) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
              stroke={COLORS[key]}
              strokeWidth={1.5}
              fill={`url(#grad-${key})`}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <div className="text-muted-foreground mt-2 flex flex-wrap gap-3 text-[11px]">
        {(['stt', 'llm', 'tts', 'livekit', 'whatsapp'] as const).map((key) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[key] }} />
            {key.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  )
}
