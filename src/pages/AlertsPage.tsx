import { Bell, AlertTriangle, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/ui/Badge';

const TYPE_LABELS: Record<string, string> = {
  missing_post_treatment: 'Thiếu hồ sơ sau cai',
  missing_data: 'Thiếu thông tin',
  synced: 'Đã đồng bộ',
  late_report: 'Chậm báo cáo',
  unmanaged: 'Chưa quản lý',
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  missing_post_treatment: <XCircle className="w-4 h-4" />,
  missing_data: <AlertTriangle className="w-4 h-4" />,
  synced: <CheckCircle className="w-4 h-4" />,
  late_report: <Clock className="w-4 h-4" />,
  unmanaged: <Users className="w-4 h-4" />,
};

export default function AlertsPage() {
  const { alerts, resolveAlert } = useApp();

  const categories = [
    {
      title: 'Báo cáo chưa nhập / Chậm tiến độ',
      icon: <Clock className="w-5 h-5 text-yellow-600" />,
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      items: alerts.filter((a) => a.type === 'late_report' && !a.resolved),
    },
    {
      title: 'Sai lệch dữ liệu — Mức nghiêm trọng',
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      bg: 'bg-red-50',
      border: 'border-red-200',
      items: alerts.filter((a) => a.level === 'red' && !a.resolved),
    },
    {
      title: 'Thiếu thông tin hồ sơ',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      items: alerts.filter((a) => a.type === 'missing_data' && !a.resolved),
    },
    {
      title: 'Đối tượng chưa có hồ sơ sau cai',
      icon: <Users className="w-5 h-5 text-red-600" />,
      bg: 'bg-red-50',
      border: 'border-red-200',
      items: alerts.filter((a) => a.type === 'missing_post_treatment' && !a.resolved),
    },
  ];

  const unresolvedCount = alerts.filter((a) => !a.resolved).length;
  const redCount = alerts.filter((a) => a.level === 'red' && !a.resolved).length;
  const yellowCount = alerts.filter((a) => a.level === 'yellow' && !a.resolved).length;

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{unresolvedCount}</div>
            <div className="text-xs text-gray-500">Tổng chưa xử lý</div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-red-700">{redCount}</div>
            <div className="text-xs text-red-500">Cảnh báo đỏ</div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-700">{yellowCount}</div>
            <div className="text-xs text-yellow-500">Cảnh báo vàng</div>
          </div>
        </div>
      </div>

      {/* Category sections */}
      {categories.map((cat) => (
        cat.items.length > 0 && (
          <div key={cat.title} className={`${cat.bg} border ${cat.border} rounded-xl overflow-hidden`}>
            <div className={`flex items-center gap-2 px-5 py-3 border-b ${cat.border}`}>
              {cat.icon}
              <h3 className="font-semibold text-gray-700 text-sm">{cat.title}</h3>
              <span className="ml-auto text-xs font-bold text-gray-600 bg-white/60 px-2 py-0.5 rounded-full">{cat.items.length}</span>
            </div>
            <div className="divide-y divide-white/50">
              {cat.items.map((a) => (
                <div key={a.id} className="flex items-start gap-3 px-5 py-3">
                  <div className={`mt-0.5 flex-shrink-0 ${a.level === 'red' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {TYPE_ICONS[a.type] ?? <Bell className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{a.message}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {a.subjectName && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Users className="w-3 h-3" /> {a.subjectName}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{a.unit}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-400">{a.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge level={a.level}>
                      {a.level === 'red' ? 'Đỏ' : a.level === 'yellow' ? 'Vàng' : 'Xanh'}
                    </Badge>
                    <Badge level="blue">{TYPE_LABELS[a.type]}</Badge>
                    <button
                      onClick={() => resolveAlert(a.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2.5 py-1 rounded-lg hover:bg-white/80 transition ml-1"
                    >
                      Xử lý
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}

      {unresolvedCount === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-10 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-green-700 font-semibold text-lg">Tất cả cảnh báo đã được xử lý</h3>
          <p className="text-green-500 text-sm mt-1">Hệ thống đang hoạt động bình thường</p>
        </div>
      )}

      {/* Resolved section */}
      {alerts.filter((a) => a.resolved).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-600">Lịch sử đã xử lý ({alerts.filter((a) => a.resolved).length})</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {alerts.filter((a) => a.resolved).map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3 opacity-50">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 line-through truncate">{a.message}</p>
                  <p className="text-xs text-gray-400">{a.subjectName} • {a.unit}</p>
                </div>
                <Badge level="green">Đã xử lý</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
