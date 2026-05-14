interface Slice {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: Slice[];
  title: string;
}

export default function PieChart({ data, title }: PieChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const cx = 80;
  const cy = 80;
  const r = 65;

  let startAngle = -Math.PI / 2;
  const paths: { d: string; color: string; label: string; value: number; pct: number }[] = [];

  data.forEach((slice) => {
    const angle = (slice.value / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = angle > Math.PI ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    paths.push({ d, color: slice.color, label: slice.label, value: slice.value, pct: Math.round((slice.value / total) * 100) });
    startAngle = endAngle;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="flex items-center gap-6">
        <svg width="160" height="160" viewBox="0 0 160 160" className="flex-shrink-0">
          {paths.map((p, i) => (
            <path key={i} d={p.d} fill={p.color} stroke="white" strokeWidth="2" className="transition-opacity hover:opacity-80" />
          ))}
          <circle cx={cx} cy={cy} r="32" fill="white" />
          <text x={cx} y={cy - 5} textAnchor="middle" className="text-xs" fill="#374151" fontSize="10" fontWeight="bold">{total}</text>
          <text x={cx} y={cy + 9} textAnchor="middle" fill="#9ca3af" fontSize="8">tổng</text>
        </svg>
        <div className="space-y-2 flex-1">
          {paths.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: p.color }} />
              <span className="text-xs text-gray-600 flex-1 truncate">{p.label}</span>
              <span className="text-xs font-semibold text-gray-800">{p.value}</span>
              <span className="text-xs text-gray-400 w-8 text-right">{p.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
