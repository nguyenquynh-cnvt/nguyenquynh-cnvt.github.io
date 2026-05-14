import { Video as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: 'blue' | 'red' | 'green' | 'orange' | 'teal';
  subtitle?: string;
  trend?: { value: number; label: string };
}

const COLOR_MAP = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-700 text-white',
    value: 'text-blue-800',
    border: 'border-blue-100',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-600 text-white',
    value: 'text-red-800',
    border: 'border-red-100',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-600 text-white',
    value: 'text-green-800',
    border: 'border-green-100',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-600 text-white',
    value: 'text-orange-800',
    border: 'border-orange-100',
  },
  teal: {
    bg: 'bg-teal-50',
    icon: 'bg-teal-600 text-white',
    value: 'text-teal-800',
    border: 'border-teal-100',
  },
};

export default function StatCard({ title, value, icon: Icon, color, subtitle, trend }: StatCardProps) {
  const c = COLOR_MAP[color];
  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-5 flex items-start gap-4`}>
      <div className={`${c.icon} rounded-lg p-2.5 flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-sm font-medium leading-tight">{title}</p>
        <p className={`${c.value} text-3xl font-bold mt-0.5 leading-tight`}>{value}</p>
        {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        {trend && (
          <p className={`text-xs mt-1 font-medium ${trend.value >= 0 ? 'text-red-500' : 'text-green-500'}`}>
            {trend.value >= 0 ? '▲' : '▼'} {Math.abs(trend.value)}% {trend.label}
          </p>
        )}
      </div>
    </div>
  );
}
