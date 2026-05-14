interface BadgeProps {
  level: 'red' | 'yellow' | 'green' | 'blue' | 'gray';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

const STYLES = {
  red: 'bg-red-100 text-red-700 border-red-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  green: 'bg-green-100 text-green-700 border-green-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  gray: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function Badge({ level, children, size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${STYLES[level]} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'}`}
    >
      {children}
    </span>
  );
}
