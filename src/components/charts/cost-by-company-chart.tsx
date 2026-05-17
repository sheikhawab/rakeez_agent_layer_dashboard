import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { formatCost } from '@/lib/format'
import { mockCompanies } from '@/mocks/companies'
import type { APIUsage } from '@/types/cost'

type Row = { companyId: string; name: string; cost: number; color: string }

export function CostByCompanyChart({ usage }: { usage: APIUsage[] }) {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const data: Row[] = useMemo(() => {
    const byCompany = new Map<string, number>()
    for (const u of usage) {
      byCompany.set(u.companyId, (byCompany.get(u.companyId) ?? 0) + u.totalCost)
    }
    return mockCompanies
      .map((c) => ({
        companyId: c.id,
        name: isArabic && c.nameAr ? c.nameAr : c.name,
        cost: byCompany.get(c.id) ?? 0,
        color: c.brand?.color ?? 'var(--color-chart-1)',
      }))
      .filter((r) => r.cost > 0)
      .sort((a, b) => b.cost - a.cost)
  }, [usage, isArabic])

  if (data.length === 0) {
    return (
      <div className="text-muted-foreground flex h-[220px] items-center justify-center text-sm">
        No usage data
      </div>
    )
  }

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: 'var(--color-muted-foreground)' }}
            className="text-[10px]"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `$${v.toFixed(1)}`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: 'var(--color-muted-foreground)' }}
            className="text-[10px]"
            tickLine={false}
            axisLine={false}
            width={100}
          />
          <Tooltip
            cursor={{ fill: 'var(--color-muted)', opacity: 0.4 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const item = payload[0].payload as Row
              return (
                <div className="bg-popover text-popover-foreground rounded-md border p-2 text-xs shadow-md">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <bdi>{item.name}</bdi>
                  </div>
                  <div className="text-muted-foreground tabular-nums">
                    {formatCost(item.cost).combined}
                  </div>
                </div>
              )
            }}
          />
          <Bar dataKey="cost" radius={[0, 4, 4, 0]} isAnimationActive={false}>
            {data.map((row) => (
              <Cell key={row.companyId} fill={row.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
