import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { formatCost } from '@/lib/format'
import type { CostBreakdown } from '@/types/cost'

type SegmentKey = 'stt' | 'llm' | 'tts' | 'livekit' | 'whatsapp'

const COLORS: Record<SegmentKey, string> = {
  stt: 'var(--color-chart-1)',
  llm: 'var(--color-chart-2)',
  tts: 'var(--color-chart-3)',
  livekit: 'var(--color-chart-4)',
  whatsapp: 'var(--color-chart-5)',
}

const LABELS: Record<SegmentKey, string> = {
  stt: 'STT',
  llm: 'LLM',
  tts: 'TTS',
  livekit: 'LiveKit',
  whatsapp: 'WhatsApp',
}

export function CostBreakdownPie({
  breakdown,
  size = 140,
}: {
  breakdown: CostBreakdown
  size?: number
}) {
  const allSegments: { key: SegmentKey; value: number }[] = [
    { key: 'stt', value: breakdown.stt },
    { key: 'llm', value: breakdown.llm.total },
    { key: 'tts', value: breakdown.tts },
    { key: 'livekit', value: breakdown.livekit },
    { key: 'whatsapp', value: breakdown.whatsapp },
  ]
  const segments = allSegments.filter((s) => s.value > 0)

  if (segments.length === 0) {
    return (
      <div className="text-muted-foreground flex items-center justify-center text-sm" style={{ height: size }}>
        No cost data
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segments}
              dataKey="value"
              nameKey="key"
              innerRadius={size * 0.35}
              outerRadius={size * 0.48}
              paddingAngle={2}
              strokeWidth={0}
              isAnimationActive={false}
            >
              {segments.map((s) => (
                <Cell key={s.key} fill={COLORS[s.key]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const item = payload[0].payload as { key: SegmentKey; value: number }
                const pct = breakdown.total === 0 ? 0 : (item.value / breakdown.total) * 100
                return (
                  <div className="bg-popover text-popover-foreground rounded-md border p-2 text-xs shadow-md">
                    <div className="font-medium">{LABELS[item.key]}</div>
                    <div className="text-muted-foreground tabular-nums">
                      {formatCost(item.value).combined} · {pct.toFixed(1)}%
                    </div>
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-medium tabular-nums">
            {formatCost(breakdown.total).usd}
          </span>
          <span className="text-muted-foreground text-[9px]">total</span>
        </div>
      </div>
      <ul className="flex flex-col gap-1.5 text-xs">
        {segments.map((s) => {
          const pct = breakdown.total === 0 ? 0 : (s.value / breakdown.total) * 100
          return (
            <li key={s.key} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: COLORS[s.key] }}
              />
              <span className="w-16 font-medium">{LABELS[s.key]}</span>
              <span className="tabular-nums">{formatCost(s.value).usd}</span>
              <span className="text-muted-foreground tabular-nums">
                {pct.toFixed(0)}%
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
