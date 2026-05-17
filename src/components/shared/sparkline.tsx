import { Area, AreaChart, ResponsiveContainer } from 'recharts'

import { cn } from '@/lib/utils'

type SparklineProps = {
  /** Series of numbers to plot */
  data: number[]
  /** Color hint — 'positive' = green, 'negative' = red, 'neutral' = primary */
  tone?: 'positive' | 'negative' | 'neutral'
  className?: string
  /** Height in px (defaults to 32) */
  height?: number
}

const TONE_COLOR: Record<NonNullable<SparklineProps['tone']>, string> = {
  positive: 'var(--color-chart-2)',
  negative: 'var(--color-destructive)',
  neutral: 'var(--color-primary)',
}

export function Sparkline({
  data,
  tone = 'neutral',
  className,
  height = 32,
}: SparklineProps) {
  const series = data.map((value, index) => ({ index, value }))
  const color = TONE_COLOR[tone]
  const gradientId = `spark-${tone}-${Math.random().toString(36).slice(2, 7)}`

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
