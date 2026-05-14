import { Users, AlertTriangle, UserCheck, Building2, FileText, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/ui/StatCard';
import PieChart from '../components/charts/PieChart';
import BarChart from '../components/charts/BarChart';
import Badge from '../components/ui/Badge';

const SUBJECT_TYPE_LABELS: Record<string, string> = {
  nguoi_nghien: 'Người nghiện',
  su_dung_trai_phep: 'Sử dụng trái phép',
  sau_cai: 'Sau cai',
  methadone: 'Điều trị Methadone',
};

const ALERT_LEVEL_LABELS: Record<string, string> = {
  red: 'Nghiêm trọng',
  yellow: 'Cần chú ý',
  green: 'Bình thường',
};

export default function DashboardPage() {
  const { subjects, incidents, treatments, postTreatments, alerts, setActivePage } = useApp();

  const nguoiNghien = subjects.filter((s) => s.type === 'nguoi_nghien').length;
  const suDungTraiPhep = subjects.filter((s) => s.type === 'su_dung_trai_phep').length;
  const sauCai = subjects.filter((s) => s.type === 'sau_cai').length;
  const dangCai = treatments.filter((t) => t.status === 'dang_cai').length;

  const today = new Date().toISOString().split('T')[0];
  const todayIncidents = incidents.filter((i) => i.date === today).length;

  const unresolvedAlerts = alerts.filter((a) => !a.resolved);
  const redAlerts = unresolvedAlerts.filter((a) => a.level === 'red');

  const pieData = [
    { label: 'Người nghiện', value: nguoiNghien, color: '#1e40af' },
    { label: 'Sử dụng trái phép', value: suDungTraiPhep, color: '#dc2626' },
    { label: 'Sau cai', value: sauCai, color: '#16a34a' },
    { label: 'Methadone', value: subjects.filter((s) => s.type === 'methadone').length, color: '#d97706' },
  ];

  const barData = [
    { label: 'Tiếp nhận', value: treatments.length, target: 15, color: '#1e40af' },
    { label: 'Đang cai', value: dangCai, target: 12, color: '#0891b2' },
    { label: 'Hoàn thành', value: treatments.filter((t) => t.status === 'hoan_thanh').length, target: 8, color: '#16a34a' },
    { label: 'Sau cai QL', value: postTreatments.length, target: 8, color: '#7c3aed' },
    { label: 'Cảnh báo', value: redAlerts.length, target: 0, color: '#dc2626' },
  ];

  const monthlyBar = [
    { label: 'T1', value: 3, color: '#1e40af' },
    { label: 'T2', value: 5, color: '#1e40af' },
    { label: 'T3', value: 4, color: '#1e40af' },
    { label: 'T4', value: 7, color: '#1e40af' },
    { label: 'T5', value: incidents.length, color: '#1e40af' },
    { label: 'T6', value: 2, color: '#93c5fd' },
    { label: 'T7', value: 1, color: '#93c5fd' },
    { label: 'T8', value: 0, color: '#93c5fd' },
    { label: 'T9', value: 0, color: '#93c5fd' },
    { label: 'T10', value: 0, color: '#93c5fd' },
    { label: 'T11', value: 0, color: '#93c5fd' },
    { label: 'T12', value: 0, color: '#93c5fd' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Người nghiện" value={nguoiNghien} icon={Users} color="blue" subtitle="Đang quản lý" trend={{ value: 5, label: 'so tháng trước' }} />
        <StatCard title="Sử dụng trái phép" value={suDungTraiPhep} icon={AlertTriangle} color="red" subtitle="Đang quản lý" trend={{ value: 2, label: 'so tháng trước' }} />
        <StatCard title="Sau cai" value={sauCai} icon={UserCheck} color="green" subtitle="Đang theo dõi" />
        <StatCard title="Cai nghiện BB" value={dangCai} icon={Building2} color="orange" subtitle="Đang điều trị" />
        <StatCard title="Vụ việc hôm nay" value={todayIncidents} icon={FileText} color="teal" subtitle={`Tổng tháng: ${incidents.length}`} />
        <StatCard title="Cảnh báo đỏ" value={redAlerts.length} icon={Bell} color="red" subtitle="Chưa xử lý" trend={{ value: redAlerts.length, label: 'chưa giải quyết' }} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <PieChart
          title="Phân loại đối tượng"
          data={pieData}
        />
        <div className="lg:col-span-2">
          <BarChart
            title="Tiến độ thực hiện chỉ tiêu 2026"
            subtitle="So sánh thực hiện và chỉ tiêu đặt ra"
            data={barData}
          />
        </div>
      </div>

      {/* Monthly incidents chart */}
      <BarChart
        title="Vụ việc phát sinh theo tháng (2026)"
        subtitle="Số vụ việc phát sinh từng tháng trong năm"
        data={monthlyBar}
      />

      {/* Alerts table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Bell className="w-4 h-4 text-red-500" />
            Cảnh báo mới nhất
          </h3>
          <button
            onClick={() => setActivePage('alerts')}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Xem tất cả
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {unresolvedAlerts.slice(0, 6).map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 px-5 py-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                alert.level === 'red' ? 'bg-red-500' :
                alert.level === 'yellow' ? 'bg-yellow-400' : 'bg-green-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{alert.message}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {alert.subjectName && (
                    <span className="text-xs text-gray-500">{alert.subjectName}</span>
                  )}
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{alert.unit}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge level={alert.level}>{ALERT_LEVEL_LABELS[alert.level]}</Badge>
                <span className="text-xs text-gray-400 hidden sm:block">{alert.createdAt}</span>
              </div>
            </div>
          ))}
          {unresolvedAlerts.length === 0 && (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">Không có cảnh báo nào</div>
          )}
        </div>
      </div>

      {/* Quick summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Phân bổ theo đơn vị</h3>
          <div className="space-y-2">
            {Object.entries(
              subjects.reduce<Record<string, number>>((acc, s) => {
                acc[s.unit] = (acc[s.unit] ?? 0) + 1;
                return acc;
              }, {})
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([unit, count]) => (
                <div key={unit} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-600 truncate">{unit}</div>
                    <div className="mt-0.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${(count / subjects.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-5 text-right">{count}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Vụ việc gần đây</h3>
          <div className="space-y-2">
            {incidents.slice(0, 5).map((inc) => (
              <div key={inc.id} className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  inc.status === 'cho_xu_ly' ? 'bg-red-500' :
                  inc.status === 'dang_xu_ly' ? 'bg-yellow-400' : 'bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 truncate">{inc.description}</p>
                  <p className="text-xs text-gray-400">{inc.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Tình trạng cai nghiện</h3>
          <div className="space-y-3">
            {[
              { label: 'Đang điều trị', value: treatments.filter((t) => t.status === 'dang_cai').length, color: 'bg-blue-500' },
              { label: 'Hoàn thành', value: treatments.filter((t) => t.status === 'hoan_thanh').length, color: 'bg-green-500' },
              { label: 'Có hồ sơ sau cai', value: postTreatments.length, color: 'bg-teal-500' },
              { label: 'Mất liên lạc', value: postTreatments.filter((pt) => pt.managementStatus === 'mat_lien_lac').length, color: 'bg-orange-500' },
              { label: 'Tái phạm', value: postTreatments.filter((pt) => pt.managementStatus === 'tai_pham').length, color: 'bg-red-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-xs text-gray-600">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
