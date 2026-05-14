import {
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  UserCheck,
  GitCompare,
  Bell,
  BarChart3,
  Settings,
  Shield,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'subjects', label: 'Quản lý đối tượng', icon: Users },
  { id: 'incidents', label: 'Vụ việc', icon: FileText },
  { id: 'treatment', label: 'Cai nghiện bắt buộc', icon: Building2 },
  { id: 'post-treatment', label: 'Quản lý sau cai', icon: UserCheck },
  { id: 'data-check', label: 'Đối chiếu dữ liệu', icon: GitCompare },
  { id: 'alerts', label: 'Cảnh báo', icon: Bell },
  { id: 'reports', label: 'Báo cáo thống kê', icon: BarChart3 },
  { id: 'admin', label: 'Quản trị hệ thống', icon: Settings },
];

const ROLE_LABELS: Record<string, string> = {
  admin_tinh: 'Admin tỉnh',
  cong_an_xa: 'Công an xã',
  co_so_cai_nghien: 'Cơ sở cai nghiện',
};

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const { activePage, setActivePage, currentUser, logout, alerts } = useApp();
  const unresolved = alerts.filter((a) => !a.resolved && a.level === 'red').length;

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-[#0d2244] border-r border-blue-900/50 flex flex-col z-30 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b border-blue-900/50 ${collapsed ? 'justify-center' : ''}`}>
        <div className="flex-shrink-0 w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-white font-bold text-sm leading-tight">PM-483</div>
            <div className="text-blue-400 text-xs leading-tight truncate">Phòng chống ma túy</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;
          const hasAlertBadge = item.id === 'alerts' && unresolved > 0;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                active
                  ? 'bg-blue-700 text-white shadow-lg shadow-blue-900/40'
                  : 'text-blue-200/70 hover:bg-blue-800/50 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`flex-shrink-0 w-5 h-5 ${active ? 'text-white' : 'text-blue-300/70 group-hover:text-white'}`} />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                  {hasAlertBadge && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                      {unresolved}
                    </span>
                  )}
                  {active && <ChevronRight className="w-4 h-4 opacity-60" />}
                </>
              )}
              {collapsed && hasAlertBadge && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#0d2244]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className={`border-t border-blue-900/50 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
        {!collapsed && currentUser && (
          <div className="mb-2 px-2">
            <div className="text-white text-sm font-medium truncate">{currentUser.fullName}</div>
            <div className="text-blue-400 text-xs">{ROLE_LABELS[currentUser.role]}</div>
            <div className="text-blue-500/60 text-xs truncate">{currentUser.unit}</div>
          </div>
        )}
        <button
          onClick={logout}
          className={`flex items-center gap-2 text-blue-300/60 hover:text-red-400 transition px-2 py-1.5 rounded-lg hover:bg-red-900/20 ${collapsed ? 'justify-center w-full' : 'w-full'}`}
          title="Đăng xuất"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}
