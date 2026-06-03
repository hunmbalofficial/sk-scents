import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import { testimonialService } from '../services/api';
import { useToast } from '../components/ui/Toaster';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', role: '', text: '', rating: 5, image: '', active: true });

  useEffect(() => { loadTestimonials(); }, []);

  const loadTestimonials = () => {
    setLoading(true);
    testimonialService.getAll({ all: true })
      .then((res) => setTestimonials(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({ name: '', role: '', text: '', rating: 5, image: '', active: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (t) => {
    setForm({ name: t.name, role: t.role, text: t.text, rating: t.rating, image: t.image || '', active: t.active });
    setEditing(t._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await testimonialService.update(editing, form);
        addToast('Testimonial updated', 'success');
      } else {
        await testimonialService.create(form);
        addToast('Testimonial created', 'success');
      }
      resetForm();
      loadTestimonials();
    } catch {
      addToast('Failed to save testimonial', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await testimonialService.delete(id);
      addToast('Testimonial deleted', 'success');
      loadTestimonials();
    } catch {
      addToast('Failed to delete', 'error');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-white">Testimonials</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-xs tracking-wider uppercase">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="bg-luxury-card border border-luxury-gold/10 rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-luxury-gold/10">
              <h2 className="font-display text-lg text-white">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
              <button onClick={resetForm} className="text-luxury-gray hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-luxury-black border border-luxury-gold/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-luxury-gold/30" required />
              </div>
              <div>
                <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Role</label>
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-luxury-black border border-luxury-gold/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-luxury-gold/30" required />
              </div>
              <div>
                <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Text</label>
                <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={3} className="w-full bg-luxury-black border border-luxury-gold/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-luxury-gold/30" required />
              </div>
              <div>
                <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map((n) => (
                    <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} className={`p-2 rounded-lg transition-all ${form.rating >= n ? 'text-luxury-gold' : 'text-white/20 hover:text-white/40'}`}>
                      <Star className={`w-5 h-5 ${form.rating >= n ? 'fill-luxury-gold' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="w-full bg-luxury-black border border-luxury-gold/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-luxury-gold/30" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-luxury-gold" />
                <span className="text-sm text-white/80">Active</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 btn-primary py-2.5 rounded-lg text-xs tracking-wider uppercase">{editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={resetForm} className="flex-1 border border-white/10 text-luxury-gray hover:text-white py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center text-luxury-gray py-20">Loading...</div>
      ) : testimonials.length === 0 ? (
        <div className="text-center text-luxury-gray py-20">No testimonials yet</div>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((t) => (
            <div key={t._id} className="bg-luxury-card border border-luxury-gold/10 rounded-xl p-5 flex items-start gap-4">
              {t.image && <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-medium">{t.name}</h3>
                  <span className="text-xs text-luxury-gray">{t.role}</span>
                  {!t.active && <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">Inactive</span>}
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-luxury-gold text-luxury-gold" />
                  ))}
                </div>
                <p className="text-luxury-gray text-sm line-clamp-2">"{t.text}"</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => handleEdit(t)} className="p-2 rounded-lg text-luxury-gray hover:text-luxury-gold hover:bg-luxury-gold/10 transition-all"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(t._id)} className="p-2 rounded-lg text-luxury-gray hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
