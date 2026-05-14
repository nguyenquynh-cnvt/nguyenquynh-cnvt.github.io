import { Users, Shield, Server, Database, Settings } from 'lucide-react';
import { MOCK_USERS } from '../data/mockData';
import Badge from '../components/ui/Badge';

const ROLE_LABELS: Record<string, string> = {
  admin_tinh: 'Admin tỉnh',
  cong_an_xa: 'Công an xã',
  co_so_cai_nghien: 'Cơ sở cai nghiện',
};
const ROLE_COLORS: Record<string, 'red' | 'blue' | 'green'> = {
  admin_tinh: 'red',
  cong_an_xa: 'blue',
  co_so_cai_nghien: 'green',
};

export default function AdminPage() {
  const systemInfo = [
    { label: 'Phiên bản hệ thống', value: 'PM-483 v1.0.0' },
    { label: 'Ngày triển khai', value: '01/05/2026' },
    { label: 'Chế độ hoạt động', value: 'Demo — LAN nội bộ' },
    { label: 'Số máy kết nối tối đa', value: '5–7 máy' },
    { label: 'Cơ sở dữ liệu', value: 'Local State (Demo)' },
    { label: 'Đơn vị triển khai', value: 'Công an tỉnh Gia Lai' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Tài khoản', value: MOCK_USERS.length, color: 'bg-blue-700' },
          { icon: Shield, label: 'Phân quyền', value: 3, color: 'bg-green-700' },
          { icon: Database, label: 'Bản ghi', value: '55+', color: 'bg-orange-600' },
          { icon: Server, label: 'Trạng thái', value: 'Online', color: 'bg-teal-600' },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <item.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">{item.value}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <Users className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-700">Quản lý tài khoản người dùng</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_USERS.map((user) => (
              <div key={user.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                  {user.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800">{user.fullName}</div>
                  <div className="text-xs text-gray-400 truncate">{user.unit}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">{user.username}</code>
                  <Badge level={ROLE_COLORS[user.role]}>{ROLE_LABELS[user.role]}</Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400">Mật khẩu demo mặc định: <code className="bg-white border border-gray-200 px-1.5 py-0.5 rounded">123456</code></p>
          </div>
        </div>

        {/* System info */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <Settings className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold text-gray-700">Thông tin hệ thống</h3>
          </div>
          <dl className="divide-y divide-gray-100">
            {systemInfo.map((item) => (
              <div key={item.label} className="flex items-center px-5 py-3">
                <dt className="text-sm text-gray-500 w-48 flex-shrink-0">{item.label}</dt>
                <dd className="text-sm font-medium text-gray-800">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Role matrix */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <Shield className="w-4 h-4 text-red-600" />
          <h3 className="font-semibold text-gray-700">Ma trận phân quyền</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Chức năng</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-red-600">Admin tỉnh</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-blue-600">Công an xã</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-green-600">Cơ sở cai nghiện</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ['Dashboard', true, true, true],
                ['Quản lý đối tượng', true, true, false],
                ['Vụ việc hằng ngày', true, true, false],
                ['Cai nghiện bắt buộc', true, false, true],
                ['Quản lý sau cai', true, true, false],
                ['Đối chiếu dữ liệu', true, false, false],
                ['Hệ thống cảnh báo', true, true, true],
                ['Báo cáo thống kê', true, true, true],
                ['Quản trị hệ thống', true, false, false],
              ].map(([func, admin, cax, coso]) => (
                <tr key={func as string} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-700">{func as string}</td>
                  {[admin, cax, coso].map((has, i) => (
                    <td key={i} className="px-4 py-2.5 text-center">
                      {has ? (
                        <span className="text-green-500 font-bold">✓</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#0d2244] rounded-xl p-5 text-center">
        <p className="text-blue-300 text-sm">PM-483 — Hệ thống quản lý nghiệp vụ phòng chống ma túy</p>
        <p className="text-blue-500/60 text-xs mt-1">Phiên bản demo nội bộ — Công an tỉnh Gia Lai • 2026</p>
      </div>
    </div>
  );
}
