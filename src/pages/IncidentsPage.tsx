import { useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Incident, IncidentStatus } from '../types';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

const STATUS_LABELS: Record<IncidentStatus, string> = {
  cho_xu_ly: 'Chờ xử lý',
  dang_xu_ly: 'Đang xử lý',
  da_xu_ly: 'Đã xử lý',
};
const STATUS_COLORS: Record<IncidentStatus, 'red' | 'yellow' | 'green'> = {
  cho_xu_ly: 'red',
  dang_xu_ly: 'yellow',
  da_xu_ly: 'green',
};

const EMPTY: Omit<Incident, 'id' | 'createdAt'> = {
  date: new Date().toISOString().split('T')[0],
  location: '',
  description: '',
  subjectCount: 1,
  status: 'cho_xu_ly',
  unit: '',
};

export default function IncidentsPage() {
  const { incidents, addIncident, updateIncident, deleteIncident } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<IncidentStatus | ''>('');
  const [filterDate, setFilterDate] = useState('');
  const [modal, setModal] = useState<null | 'add' | 'edit'>(null);
  const [selected, setSelected] = useState<Incident | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteConfirm, setDeleteConfirm] = useState<Incident | null>(null);

  const filtered = incidents.filter((i) => {
    const q = search.toLowerCase();
    const matchSearch = !q || i.description.toLowerCase().includes(q) || i.location.toLowerCase().includes(q) || i.unit.toLowerCase().includes(q);
    const matchStatus = !filterStatus || i.status === filterStatus;
    const matchDate = !filterDate || i.date === filterDate;
    return matchSearch && matchStatus && matchDate;
  });

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (i: Incident) => {
    setSelected(i);
    setForm({ date: i.date, location: i.location, description: i.description, subjectCount: i.subjectCount, status: i.status, unit: i.unit });
    setModal('edit');
  };

  const handleSave = () => {
    if (!form.description.trim()) return;
    if (modal === 'add') addIncident(form);
    else if (modal === 'edit' && selected) updateIncident(selected.id, form);
    setModal(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Tìm kiếm vụ việc..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as IncidentStatus | '')} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">Tất cả trạng thái</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus className="w-4 h-4" /> Thêm vụ việc
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <div key={status} className={`rounded-lg border p-3 ${status === 'cho_xu_ly' ? 'bg-red-50 border-red-200' : status === 'dang_xu_ly' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
            <div className="text-2xl font-bold text-gray-800">{incidents.filter((i) => i.status === status).length}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ngày</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Địa điểm</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nội dung</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Đơn vị</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Đối tượng</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Trạng thái</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((inc) => (
                <tr key={inc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{inc.date}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-[150px] truncate">{inc.location}</td>
                  <td className="px-4 py-3 text-gray-800 max-w-xs truncate">{inc.description}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell max-w-[120px] truncate">{inc.unit}</td>
                  <td className="px-4 py-3 text-center font-semibold text-gray-700">{inc.subjectCount}</td>
                  <td className="px-4 py-3"><Badge level={STATUS_COLORS[inc.status]}>{STATUS_LABELS[inc.status]}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(inc)} className="p-1.5 rounded text-gray-400 hover:text-green-600 hover:bg-green-50 transition"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteConfirm(inc)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">Không có dữ liệu</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Thêm vụ việc mới' : 'Chỉnh sửa vụ việc'} onClose={() => setModal(null)} size="lg">
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày vụ việc</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số đối tượng liên quan</label>
                <input type="number" min={1} value={form.subjectCount} onChange={(e) => setForm({ ...form, subjectCount: parseInt(e.target.value) || 1 })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung vụ việc <span className="text-red-500">*</span></label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái xử lý</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as IncidentStatus })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">Hủy</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition">{modal === 'add' ? 'Thêm mới' : 'Lưu'}</button>
            </div>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal title="Xác nhận xóa" onClose={() => setDeleteConfirm(null)} size="sm">
          <div className="p-5">
            <p className="text-sm text-gray-600">Xóa vụ việc ngày <strong>{deleteConfirm.date}</strong>: "{deleteConfirm.description}"?</p>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">Hủy</button>
              <button onClick={() => { deleteIncident(deleteConfirm.id); setDeleteConfirm(null); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition">Xóa</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
