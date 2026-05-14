interface BarData {
  label: string;
  value: number;
  target?: number;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  title: string;
  subtitle?: string;
}

export default function BarChart({ data, title, subtitle }: BarChartProps) {
  const maxVal = Math.max(...data.map((d) => Math.max(d.value, d.target ?? 0)), 1);
  const chartH = 140;
  const barW = Math.min(36, Math.floor(280 / data.length) - 8);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="overflow-x-auto">
        <div className="flex items-end gap-3 min-w-0" style={{ height: chartH + 32 }}>
          {data.map((d, i) => {
            const h = Math.round((d.value / maxVal) * chartH);
            const ht = d.target ? Math.round((d.target / maxVal) * chartH) : 0;
            const pct = d.target ? Math.round((d.value / d.target) * 100) : null;
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <div className="relative flex items-end gap-1" style={{ height: chartH }}>
                  {d.target && (
                    <div
                      className="rounded-t opacity-30"
                      style={{ width: barW * 0.5, height: ht, background: d.color ?? '#1e40af', minHeight: 2 }}
                    />
                  )}
                  <div
                    className="rounded-t transition-all"
                    style={{ width: barW, height: Math.max(h, 2), background: d.color ?? '#1e40af' }}
                    title={`${d.label}: ${d.value}${d.target ? ` / ${d.target}` : ''}`}
                  />
                  {pct !== null && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-700 whitespace-nowrap">
                      {pct}%
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500 text-center leading-tight truncate w-full px-1">{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      {data.some((d) => d.target) && (
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-700" />
            <span className="text-xs text-gray-500">Thực hiện</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-300 opacity-50" />
            <span className="text-xs text-gray-500">Chỉ tiêu</span>
          </div>
        </div>
      )}
    </div>
  );
}
