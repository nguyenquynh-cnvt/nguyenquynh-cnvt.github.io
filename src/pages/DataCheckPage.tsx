import { RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/ui/Badge';

const TYPE_LABELS: Record<string, string> = {
  missing_post_treatment: 'Thiếu hồ sơ sau cai',
  missing_data: 'Thiếu thông tin',
  synced: 'Đồng bộ',
  late_report: 'Chậm báo cáo',
  unmanaged: 'Chưa có kế hoạch',
};

export default function DataCheckPage() {
  const { alerts, treatments, postTreatments, subjects, regenerateAlerts, resolveAlert } = useApp();

  const completedWithoutPost = treatments
    .filter((t) => t.status === 'hoan_thanh')
    .filter((t) => !postTreatments.find((pt) => pt.subjectId === t.subjectId));

  const missingData = subjects.filter((s) => !s.cccd || !s.address || !s.dob);

  const allAlerts = alerts;
  const redAlerts = allAlerts.filter((a) => a.level === 'red' && !a.resolved);
  const yellowAlerts = allAlerts.filter((a) => a.level === 'yellow' && !a.resolved);
  const greenAlerts = allAlerts.filter((a) => a.level === 'green');

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <XCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-red-800">{redAlerts.length}</div>
            <div className="text-xs text-red-600">Cảnh báo đỏ — Nghiêm trọng</div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-800">{yellowAlerts.length}</div>
            <div className="text-xs text-yellow-600">Cảnh báo vàng — Cần chú ý</div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-green-800">{greenAlerts.length}</div>
            <div className="text-xs text-green-600">Đã đồng bộ</div>
          </div>
        </div>
      </div>

      {/* Auto check */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700">Kiểm tra tự động</h3>
          <button
            onClick={regenerateAlerts}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" /> Chạy đối chiếu
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
            <div>
              <div className="text-sm font-medium text-red-700">Hoàn thành cai nghiện nhưng chưa có hồ sơ sau cai</div>
              <div className="text-xs text-red-500 mt-0.5">{completedWithoutPost.map(t => t.subjectName).join(', ') || 'Không có'}</div>
            </div>
            <Badge level="red">{completedWithoutPost.length} trường hợp</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div>
              <div className="text-sm font-medium text-yellow-700">Hồ sơ đối tượng thiếu thông tin bắt buộc</div>
              <div className="text-xs text-yellow-500 mt-0.5">{missingData.map(s => s.fullName).join(', ') || 'Không có'}</div>
            </div>
            <Badge level="yellow">{missingData.length} hồ sơ</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <div className="text-sm font-medium text-green-700">Hồ sơ có đầy đủ thông tin và đồng bộ</div>
              <div className="text-xs text-green-500 mt-0.5">Các đối tượng trong danh sách đã quản lý sau cai</div>
            </div>
            <Badge level="green">{postTreatments.length} hồ sơ</Badge>
          </div>
        </div>
      </div>

      {/* Discrepancy table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700">Danh sách sai lệch dữ liệu</h3>
          <p className="text-xs text-gray-400 mt-0.5">Các trường hợp cần xử lý theo mức độ ưu tiên</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Đối tượng</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Đơn vị</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Loại sai lệch</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nội dung</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Mức độ</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ngày</th>
                <th className="px-4 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allAlerts.filter((a) => !a.resolved).map((a) => (
                <tr key={a.id} className={`hover:bg-gray-50 transition-colors ${a.level === 'red' ? 'bg-red-50/30' : a.level === 'yellow' ? 'bg-yellow-50/30' : ''}`}>
                  <td className="px-4 py-3 font-medium text-gray-800">{a.subjectName || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-[140px] truncate">{a.unit}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{TYPE_LABELS[a.type]}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{a.message}</td>
                  <td className="px-4 py-3">
                    <Badge level={a.level}>
                      {a.level === 'red' ? 'Nghiêm trọng' : a.level === 'yellow' ? 'Cần chú ý' : 'OK'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{a.createdAt}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => resolveAlert(a.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition"
                    >
                      Đã xử lý
                    </button>
                  </td>
                </tr>
              ))}
              {allAlerts.filter((a) => !a.resolved).length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">Không có sai lệch nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolved */}
      {allAlerts.filter((a) => a.resolved).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700 text-sm">Đã xử lý</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {allAlerts.filter((a) => a.resolved).map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3 opacity-60">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 truncate line-through">{a.message}</p>
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
