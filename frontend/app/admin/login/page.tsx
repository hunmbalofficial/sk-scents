'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : process.env.NEXT_PUBLIC_API_URL || '/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const { token, login } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (token) router.push('/admin');
  }, [token, router]);

  useEffect(() => {
    const stored = localStorage.getItem('adminInfo');
    if (stored) {
      try { login(JSON.parse(stored)); router.push('/admin'); } catch {}
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email.trim() || !form.password.trim()) {
      setError('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || `Login failed (${res.status})`);
        return;
      }
      login(data);
      localStorage.setItem('adminInfo', JSON.stringify(data));
      document.cookie = `admin_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      router.push('/admin');
    } catch (err: any) {
      setError(err?.message || 'Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.08)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(212,175,55,0.05)_0%,transparent_50%)]" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-[#D4AF37] tracking-wider">SK</h1>
          <p className="text-white/40 text-sm mt-2 uppercase tracking-[0.2em]">Admin Panel</p>
        </div>
        <div className="bg-[#111111] rounded-2xl p-8 sm:p-10 border border-white/[0.06] shadow-2xl">
          <h2 className="font-display text-xl text-white mb-8 text-center">Welcome Back</h2>
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3.5 mb-6">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#D4AF37]/50 focus:bg-white/[0.06] transition-all"
                placeholder="admin@sk-scents.com"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 pr-11 text-sm text-white placeholder-white/20 outline-none focus:border-[#D4AF37]/50 focus:bg-white/[0.06] transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] hover:bg-[#E8C84A] disabled:opacity-60 text-[#050505] font-semibold py-3.5 rounded-xl text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="text-center text-white/20 text-xs mt-8">
          SK SCENTS &mdash; Admin Panel
        </p>
      </div>
    </div>
  );
}
