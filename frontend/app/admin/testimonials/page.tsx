'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Star, Search, Grid3x3, List, Upload, Eye, Check, GripVertical, Users, CheckCircle, XCircle, Star as StarIcon, MessageSquare } from 'lucide-react';
import { testimonialService, uploadService } from '@/lib/api';
import { useToast } from '@/components/ui/Toaster';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: '', role: '', text: '', rating: 5, image: '', active: true });

  useEffect(() => { loadTestimonials(); }, []);

  const loadTestimonials = () => {
    setLoading(true);
    testimonialService.getAll({ all: true })
      .then((res) => setTestimonials(res.data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())))
      .catch(() => {}).finally(() => setLoading(false));
  };

  const resetForm = () => { setForm({ name: '', role: '', text: '', rating: 5, image: '', active: true }); setEditing(null); setShowForm(false); setPreviewMode(false); };

  const handleEdit = (t: any) => { setForm({ name: t.name, role: t.role, text: t.text, rating: t.rating, image: t.image || '', active: t.active }); setEditing(t._id); setShowForm(true); };

  const handleSubmit = async () => {
    try {
      if (editing) { await testimonialService.update(editing, form); addToast('Testimonial updated', 'success'); }
      else { const maxOrder = testimonials.reduce((max: number, t: any) => Math.max(max, t.order || 0), 0); await testimonialService.create({ ...form, order: maxOrder + 1 }); addToast('Testimonial created', 'success'); }
      resetForm(); loadTestimonials();
    } catch (err: any) { addToast(err?.response?.data?.message || 'Failed to save', 'error'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try { await testimonialService.delete(id); addToast('Testimonial deleted', 'success'); setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; }); loadTestimonials(); }
    catch { addToast('Failed to delete', 'error'); }
  };

  const handleToggleActive = async (t: any) => {
    try {
      await testimonialService.update(t._id, { active: !t.active });
      setTestimonials((prev) => prev.map((x: any) => x._id === t._id ? { ...x, active: !x.active } : x));
      addToast(`Testimonial ${!t.active ? 'activated' : 'deactivated'}`, 'success');
    } catch { addToast('Failed to update', 'error'); }
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0 || !confirm(`Delete ${selected.size} testimonial(s)?`)) return;
    try { await testimonialService.bulkDelete(Array.from(selected)); addToast(`${selected.size} deleted`, 'success'); setSelected(new Set()); loadTestimonials(); }
    catch { addToast('Failed to delete', 'error'); }
  };

  const handleBulkActivate = async (active: boolean) => {
    if (selected.size === 0) return;
    try { await testimonialService.bulkUpdate(Array.from(selected), active); addToast(`${selected.size} ${active ? 'activated' : 'deactivated'}`, 'success'); setSelected(new Set()); loadTestimonials(); }
    catch { addToast('Failed to update', 'error'); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { addToast('Please select an image', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { addToast('Image must be less than 5MB', 'error'); return; }
    setUploading(true);
    try {
      const res = await uploadService.image(file, 'sk-scents/testimonials');
      if (res.data?.url) { setForm((prev) => ({ ...prev, image: res.data.url })); addToast('Image uploaded', 'success'); }
    } catch (err: any) { addToast(`Upload failed: ${err?.response?.data?.message || err.message}`, 'error'); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const stats = {
    total: testimonials.length,
    active: testimonials.filter((t: any) => t.active).length,
    inactive: testimonials.filter((t: any) => !t.active).length,
    avgRating: testimonials.length > 0 ? (testimonials.reduce((sum: number, t: any) => sum + t.rating, 0) / testimonials.length).toFixed(1) : '0.0',
  };

  const filteredTestimonials = testimonials.filter((t: any) => {
    const q = searchQuery.toLowerCase();
    if (searchQuery && !t.name.toLowerCase().includes(q) && !t.role.toLowerCase().includes(q) && !t.text.toLowerCase().includes(q)) return false;
    if (statusFilter === 'active' && !t.active) return false;
    if (statusFilter === 'inactive' && t.active) return false;
    if (ratingFilter !== 'all' && t.rating !== parseInt(ratingFilter)) return false;
    return true;
  });

  const handleDragStart = (id: string) => setDragId(id);
  const handleDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); if (id !== dragOverId) setDragOverId(id); };
  const handleDrop = async (e: React.DragEvent, dropId: string) => {
    e.preventDefault();
    if (!dragId || dragId === dropId) { setDragId(null); setDragOverId(null); return; }
    const items = Array.from(testimonials);
    const dragIdx = items.findIndex((t: any) => t._id === dragId);
    const dropIdx = items.findIndex((t: any) => t._id === dropId);
    if (dragIdx === -1 || dropIdx === -1) return;
    const [moved] = items.splice(dragIdx, 1);
    items.splice(dropIdx, 0, moved);
    setTestimonials(items);
    setDragId(null); setDragOverId(null);
    try { await testimonialService.reorder(items.map((t: any, i: number) => ({ id: t._id, order: i }))); addToast('Order updated', 'success'); }
    catch { addToast('Failed to save order', 'error'); }
  };

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="luxury-card rounded-xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}><Icon className="w-5 h-5" /></div>
      <div><p className="text-xs text-luxury-gray uppercase tracking-wider">{label}</p><p className="font-display text-xl text-white">{value}</p></div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl text-white">Testimonials</h1><p className="text-sm text-luxury-gray mt-1">Manage customer reviews and feedback</p></div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase"><Plus className="w-4 h-4" /> Add Testimonial</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Users} label="Total" value={stats.total} color="bg-blue-500/10 text-blue-400" />
        <StatCard icon={CheckCircle} label="Active" value={stats.active} color="bg-emerald-500/10 text-emerald-400" />
        <StatCard icon={XCircle} label="Inactive" value={stats.inactive} color="bg-red-500/10 text-red-400" />
        <StatCard icon={StarIcon} label="Avg Rating" value={stats.avgRating} color="bg-luxury-gold/10 text-luxury-gold" />
      </div>

      <div className="luxury-card rounded-xl p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-luxury-gray absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search testimonials..." className="w-full bg-luxury-black border border-white/[0.08] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-luxury-gray-dark focus:border-luxury-gold/40 outline-none" />
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-luxury-black border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:border-luxury-gold/40 outline-none">
              <option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option>
            </select>
            <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="bg-luxury-black border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:border-luxury-gold/40 outline-none">
              <option value="all">All Ratings</option>{[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
            </select>
            <div className="flex border border-white/[0.08] rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`px-3 py-2 transition-colors ${viewMode === 'grid' ? 'bg-luxury-gold/20 text-luxury-gold' : 'text-luxury-gray hover:text-white'}`}><Grid3x3 className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`px-3 py-2 transition-colors border-l border-white/[0.08] ${viewMode === 'list' ? 'bg-luxury-gold/20 text-luxury-gold' : 'text-luxury-gray hover:text-white'}`}><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="luxury-card rounded-xl p-3 mb-4 flex flex-wrap items-center justify-between gap-3 border-luxury-gold/20">
          <div className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-luxury-gold" /><span className="text-white">{selected.size} selected</span><button onClick={() => setSelected(new Set())} className="text-luxury-gray hover:text-white text-xs ml-2">Clear</button></div>
          <div className="flex gap-2">
            <button onClick={() => handleBulkActivate(true)} className="px-3 py-1.5 rounded text-xs uppercase tracking-wider bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors">Activate</button>
            <button onClick={() => handleBulkActivate(false)} className="px-3 py-1.5 rounded text-xs uppercase tracking-wider bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors">Deactivate</button>
            <button onClick={handleBulkDelete} className="px-3 py-1.5 rounded text-xs uppercase tracking-wider bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Delete</button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}>
          <div className="bg-luxury-card border border-luxury-gold/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-luxury-card border-b border-luxury-gold/10 p-5 flex items-center justify-between z-10">
              <h2 className="font-display text-lg text-white">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => setPreviewMode(!previewMode)} className="p-2 rounded-lg text-luxury-gray hover:text-luxury-gold hover:bg-luxury-gold/10 transition-all"><Eye className="w-4 h-4" /></button>
                <button onClick={resetForm} className="p-2 rounded-lg text-luxury-gray hover:text-white hover:bg-white/5 transition-all"><X className="w-5 h-5" /></button>
              </div>
            </div>
            {previewMode ? (
              <div className="p-8">
                <div className="luxury-card rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {form.image ? <img src={form.image} alt={form.name} className="w-12 h-12 rounded-full object-cover" /> : <div className="w-12 h-12 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold font-display">{form.name?.[0] || '?'}</div>}
                    <div><p className="text-white font-medium">{form.name || 'Name'}</p><p className="text-xs text-luxury-gray">{form.role || 'Role'}</p></div>
                  </div>
                  <div className="flex gap-0.5 mb-3">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < form.rating ? 'fill-luxury-gold text-luxury-gold' : 'text-white/20'}`} />))}</div>
                  <p className="text-luxury-gray text-sm leading-relaxed italic">&quot;{form.text || 'Testimonial text...'}&quot;</p>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-luxury-black border border-luxury-gold/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-luxury-gold/30" /></div>
                  <div><label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Role *</label><input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Fashion Director" className="w-full bg-luxury-black border border-luxury-gold/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-luxury-gold/30" /></div>
                </div>
                <div><label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Review Text *</label><textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={4} maxLength={500} className="w-full bg-luxury-black border border-luxury-gold/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-luxury-gold/30 resize-none" required /><p className="text-xs text-luxury-gray mt-1 text-right">{form.text.length}/500</p></div>
                <div><label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Rating *</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map((n) => (<button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} className={`p-2 rounded-lg transition-all hover:scale-110 ${form.rating >= n ? 'text-luxury-gold' : 'text-white/20'}`}><Star className={`w-6 h-6 ${form.rating >= n ? 'fill-luxury-gold' : ''}`} /></button>))}
                    <span className="text-sm text-luxury-gray ml-2 self-center">{form.rating}.0</span>
                  </div>
                </div>
                <div><label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Profile Image</label>
                  <div className="flex gap-2">
                    <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="flex-1 bg-luxury-black border border-luxury-gold/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-luxury-gold/30" />
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="btn-outline px-3 py-2.5 rounded-lg text-xs flex items-center gap-1.5 disabled:opacity-50">
                      {uploading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                  {form.image && <div className="mt-2 flex items-center gap-2"><img src={form.image} alt="" className="w-12 h-12 rounded-full object-cover" /><button type="button" onClick={() => setForm({ ...form, image: '' })} className="text-xs text-red-400 hover:text-red-300">Remove</button></div>}
                </div>
                <label className="flex items-center justify-between p-3 rounded-lg bg-luxury-black/50 border border-white/5 cursor-pointer hover:border-luxury-gold/20 transition-all">
                  <div><p className="text-sm text-white">Active</p><p className="text-xs text-luxury-gray mt-0.5">Show on public site</p></div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-luxury-gold peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                  </div>
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={handleSubmit} className="flex-1 btn-primary py-2.5 rounded-lg text-xs tracking-wider uppercase">{editing ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={resetForm} className="btn-outline px-6 py-2.5 rounded-lg text-xs tracking-wider uppercase">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTestimonials.map((t: any, idx: number) => (
            <div key={t._id} draggable onDragStart={() => handleDragStart(t._id)} onDragOver={(e) => handleDragOver(e, t._id)} onDrop={(e) => handleDrop(e, t._id)} onDragEnd={() => { setDragId(null); setDragOverId(null); }} className={`luxury-card rounded-xl p-5 cursor-grab active:cursor-grabbing transition-all ${dragOverId === t._id ? 'border-luxury-gold opacity-80' : ''} ${idx % 2 === 0 ? 'hover:translate-y-0' : 'hover:-translate-y-2'}`}>
              <div className="flex items-start gap-3 mb-3">
                <input type="checkbox" checked={selected.has(t._id)} onChange={() => setSelected((prev) => { const n = new Set(prev); n.has(t._id) ? n.delete(t._id) : n.add(t._id); return n; })} className="mt-1 accent-luxury-gold" />
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {t.image ? <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" /> : <div className="w-10 h-10 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold font-display shrink-0">{t.name?.[0]}</div>}
                  <div className="min-w-0"><p className="text-sm text-white font-medium truncate">{t.name}</p><p className="text-xs text-luxury-gray truncate">{t.role}</p></div>
                </div>
                <GripVertical className="w-4 h-4 text-luxury-gray/40 shrink-0 mt-1" />
              </div>
              <div className="flex gap-0.5 mb-2">{Array.from({ length: t.rating }).map((_, j) => (<Star key={j} className="w-3 h-3 fill-luxury-gold text-luxury-gold" />))}</div>
              <p className="text-xs text-luxury-gray line-clamp-3 mb-3">&quot;{t.text}&quot;</p>
              <div className="flex items-center justify-between pt-2 border-t border-luxury-gold/5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${t.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{t.active ? 'Active' : 'Inactive'}</span>
                <div className="flex gap-1">
                  <button onClick={() => handleToggleActive(t)} className="p-1.5 rounded-lg text-luxury-gray hover:text-luxury-gold hover:bg-luxury-gold/10 transition-all" title="Toggle active">{t.active ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}</button>
                  <button onClick={() => handleEdit(t)} className="p-1.5 rounded-lg text-luxury-gray hover:text-luxury-gold hover:bg-luxury-gold/10 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(t._id)} className="p-1.5 rounded-lg text-luxury-gray hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="luxury-card rounded-xl overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-luxury-gold/10">
              <th className="w-8 px-2 py-3"><input type="checkbox" checked={selected.size === filteredTestimonials.length && filteredTestimonials.length > 0} onChange={() => { if (selected.size === filteredTestimonials.length) setSelected(new Set()); else setSelected(new Set(filteredTestimonials.map((t: any) => t._id))); }} className="accent-luxury-gold" /></th>
              <th className="text-left text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Customer</th>
              <th className="text-left text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Rating</th>
              <th className="text-left text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-right text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {filteredTestimonials.map((t: any) => (
                <tr key={t._id} className="border-b border-luxury-gold/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-2 py-3"><input type="checkbox" checked={selected.has(t._id)} onChange={() => setSelected((prev) => { const n = new Set(prev); n.has(t._id) ? n.delete(t._id) : n.add(t._id); return n; })} className="accent-luxury-gold" /></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold text-xs font-display">{t.name?.[0]}</div><div><p className="text-sm text-white">{t.name}</p><p className="text-xs text-luxury-gray">{t.role}</p></div></div></td>
                  <td className="px-4 py-3"><div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, j) => (<Star key={j} className="w-3 h-3 fill-luxury-gold text-luxury-gold" />))}</div></td>
                  <td className="px-4 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full ${t.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{t.active ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleToggleActive(t)} className="p-1.5 rounded-lg text-luxury-gray hover:text-luxury-gold transition-all">{t.active ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}</button>
                    <button onClick={() => handleEdit(t)} className="p-1.5 rounded-lg text-luxury-gray hover:text-luxury-gold transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(t._id)} className="p-1.5 rounded-lg text-luxury-gray hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
