import { useState } from 'react';
import { Plus, Search, Filter, Pencil, Trash2, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Subject, SubjectType } from '../types';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

const TYPE_LABELS: Record<SubjectType, string> = {
  nguoi_nghien: 'Người nghiện',
  su_dung_trai_phep: 'Sử dụng trái phép',
  sau_cai: 'Sau cai',
  methadone: 'Điều trị Methadone',
};

const TYPE_COLORS: Record<SubjectType, 'blue' | 'red' | 'green' | 'orange'> = {
  nguoi_nghien: 'blue',
  su_dung_trai_phep: 'red',
  sau_cai: 'green',
  methadone: 'orange',
};

const EMPTY_FORM = {
  fullName: '',
  cccd: '',
  dob: '',
  address: '',
  unit: '',
  type: 'nguoi_nghien' as SubjectType,
  notes: '',
};

export default function SubjectsPage() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<SubjectType | ''>('');
  const [modal, setModal] = useState<null | 'add' | 'edit' | 'view'>(null);
  const [selected, setSelected] = useState<Subject | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<Subject | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = subjects.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.fullName.toLowerCase().includes(q) || s.cccd.includes(q) || s.unit.toLowerCase().includes(q);
    const matchType = !filterType || s.type === filterType;
    return matchSearch && matchType;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal('add');
  };

  const openEdit = (s: Subject) => {
    setSelected(s);
    setForm({ fullName: s.fullName, cccd: s.cccd, dob: s.dob, address: s.address, unit: s.unit, type: s.type, notes: s.notes ?? '' });
    setModal('edit');
  };

  const openView = (s: Subject) => {
    setSelected(s);
    setModal('view');
  };

  const handleSave = () => {
    if (!form.fullName.trim() || !form.cccd.trim()) return;
    if (modal === 'add') {
      addSubject(form);
    } else if (modal === 'edit' && selected) {
      updateSubject(selected.id, form);
    }
    setModal(null);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteSubject(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleFilterChange = (v: string) => {
    setFilterType(v as SubjectType | '');
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, CCCD, đơn vị..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Tất cả loại</option>
            {Object.entries(TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Thêm đối tượng
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex gap-3 flex-wrap">
        {Object.entries(TYPE_LABELS).map(([type, label]) => {
          const count = subjects.filter((s) => s.type === type).length;
          return (
            <button
              key={type}
              onClick={() => handleFilterChange(filterType === type ? '' : type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                filterType === type ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {label}: <span className="font-bold">{count}</span>
            </button>
          );
        })}
        <div className="flex items-center px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-500">
          Tổng: <span className="font-bold ml-1">{subjects.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-8">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Họ tên</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">CCCD</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Ngày sinh</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Đơn vị QL</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Loại</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Ngày tạo</th>
                <th className="px-4 py-3 w-28" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map((s, idx) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{(page - 1) * PER_PAGE + idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{s.fullName}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{s.cccd || <span className="text-yellow-500 italic">Chưa có</span>}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{s.dob}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell max-w-xs truncate">{s.unit}</td>
                  <td className="px-4 py-3">
                    <Badge level={TYPE_COLORS[s.type]}>{TYPE_LABELS[s.type]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{s.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openView(s)} className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition" title="Xem">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded text-gray-400 hover:text-green-600 hover:bg-green-50 transition" title="Sửa">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteConfirm(s)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition" title="Xóa">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">Không tìm thấy dữ liệu phù hợp</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <span className="text-xs text-gray-500">
              Hiển thị {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} / {filtered.length} bản ghi
            </span>
            <div className="flex gap-1">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-2.5 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-100">Trước</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`px-2.5 py-1 text-xs border rounded ${p === page ? 'bg-blue-700 text-white border-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}>{p}</button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-2.5 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-100">Sau</button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Thêm đối tượng mới' : 'Chỉnh sửa thông tin'} onClose={() => setModal(null)} size="lg">
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số CCCD <span className="text-red-500">*</span></label>
                <input value={form.cccd} onChange={(e) => setForm({ ...form, cccd: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị quản lý</label>
                <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại đối tượng</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as SubjectType })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">Hủy</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition">
                {modal === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {modal === 'view' && selected && (
        <Modal title="Chi tiết đối tượng" onClose={() => setModal(null)}>
          <div className="p-5">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                {selected.fullName.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{selected.fullName}</h2>
                <Badge level={TYPE_COLORS[selected.type]}>{TYPE_LABELS[selected.type]}</Badge>
              </div>
            </div>
            <dl className="space-y-3">
              {[
                { label: 'Số CCCD', value: selected.cccd || 'Chưa cập nhật' },
                { label: 'Ngày sinh', value: selected.dob },
                { label: 'Địa chỉ', value: selected.address },
                { label: 'Đơn vị quản lý', value: selected.unit },
                { label: 'Ngày tạo hồ sơ', value: selected.createdAt },
                { label: 'Ghi chú', value: selected.notes || '—' },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <dt className="text-sm font-medium text-gray-500 w-40 flex-shrink-0">{item.label}</dt>
                  <dd className="text-sm text-gray-800">{item.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">Đóng</button>
              <button onClick={() => openEdit(selected)} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition">Chỉnh sửa</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <Modal title="Xác nhận xóa" onClose={() => setDeleteConfirm(null)} size="sm">
          <div className="p-5">
            <p className="text-sm text-gray-600">
              Bạn có chắc chắn muốn xóa đối tượng <strong>{deleteConfirm.fullName}</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">Hủy</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition">Xóa</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
