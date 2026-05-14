import { useState } from 'react';
import { Download, FileText, BarChart3, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';

export default function ReportsPage() {
  const { subjects, incidents, treatments, postTreatments, alerts } = useApp();
  const [reportType, setReportType] = useState<'day' | 'month'>('month');
  const [exportMsg, setExportMsg] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todayIncidents = incidents.filter((i) => i.date === today);

  const handleExport = (type: 'pdf' | 'excel') => {
    setExportMsg(`Đang xuất ${type === 'pdf' ? 'PDF' : 'Excel'}... (Giả lập — chức năng sẽ hoạt động sau khi tích hợp thực tế)`);
    setTimeout(() => setExportMsg(''), 3000);
  };

  const monthlyStats = [
    { label: 'T1', value: 4 },
    { label: 'T2', value: 6 },
    { label: 'T3', value: 3 },
    { label: 'T4', value: 8 },
    { label: 'T5', value: incidents.length },
    { label: 'T6', value: 0 },
    { label: 'T7', value: 0 },
    { label: 'T8', value: 0 },
    { label: 'T9', value: 0 },
    { label: 'T10', value: 0 },
    { label: 'T11', value: 0 },
    { label: 'T12', value: 0 },
  ].map((d) => ({ ...d, color: d.value > 0 ? '#1e40af' : '#e5e7eb' }));

  const subjectTypePie = [
    { label: 'Người nghiện', value: subjects.filter((s) => s.type === 'nguoi_nghien').length, color: '#1e40af' },
    { label: 'Sử dụng trái phép', value: subjects.filter((s) => s.type === 'su_dung_trai_phep').length, color: '#dc2626' },
    { label: 'Sau cai', value: subjects.filter((s) => s.type === 'sau_cai').length, color: '#16a34a' },
    { label: 'Methadone', value: subjects.filter((s) => s.type === 'methadone').length, color: '#d97706' },
  ];

  const treatmentPie = [
    { label: 'Đang điều trị', value: treatments.filter((t) => t.status === 'dang_cai').length, color: '#1e40af' },
    { label: 'Hoàn thành', value: treatments.filter((t) => t.status === 'hoan_thanh').length, color: '#16a34a' },
  ];

  const summaryData = reportType === 'day'
    ? [
        { label: 'Vụ việc', value: todayIncidents.length },
        { label: 'Đối tượng', value: subjects.length },
        { label: 'Cảnh báo đỏ', value: alerts.filter((a) => a.level === 'red' && !a.resolved).length },
      ]
    : [
        { label: 'Tổng đối tượng', value: subjects.length },
        { label: 'Vụ việc tháng này', value: incidents.length },
        { label: 'Đang cai nghiện', value: treatments.filter((t) => t.status === 'dang_cai').length },
        { label: 'Hoàn thành cai', value: treatments.filter((t) => t.status === 'hoan_thanh').length },
        { label: 'Quản lý sau cai', value: postTreatments.length },
        { label: 'Cảnh báo chưa xử lý', value: alerts.filter((a) => !a.resolved).length },
      ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setReportType('day')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition border ${reportType === 'day' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
          >
            <Calendar className="w-4 h-4" /> Báo cáo ngày
          </button>
          <button
            onClick={() => setReportType('month')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition border ${reportType === 'month' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
          >
            <BarChart3 className="w-4 h-4" /> Báo cáo tháng
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition"
          >
            <Download className="w-4 h-4" /> Xuất PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition"
          >
            <Download className="w-4 h-4" /> Xuất Excel
          </button>
        </div>
      </div>

      {exportMsg && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
          {exportMsg}
        </div>
      )}

      {/* Report content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-[#0d2244] px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-300" />
            <div>
              <h2 className="text-white font-semibold">
                BÁO CÁO {reportType === 'day' ? 'NGÀY' : 'THÁNG 5'} — HỆ THỐNG PM-483
              </h2>
              <p className="text-blue-300 text-xs mt-0.5">
                Công an tỉnh Gia Lai — Phòng chống ma túy • Ngày: {new Date().toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary numbers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">I. Số liệu tổng hợp</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {summaryData.map((item) => (
                <div key={item.label} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-lg font-bold text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {reportType === 'day' ? (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">II. Vụ việc trong ngày</h3>
              {todayIncidents.length === 0 ? (
                <div className="text-center text-gray-400 py-8 border border-dashed border-gray-200 rounded-lg">Không có vụ việc nào hôm nay</div>
              ) : (
                <div className="space-y-2">
                  {todayIncidents.map((inc, i) => (
                    <div key={inc.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-gray-400 text-sm font-mono w-6">{i + 1}.</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{inc.description}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{inc.location} — {inc.subjectCount} đối tượng — {inc.unit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">II. Phân tích vụ việc theo tháng</h3>
                <BarChart data={monthlyStats} title="Số vụ việc phát sinh theo tháng (2026)" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <PieChart data={subjectTypePie} title="Phân loại đối tượng quản lý" />
                <PieChart data={treatmentPie} title="Tình trạng cai nghiện" />
              </div>
            </>
          )}

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between text-xs text-gray-400">
              <span>PM-483 — Hệ thống quản lý phòng chống ma túy</span>
              <span>In lúc: {new Date().toLocaleString('vi-VN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
