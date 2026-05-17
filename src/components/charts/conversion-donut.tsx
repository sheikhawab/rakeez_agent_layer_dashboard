import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { cn } from '@/lib/utils'

type ConversionDonutProps = {
  /** Total calls */
  calls: number
  /** Bookings out of those calls */
  bookings: number
  /** Render size */
  size?: number
}

export function ConversionDonut({ calls, bookings, size = 140 }: ConversionDonutProps) {
  const pct = calls === 0 ? 0 : (bookings / calls) * 100
  const remaining = Math.max(0, calls - bookings)

  const tone =
    pct >= 20 ? 'positive' : pct >= 10 ? 'neutral' : pct === 0 ? 'empty' : 'negative'

  const colors = {
    positive: 'var(--color-chart-2)',
    neutral: 'var(--color-chart-4)',
    negative: 'var(--color-destructive)',
    empty: 'var(--color-muted)',
  }
  const fillColor = colors[tone]

  const data = [
    { name: 'Bookings', value: bookings, color: fillColor },
    { name: 'No booking', value: remaining, color: 'var(--color-muted)' },
  ]

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={size * 0.35}
            outerRadius={size * 0.48}
            startAngle={90}
            endAngle={-270}
            paddingAngle={1}
            strokeWidth={0}
            isAnimationActive={false}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            'text-2xl font-semibold tabular-nums',
            tone === 'positive' && 'text-emerald-600 dark:text-emerald-400',
            tone === 'negative' && 'text-red-600 dark:text-red-400',
          )}
        >
          {pct.toFixed(0)}%
        </span>
        <span className="text-muted-foreground text-[10px] tabular-nums">
          {bookings} / {calls}
        </span>
      </div>
    </div>
  )
}
