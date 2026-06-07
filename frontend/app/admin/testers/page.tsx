'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, ShoppingBag, FlaskRound } from 'lucide-react';
import { productService, uploadService } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/Toaster';

export default function AdminTestersPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const { addToast } = useToast();
  const [form, setForm] = useState({
    name: '', price: '', discountPrice: '', description: '', notes: '',
    gender: 'Unisex', stock: '10', imageUrls: '', featured: false,
  });

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = () => {
    setLoading(true);
    productService.getAll({ category: 'Testers' }).then((res) => setProducts(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({ name: '', price: '', discountPrice: '', description: '', notes: '', gender: 'Unisex', stock: '10', imageUrls: '', featured: false });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (product: any) => {
    setForm({ name: product.name, price: product.price.toString(), discountPrice: product.discountPrice?.toString() || '', description: product.description, notes: product.notes || '', gender: product.gender, stock: product.stock.toString(), imageUrls: product.images?.join(', ') || '', featured: product.featured });
    setEditing(product._id);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', form.name); formData.append('price', form.price); formData.append('description', form.description);
    formData.append('category', 'Testers'); formData.append('gender', form.gender); formData.append('stock', form.stock);
    formData.append('featured', form.featured.toString());
    if (form.discountPrice) formData.append('discountPrice', form.discountPrice);
    if (form.notes) formData.append('notes', form.notes);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput?.files && fileInput.files.length > 0) {
      Array.from(fileInput.files).forEach((f) => formData.append('images', f));
    } else if (form.imageUrls.trim()) {
      formData.append('images', JSON.stringify(form.imageUrls.split(',').map((s) => s.trim()).filter(Boolean)));
    }
    try {
      if (editing) { await productService.update(editing, formData); addToast('Tester updated', 'success'); }
      else { await productService.create(formData); addToast('Tester created', 'success'); }
      resetForm(); loadProducts();
    } catch (err: any) { addToast(err?.response?.data?.message || 'Failed to save', 'error'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try { await productService.delete(id); addToast('Tester deleted', 'success'); loadProducts(); }
    catch { addToast('Failed to delete', 'error'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2"><FlaskRound className="w-6 h-6 text-luxury-gold" /><h1 className="font-display text-2xl text-white">Testers</h1></div>
      <div className="flex justify-end">
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Tester</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-luxury-card rounded-2xl p-6 w-full max-w-2xl border border-luxury-gold/10">
            <div className="flex items-center justify-between mb-6"><h2 className="font-display text-lg text-white">{editing ? 'Edit Tester' : 'Add Tester'}</h2><button onClick={resetForm} className="text-luxury-gray hover:text-white"><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div><label className="block text-sm text-luxury-gray mb-1">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-luxury-gray mb-1">Price</label><input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" /></div>
                <div><label className="block text-sm text-luxury-gray mb-1">Discount Price</label><input type="number" step="0.01" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" /></div>
                <div><label className="block text-sm text-luxury-gray mb-1">Gender</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm">
                    {['Men', 'Women', 'Unisex'].map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm text-luxury-gray mb-1">Stock</label><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" /></div>
              </div>
              <div><label className="block text-sm text-luxury-gray mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm min-h-[80px]" /></div>
              <div><label className="block text-sm text-luxury-gray mb-1">Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" /></div>
              <div><label className="block text-sm text-luxury-gray mb-1">Upload Images</label><input type="file" multiple accept="image/*" className="text-sm text-luxury-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-luxury-gold/10 file:text-luxury-gold w-full" /></div>
              <div><label className="block text-sm text-luxury-gray mb-1">Or paste image URLs</label><input value={form.imageUrls} onChange={(e) => setForm({ ...form, imageUrls: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" /></div>
              <label className="flex items-center gap-2 text-sm text-luxury-gray"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-luxury-gold" /> Featured</label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleSubmit} className="btn-primary flex-1 py-2.5 rounded-lg text-sm">{editing ? 'Update' : 'Create'} Tester</button>
                <button type="button" onClick={resetForm} className="btn-outline px-6 py-2.5 rounded-lg text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="luxury-card rounded-2xl overflow-hidden">
            <div className="aspect-[4/5] sm:aspect-square skeleton" />
            <div className="p-4 space-y-2"><div className="h-3 w-20 skeleton rounded" /><div className="h-4 w-32 skeleton rounded" /><div className="h-4 w-24 skeleton rounded" /></div>
          </div>
        )) : products.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FlaskRound className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="text-luxury-gray text-sm">No testers yet. Add your first tester above.</p>
          </div>
        ) : products.map((product) => (
          <div key={product._id} className="group luxury-card rounded-2xl overflow-hidden">
            <div className="aspect-[4/5] sm:aspect-square overflow-hidden bg-luxury-card">
              <img src={product.images?.[0] || ''} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-4">
              <h3 className="font-display text-base text-white mb-1">{product.name}</h3>
              <p className="text-luxury-gold font-display">{formatPrice(product.discountPrice || product.price)}</p>
              <p className="text-xs text-luxury-gray mt-1">Stock: {product.stock} | {product.gender}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleEdit(product)} className="flex-1 bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold hover:bg-luxury-gold/20 rounded-lg py-2 text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1"><Edit2 className="w-3 h-3" /> Edit</button>
                <button onClick={() => handleDelete(product._id)} className="px-3 border border-red-400/20 text-red-400 hover:bg-red-500/10 rounded-lg py-2 text-xs uppercase tracking-wider transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
