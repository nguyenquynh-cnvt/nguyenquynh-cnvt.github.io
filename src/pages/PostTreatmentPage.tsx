import { useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PostTreatment } from '../types';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

type MgmtStatus = PostTreatment['managementStatus'];

const STATUS_LABELS: Record<MgmtStatus, string> = {
  dang_quan_ly: 'Đang quản lý',
  mat_lien_lac: 'Mất liên lạc',
  tai_pham: 'Tái phạm',
};
const STATUS_COLORS: Record<MgmtStatus, 'green' | 'yellow' | 'red'> = {
  dang_quan_ly: 'green',
  mat_lien_lac: 'yellow',
  tai_pham: 'red',
};

const EMPTY: Omit<PostTreatment, 'id'> = {
  subjectId: '',
  subjectName: '',
  handoverDate: new Date().toISOString().split('T')[0],
  receivingUnit: '',
  officerInCharge: '',
  managementStatus: 'dang_quan_ly',
};

export default function PostTreatmentPage() {
  const { postTreatments, subjects, addPostTreatment, updatePostTreatment, deletePostTreatment } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<MgmtStatus | ''>('');
  const [modal, setModal] = useState<null | 'add' | 'edit'>(null);
  const [selected, setSelected] = useState<PostTreatment | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteConfirm, setDeleteConfirm] = useState<PostTreatment | null>(null);

  const filtered = postTreatments.filter((pt) => {
    const q = search.toLowerCase();
    const matchSearch = !q || pt.subjectName.toLowerCase().includes(q) || pt.receivingUnit.toLowerCase().includes(q) || pt.officerInCharge.toLowerCase().includes(q);
    const matchStatus = !filterStatus || pt.managementStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (pt: PostTreatment) => {
    setSelected(pt);
    setForm({ subjectId: pt.subjectId, subjectName: pt.subjectName, handoverDate: pt.handoverDate, receivingUnit: pt.receivingUnit, officerInCharge: pt.officerInCharge, managementStatus: pt.managementStatus, notes: pt.notes });
    setModal('edit');
  };

  const handleSave = () => {
    if (!form.subjectName.trim() || !form.receivingUnit.trim()) return;
    if (modal === 'add') addPostTreatment(form);
    else if (modal === 'edit' && selected) updatePostTreatment(selected.id, form);
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
          <input type="text" placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as MgmtStatus | '')} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">Tất cả tình trạng</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus className="w-4 h-4" /> Thêm hồ sơ
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Object.entries(STATUS_LABELS).map(([status, label]) => {
          const count = postTreatments.filter((pt) => pt.managementStatus === status).length;
          const colors: Record<string, string> = { dang_quan_ly: 'bg-green-50 border-green-200 text-green-800 text-green-600', mat_lien_lac: 'bg-yellow-50 border-yellow-200 text-yellow-800 text-yellow-600', tai_pham: 'bg-red-50 border-red-200 text-red-800 text-red-600' };
          const cls = colors[status].split(' ');
          return (
            <div key={status} className={`${cls[0]} border ${cls[1]} rounded-lg p-4`}>
              <div className={`text-2xl font-bold ${cls[2]}`}>{count}</div>
              <div className={`text-xs ${cls[3]} mt-0.5`}>{label}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Họ tên</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ngày bàn giao</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Đơn vị tiếp nhận</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Cán bộ phụ trách</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tình trạng</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((pt) => (
                <tr key={pt.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{pt.subjectName}</td>
                  <td className="px-4 py-3 text-gray-600">{pt.handoverDate}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{pt.receivingUnit}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{pt.officerInCharge}</td>
                  <td className="px-4 py-3"><Badge level={STATUS_COLORS[pt.managementStatus]}>{STATUS_LABELS[pt.managementStatus]}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(pt)} className="p-1.5 rounded text-gray-400 hover:text-green-600 hover:bg-green-50 transition"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteConfirm(pt)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">Không có dữ liệu</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Thêm hồ sơ sau cai' : 'Chỉnh sửa hồ sơ sau cai'} onClose={() => setModal(null)} size="lg">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bàn giao</label>
                <input type="date" value={form.handoverDate} onChange={(e) => setForm({ ...form, handoverDate: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng quản lý</label>
                <select value={form.managementStatus} onChange={(e) => setForm({ ...form, managementStatus: e.target.value as MgmtStatus })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tiếp nhận <span className="text-red-500">*</span></label>
                <input value={form.receivingUnit} onChange={(e) => setForm({ ...form, receivingUnit: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cán bộ phụ trách</label>
                <input value={form.officerInCharge} onChange={(e) => setForm({ ...form, officerInCharge: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <input value={form.notes ?? ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
            <p className="text-sm text-gray-600">Xóa hồ sơ sau cai của <strong>{deleteConfirm.subjectName}</strong>?</p>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">Hủy</button>
              <button onClick={() => { deletePostTreatment(deleteConfirm.id); setDeleteConfirm(null); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition">Xóa</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
