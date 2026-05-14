import { useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Treatment, TreatmentStatus } from '../types';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

const STATUS_LABELS: Record<TreatmentStatus, string> = {
  dang_cai: 'Đang cai nghiện',
  hoan_thanh: 'Hoàn thành',
};
const STATUS_COLORS: Record<TreatmentStatus, 'blue' | 'green'> = {
  dang_cai: 'blue',
  hoan_thanh: 'green',
};

const EMPTY: Omit<Treatment, 'id'> = {
  subjectId: '',
  subjectName: '',
  admissionDate: new Date().toISOString().split('T')[0],
  facility: '',
  duration: 24,
  status: 'dang_cai',
};

export default function TreatmentPage() {
  const { treatments, subjects, addTreatment, updateTreatment, deleteTreatment } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<TreatmentStatus | ''>('');
  const [modal, setModal] = useState<null | 'add' | 'edit'>(null);
  const [selected, setSelected] = useState<Treatment | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteConfirm, setDeleteConfirm] = useState<Treatment | null>(null);

  const filtered = treatments.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.subjectName.toLowerCase().includes(q) || t.facility.toLowerCase().includes(q);
    const matchStatus = !filterStatus || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setForm(EMPTY);
    setModal('add');
  };

  const openEdit = (t: Treatment) => {
    setSelected(t);
    setForm({ subjectId: t.subjectId, subjectName: t.subjectName, admissionDate: t.admissionDate, facility: t.facility, duration: t.duration, status: t.status, completionDate: t.completionDate, notes: t.notes });
    setModal('edit');
  };

  const handleSave = () => {
    if (!form.subjectName.trim() || !form.facility.trim()) return;
    if (modal === 'add') addTreatment(form);
    else if (modal === 'edit' && selected) updateTreatment(selected.id, form);
    setModal(null);
  };

  const handleSubjectSelect = (subjectId: string) => {
    const s = subjects.find((s) => s.id === subjectId);
    if (s) setForm({ ...form, subjectId: s.id, subjectName: s.fullName });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Tìm kiếm theo tên, cơ sở..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as TreatmentStatus | '')} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">Tất cả trạng thái</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus className="w-4 h-4" /> Thêm hồ sơ
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-800">{treatments.filter((t) => t.status === 'dang_cai').length}</div>
          <div className="text-xs text-blue-600 mt-0.5">Đang điều trị</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-800">{treatments.filter((t) => t.status === 'hoan_thanh').length}</div>
          <div className="text-xs text-green-600 mt-0.5">Đã hoàn thành</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Họ tên</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ngày tiếp nhận</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cơ sở cai nghiện</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Thời hạn (tháng)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Ngày kết thúc</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Trạng thái</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{t.subjectName}</td>
                  <td className="px-4 py-3 text-gray-600">{t.admissionDate}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{t.facility}</td>
                  <td className="px-4 py-3 text-center text-gray-700 hidden md:table-cell">{t.duration}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{t.completionDate ?? '—'}</td>
                  <td className="px-4 py-3"><Badge level={STATUS_COLORS[t.status]}>{STATUS_LABELS[t.status]}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(t)} className="p-1.5 rounded text-gray-400 hover:text-green-600 hover:bg-green-50 transition"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteConfirm(t)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition"><Trash2 className="w-3.5 h-3.5" /></button>
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
        <Modal title={modal === 'add' ? 'Thêm hồ sơ cai nghiện' : 'Chỉnh sửa hồ sơ'} onClose={() => setModal(null)} size="lg">
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chọn đối tượng</label>
                <select value={form.subjectId} onChange={(e) => handleSubjectSelect(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">-- Chọn đối tượng --</option>
                  {subjects.map((s) => <option key={s.id} value={s.id}>{s.fullName} ({s.cccd})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tiếp nhận</label>
                <input type="date" value={form.admissionDate} onChange={(e) => setForm({ ...form, admissionDate: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thời hạn (tháng)</label>
                <input type="number" min={1} max={48} value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 12 })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cơ sở cai nghiện <span className="text-red-500">*</span></label>
                <input value={form.facility} onChange={(e) => setForm({ ...form, facility: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TreatmentStatus })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hoàn thành</label>
                <input type="date" value={form.completionDate ?? ''} onChange={(e) => setForm({ ...form, completionDate: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea value={form.notes ?? ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
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
            <p className="text-sm text-gray-600">Xóa hồ sơ cai nghiện của <strong>{deleteConfirm.subjectName}</strong>?</p>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">Hủy</button>
              <button onClick={() => { deleteTreatment(deleteConfirm.id); setDeleteConfirm(null); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition">Xóa</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
