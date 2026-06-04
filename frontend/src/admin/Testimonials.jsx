import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Star, Search, Grid3x3, List, Upload, Eye, Check, GripVertical, Users, CheckCircle, XCircle, Star as StarIcon, MessageSquare } from 'lucide-react';
import { testimonialService, uploadService } from '../services/api';
import { useToast } from '../components/ui/Toaster';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selected, setSelected] = useState(new Set());
  const [dragId, setDragId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ name: '', role: '', text: '', rating: 5, image: '', active: true });

  useEffect(() => { loadTestimonials(); }, []);

  const loadTestimonials = () => {
    setLoading(true);
    testimonialService.getAll({ all: true })
      .then((res) => {
        const sorted = res.data.sort((a, b) => (a.order || 0) - (b.order || 0) || new Date(b.createdAt) - new Date(a.createdAt));
        setTestimonials(sorted);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({ name: '', role: '', text: '', rating: 5, image: '', active: true });
    setEditing(null);
    setShowForm(false);
    setPreviewMode(false);
  };

  const handleEdit = (t) => {
    setForm({ name: t.name, role: t.role, text: t.text, rating: t.rating, image: t.image || '', active: t.active });
    setEditing(t._id);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await testimonialService.update(editing, form);
        addToast('Testimonial updated successfully', 'success');
      } else {
        const maxOrder = testimonials.reduce((max, t) => Math.max(max, t.order || 0), 0);
        await testimonialService.create({ ...form, order: maxOrder + 1 });
        addToast('Testimonial created successfully', 'success');
      }
      resetForm();
      loadTestimonials();
    } catch (err) {
      addToast(err?.response?.data?.message || 'Failed to save testimonial', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await testimonialService.delete(id);
      addToast('Testimonial deleted', 'success');
      setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
      loadTestimonials();
    } catch {
      addToast('Failed to delete', 'error');
    }
  };

  const handleToggleActive = async (t) => {
    try {
      await testimonialService.update(t._id, { active: !t.active });
      setTestimonials((prev) => prev.map((x) => x._id === t._id ? { ...x, active: !x.active } : x));
      addToast(`Testimonial ${!t.active ? 'activated' : 'deactivated'}`, 'success');
    } catch {
      addToast('Failed to update status', 'error');
    }
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} testimonial(s)?`)) return;
    try {
      await testimonialService.bulkDelete(Array.from(selected));
      addToast(`${selected.size} testimonial(s) deleted`, 'success');
      setSelected(new Set());
      loadTestimonials();
    } catch {
      addToast('Failed to delete', 'error');
    }
  };

  const handleBulkActivate = async (active) => {
    if (selected.size === 0) return;
    try {
      await testimonialService.bulkUpdate(Array.from(selected), active);
      addToast(`${selected.size} testimonial(s) ${active ? 'activated' : 'deactivated'}`, 'success');
      setSelected(new Set());
      loadTestimonials();
    } catch {
      addToast('Failed to update', 'error');
    }
  };

  const handleSelect = (id) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const handleSelectAll = () => {
    if (selected.size === filteredTestimonials.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredTestimonials.map((t) => t._id)));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image must be less than 5MB', 'error');
      return;
    }
    setUploading(true);
    try {
      const res = await uploadService.image(file, 'sk-scents/testimonials');
      if (res.data?.url) {
        setForm((prev) => ({ ...prev, image: res.data.url }));
        addToast('Image uploaded successfully', 'success');
      } else {
        throw new Error('No URL in response');
      }
    } catch (err) {
      console.error('Upload error:', err);
      const msg = err?.response?.data?.message || err?.message || 'Upload failed';
      addToast(`Upload failed: ${msg}`, 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== dragOverId) setDragOverId(id);
  };

  const handleDrop = async (e, dropId) => {
    e.preventDefault();
    if (!dragId || dragId === dropId) {
      setDragId(null);
      setDragOverId(null);
      return;
    }
    const items = Array.from(testimonials);
    const dragIdx = items.findIndex((t) => t._id === dragId);
    const dropIdx = items.findIndex((t) => t._id === dropId);
    if (dragIdx === -1 || dropIdx === -1) return;
    const [moved] = items.splice(dragIdx, 1);
    items.splice(dropIdx, 0, moved);
    setTestimonials(items);
    setDragId(null);
    setDragOverId(null);
    try {
      await testimonialService.reorder(items.map((t, i) => ({ id: t._id, order: i })));
      addToast('Order updated', 'success');
    } catch {
      addToast('Failed to save order', 'error');
    }
  };

  const handleDragEnd = () => {
    setDragId(null);
    setDragOverId(null);
  };

  const stats = {
    total: testimonials.length,
    active: testimonials.filter((t) => t.active).length,
    inactive: testimonials.filter((t) => !t.active).length,
    avgRating: testimonials.length > 0 ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1) : '0.0',
  };

  const filteredTestimonials = testimonials.filter((t) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!t.name.toLowerCase().includes(q) && !t.role.toLowerCase().includes(q) && !t.text.toLowerCase().includes(q)) return false;
    }
    if (statusFilter === 'active' && !t.active) return false;
    if (statusFilter === 'inactive' && t.active) return false;
    if (ratingFilter !== 'all' && t.rating !== parseInt(ratingFilter)) return false;
    return true;
  });

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="luxury-card rounded-xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-luxury-gray uppercase tracking-wider">{label}</p>
        <p className="font-display text-xl text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-white">Testimonials</h1>
          <p className="text-sm text-luxury-gray mt-1">Manage customer reviews and feedback</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
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
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search testimonials..."
              className="w-full bg-luxury-black border border-white/[0.08] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-luxury-gray-dark focus:border-luxury-gold/40 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-luxury-black border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:border-luxury-gold/40 outline-none">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="bg-luxury-black border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:border-luxury-gold/40 outline-none">
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
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
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-luxury-gold" />
            <span className="text-white">{selected.size} selected</span>
            <button onClick={() => setSelected(new Set())} className="text-luxury-gray hover:text-white text-xs ml-2">Clear</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleBulkActivate(true)} className="px-3 py-1.5 rounded text-xs uppercase tracking-wider bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors">Activate</button>
            <button onClick={() => handleBulkActivate(false)} className="px-3 py-1.5 rounded text-xs uppercase tracking-wider bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors">Deactivate</button>
            <button onClick={handleBulkDelete} className="px-3 py-1.5 rounded text-xs uppercase tracking-wider bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Delete</button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="bg-luxury-card border border-luxury-gold/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-luxury-card border-b border-luxury-gold/10 p-5 flex items-center justify-between z-10">
              <h2 className="font-display text-lg text-white">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => setPreviewMode(!previewMode)} className="p-2 rounded-lg text-luxury-gray hover:text-luxury-gold hover:bg-luxury-gold/10 transition-all" title="Toggle preview">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={resetForm} className="p-2 rounded-lg text-luxury-gray hover:text-white hover:bg-white/5 transition-all"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {previewMode ? (
              <div className="p-8">
                <div className="luxury-card rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {form.image ? (
                      <img src={form.image} alt={form.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold font-display">{form.name?.[0] || '?'}</div>
                    )}
                    <div>
                      <p className="text-white font-medium">{form.name || 'Customer Name'}</p>
                      <p className="text-xs text-luxury-gray">{form.role || 'Role'}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < form.rating ? 'fill-luxury-gold text-luxury-gold' : 'text-white/20'}`} />
                    ))}
                  </div>
                  <p className="text-luxury-gray text-sm leading-relaxed italic">"{form.text || 'Your testimonial text will appear here...'}"</p>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Name *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-luxury-black border border-luxury-gold/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-luxury-gold/30" required />
                  </div>
                  <div>
                    <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Role *</label>
                    <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Fashion Director" className="w-full bg-luxury-black border border-luxury-gold/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-luxury-gold/30" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Review Text *</label>
                  <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={4} maxLength={500} className="w-full bg-luxury-black border border-luxury-gold/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-luxury-gold/30 resize-none" required />
                  <p className="text-xs text-luxury-gray mt-1 text-right">{form.text.length}/500</p>
                </div>
                <div>
                  <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} className={`p-2 rounded-lg transition-all hover:scale-110 ${form.rating >= n ? 'text-luxury-gold' : 'text-white/20'}`}>
                        <Star className={`w-6 h-6 ${form.rating >= n ? 'fill-luxury-gold' : ''}`} />
                      </button>
                    ))}
                    <span className="text-sm text-luxury-gray ml-2 self-center">{form.rating}.0</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Profile Image</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="w-full bg-luxury-black border border-luxury-gold/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-luxury-gold/30" />
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="btn-outline px-3 py-2.5 rounded-lg text-xs flex items-center gap-1.5 disabled:opacity-50">
                      {uploading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                  {form.image && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={form.image} alt="Preview" className="w-12 h-12 rounded-full object-cover" />
                      <button type="button" onClick={() => setForm({ ...form, image: '' })} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                    </div>
                  )}
                </div>
                <label className="flex items-center justify-between p-3 rounded-lg bg-luxury-black/50 border border-white/5 cursor-pointer hover:border-luxury-gold/20 transition-all">
                  <div>
                    <p className="text-sm text-white">Active</p>
                    <p className="text-xs text-luxury-gray mt-0.5">Show on public site</p>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-luxury-gold peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </div>
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={handleSubmit} className="flex-1 btn-primary py-2.5 rounded-lg text-xs tracking-wider uppercase">{editing ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={resetForm} className="flex-1 border border-white/10 text-luxury-gray hover:text-white py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center text-luxury-gray py-20">Loading...</div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="luxury-card rounded-xl py-16 text-center">
          <MessageSquare className="w-12 h-12 text-luxury-gray mx-auto mb-3" />
          <p className="text-luxury-gray">{testimonials.length === 0 ? 'No testimonials yet' : 'No testimonials match your filters'}</p>
          {testimonials.length === 0 && (
            <button onClick={() => setShowForm(true)} className="mt-4 text-luxury-gold text-sm hover:underline">Add your first testimonial</button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <>
          {filteredTestimonials.length > 0 && (
            <div className="flex items-center justify-between mb-3 text-sm text-luxury-gray">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selected.size === filteredTestimonials.length && filteredTestimonials.length > 0} onChange={handleSelectAll} className="accent-luxury-gold" />
                <span>Select all ({filteredTestimonials.length})</span>
              </label>
              <span className="text-xs">Drag to reorder</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTestimonials.map((t) => (
              <div
                key={t._id}
                draggable
                onDragStart={(e) => handleDragStart(e, t._id)}
                onDragOver={(e) => handleDragOver(e, t._id)}
                onDrop={(e) => handleDrop(e, t._id)}
                onDragEnd={handleDragEnd}
                className={`luxury-card rounded-xl p-5 group relative transition-all ${dragId === t._id ? 'opacity-30' : ''} ${dragOverId === t._id ? 'ring-2 ring-luxury-gold' : ''} ${!t.active ? 'opacity-60' : ''}`}
              >
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <input type="checkbox" checked={selected.has(t._id)} onChange={() => handleSelect(t._id)} onClick={(e) => e.stopPropagation()} className="accent-luxury-gold" />
                  <GripVertical className="w-3.5 h-3.5 text-luxury-gray opacity-0 group-hover:opacity-100 cursor-move transition-opacity" />
                </div>
                <div className="flex items-center gap-3 mb-3 pl-16">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold font-display">{t.name?.[0]}</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-sm truncate">{t.name}</p>
                    <p className="text-xs text-luxury-gray truncate">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'fill-luxury-gold text-luxury-gold' : 'text-white/20'}`} />
                  ))}
                </div>
                <p className="text-luxury-gray text-xs leading-relaxed line-clamp-3 mb-3">"{t.text}"</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <button onClick={() => handleToggleActive(t)} className={`text-xs px-2 py-1 rounded ${t.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {t.active ? 'Active' : 'Inactive'}
                  </button>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(t)} className="p-1.5 rounded-lg text-luxury-gray hover:text-luxury-gold hover:bg-luxury-gold/10 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(t._id)} className="p-1.5 rounded-lg text-luxury-gray hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-2">
          {filteredTestimonials.length > 0 && (
            <div className="flex items-center justify-between mb-3 text-sm text-luxury-gray">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selected.size === filteredTestimonials.length && filteredTestimonials.length > 0} onChange={handleSelectAll} className="accent-luxury-gold" />
                <span>Select all</span>
              </label>
              <span className="text-xs">Drag to reorder</span>
            </div>
          )}
          {filteredTestimonials.map((t) => (
            <div
              key={t._id}
              draggable
              onDragStart={(e) => handleDragStart(e, t._id)}
              onDragOver={(e) => handleDragOver(e, t._id)}
              onDrop={(e) => handleDrop(e, t._id)}
              onDragEnd={handleDragEnd}
              className={`luxury-card rounded-xl p-4 flex items-center gap-3 transition-all ${dragId === t._id ? 'opacity-30' : ''} ${dragOverId === t._id ? 'ring-2 ring-luxury-gold' : ''} ${!t.active ? 'opacity-60' : ''}`}
            >
              <input type="checkbox" checked={selected.has(t._id)} onChange={() => handleSelect(t._id)} onClick={(e) => e.stopPropagation()} className="accent-luxury-gold shrink-0" />
              <GripVertical className="w-4 h-4 text-luxury-gray cursor-move shrink-0" />
              {t.image ? (
                <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold font-display shrink-0">{t.name?.[0]}</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-medium text-sm truncate">{t.name}</h3>
                  <span className="text-xs text-luxury-gray truncate">· {t.role}</span>
                </div>
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-2.5 h-2.5 ${i < t.rating ? 'fill-luxury-gold text-luxury-gold' : 'text-white/20'}`} />
                  ))}
                </div>
              </div>
              <button onClick={() => handleToggleActive(t)} className={`text-xs px-2 py-1 rounded shrink-0 ${t.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                {t.active ? 'Active' : 'Inactive'}
              </button>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => handleEdit(t)} className="p-1.5 rounded-lg text-luxury-gray hover:text-luxury-gold hover:bg-luxury-gold/10 transition-all"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(t._id)} className="p-1.5 rounded-lg text-luxury-gray hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
