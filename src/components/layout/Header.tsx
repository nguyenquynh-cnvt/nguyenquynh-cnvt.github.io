import { Menu, Bell, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard Tổng Quan',
  subjects: 'Quản Lý Đối Tượng',
  incidents: 'Quản Lý Vụ Việc Hằng Ngày',
  treatment: 'Quản Lý Cai Nghiện Bắt Buộc',
  'post-treatment': 'Quản Lý Sau Cai',
  'data-check': 'Đối Chiếu Dữ Liệu Tự Động',
  alerts: 'Hệ Thống Cảnh Báo',
  reports: 'Báo Cáo Thống Kê',
  admin: 'Quản Trị Hệ Thống',
};

interface HeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

export default function Header({ collapsed, onToggleSidebar }: HeaderProps) {
  const { activePage, alerts, currentUser } = useApp();
  const unresolved = alerts.filter((a) => !a.resolved && a.level === 'red').length;
  const now = new Date();
  const dateStr = now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header
      className={`fixed top-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center z-20 shadow-sm transition-all duration-300 ${collapsed ? 'left-16' : 'left-64'}`}
    >
      <div className="flex items-center gap-3 px-4 flex-1 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-gray-800 font-semibold text-sm truncate">
            PM-483 — {PAGE_TITLES[activePage] ?? activePage}
          </h1>
          <p className="text-gray-400 text-xs hidden sm:block">{dateStr}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4">
        <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition" title="Làm mới">
          <RefreshCw className="w-4 h-4" />
        </button>

        <button className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition">
          <Bell className="w-4 h-4" />
          {unresolved > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>

        {currentUser && (
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200 ml-1">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="hidden md:block">
              <div className="text-gray-700 text-xs font-medium leading-tight">{currentUser.fullName}</div>
              <div className="text-gray-400 text-xs leading-tight">{currentUser.unit}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
