import { useState } from 'react';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(username.trim(), password);
    if (!ok) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d2244] to-[#0a1628] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #1e40af 0, #1e40af 1px, transparent 0, transparent 50%)`,
          backgroundSize: '20px 20px',
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1e3a8a] border-4 border-[#3b82f6] mb-4 shadow-lg shadow-blue-900/50">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">PM-483</h1>
          <p className="text-blue-300 text-sm mt-1 font-medium">Quản lý phòng chống ma túy</p>
          <div className="mt-2 h-0.5 w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto" />
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white font-semibold text-lg mb-6 text-center">Đăng nhập hệ thống</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-1.5">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-blue-200 text-sm font-medium mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-11"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-900/40 border border-red-500/40 rounded-lg px-3 py-2.5 text-red-300 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Đang xác thực...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-white/40 text-xs text-center mb-3">Tài khoản demo</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Admin tỉnh', username: 'admin', role: 'admin_tinh' },
                { label: 'Công an xã', username: 'cax01', role: 'cong_an_xa' },
                { label: 'Cơ sở CN', username: 'coso01', role: 'co_so_cai_nghien' },
              ].map((acc) => (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => { setUsername(acc.username); setPassword('123456'); }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-2 text-center transition"
                >
                  <div className="text-white/70 text-xs font-medium">{acc.label}</div>
                  <div className="text-white/40 text-xs mt-0.5">{acc.username}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Hệ thống quản lý nội bộ — Không chia sẻ thông tin đăng nhập
        </p>
      </div>
    </div>
  );
}
