import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = {
  ar: 'var(--color-chart-1)',
  en: 'var(--color-chart-2)',
  mixed: 'var(--color-chart-3)',
}

const LABELS = {
  ar: 'AR',
  en: 'EN',
  mixed: 'Mixed',
} as const

export function LanguageSplitChart({
  data,
}: {
  data: { ar: number; en: number; mixed: number }
}) {
  const total = data.ar + data.en + data.mixed
  const chartData = (['ar', 'en', 'mixed'] as const).map((key) => ({
    key,
    name: LABELS[key],
    value: data[key],
    color: COLORS[key],
  }))

  if (total === 0) {
    return (
      <div className="text-muted-foreground flex h-[180px] items-center justify-center text-sm">
        No calls yet
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={2}
              strokeWidth={0}
              isAnimationActive={false}
            >
              {chartData.map((entry) => (
                <Cell key={entry.key} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const item = payload[0].payload as { name: string; value: number }
                const pct = total === 0 ? 0 : (item.value / total) * 100
                return (
                  <div className="bg-popover text-popover-foreground rounded-md border p-2 text-xs shadow-md">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-muted-foreground tabular-nums">
                      {item.value} calls · {pct.toFixed(1)}%
                    </div>
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex w-full flex-wrap justify-center gap-3 text-xs">
        {chartData.map((entry) => {
          const pct = total === 0 ? 0 : (entry.value / total) * 100
          return (
            <div key={entry.key} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium">{entry.name}</span>
              <span className="text-muted-foreground tabular-nums">{pct.toFixed(0)}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
