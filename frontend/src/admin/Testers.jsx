import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { productService } from '../services/api';
import { formatPrice } from '../lib/utils';
import { useToast } from '../components/ui/Toaster';

const AdminTesters = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const { addToast } = useToast();
  const [form, setForm] = useState({
    name: '', price: '', discountPrice: '', description: '', notes: '',
    category: 'Testers', gender: 'Unisex', stock: '10',
    featured: false, bestSeller: false,
  });

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = () => {
    setLoading(true);
    productService.getAll({ category: 'Testers' })
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({ name: '', price: '', discountPrice: '', description: '', notes: '', category: 'Testers', gender: 'Unisex', stock: '10', imageUrls: '', featured: false, bestSeller: false });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name, price: product.price.toString(), discountPrice: product.discountPrice?.toString() || '',
      description: product.description, notes: product.notes || '', category: 'Testers',
      gender: product.gender, stock: product.stock.toString(),
      imageUrls: Array.isArray(product.images) ? product.images.join(', ') : '',
      featured: product.featured, bestSeller: product.bestSeller,
    });
    setEditing(product._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('description', form.description);
    formData.append('category', 'Testers');
    formData.append('gender', form.gender);
    formData.append('stock', form.stock);
    formData.append('featured', form.featured);
    formData.append('bestSeller', form.bestSeller);
    if (form.discountPrice) formData.append('discountPrice', form.discountPrice);
    if (form.notes) formData.append('notes', form.notes);

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput?.files?.length > 0) {
      Array.from(fileInput.files).forEach((f) => formData.append('images', f));
    } else if (form.imageUrls.trim()) {
      formData.append('images', JSON.stringify(form.imageUrls.split(',').map((s) => s.trim()).filter(Boolean)));
    }

    try {
      if (editing) {
        await productService.update(editing, formData);
        addToast('Tester updated', 'success');
      } else {
        await productService.create(formData);
        addToast('Tester created', 'success');
      }
      resetForm();
      loadProducts();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save tester', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this tester?')) return;
    try {
      await productService.delete(id);
      addToast('Tester deleted', 'success');
      loadProducts();
    } catch {
      addToast('Failed to delete', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-white">Testers</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2 w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" /> Add Tester
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-luxury-card rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-luxury-gold/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg text-white">{editing ? 'Edit Tester' : 'Add Tester'}</h2>
              <button onClick={resetForm} className="text-luxury-gray hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2"><label className="block text-sm text-luxury-gray mb-1">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" required /></div>
                <div><label className="block text-sm text-luxury-gray mb-1">Price</label><input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" required /></div>
                <div><label className="block text-sm text-luxury-gray mb-1">Discount Price</label><input type="number" step="0.01" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" /></div>
                <div><label className="block text-sm text-luxury-gray mb-1">Gender</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm">
                    {['Men', 'Women', 'Unisex'].map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm text-luxury-gray mb-1">Stock</label><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" required /></div>
                <div className="flex flex-wrap items-center gap-4 pt-6">
                  <label className="flex items-center gap-2 text-sm text-luxury-gray"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-luxury-gold" /> Featured</label>
                  <label className="flex items-center gap-2 text-sm text-luxury-gray"><input type="checkbox" checked={form.bestSeller} onChange={(e) => setForm({ ...form, bestSeller: e.target.checked })} className="accent-luxury-gold" /> Best Seller</label>
                </div>
                <div className="col-span-1 sm:col-span-2"><label className="block text-sm text-luxury-gray mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm min-h-[80px]" required /></div>
                <div className="col-span-1 sm:col-span-2"><label className="block text-sm text-luxury-gray mb-1">Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" /></div>
                <div className="col-span-1 sm:col-span-2"><label className="block text-sm text-luxury-gray mb-1">Upload Images</label><input type="file" multiple accept="image/*" className="text-sm text-luxury-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-luxury-gold/10 file:text-luxury-gold hover:file:bg-luxury-gold/20 w-full" /></div>
                <div className="col-span-1 sm:col-span-2"><label className="block text-sm text-luxury-gray mb-1">Or paste image URLs (comma separated)</label><input value={form.imageUrls} onChange={(e) => setForm({ ...form, imageUrls: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 py-2.5 rounded-lg text-sm">{editing ? 'Update' : 'Create'} Tester</button>
                <button type="button" onClick={resetForm} className="btn-outline px-6 py-2.5 rounded-lg text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="luxury-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-luxury-gold/10">
                <th className="text-left text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Product</th>
                <th className="text-left text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Price</th>
                <th className="text-left text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Gender</th>
                <th className="text-left text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Stock</th>
                <th className="text-right text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-luxury-gold/5"><td colSpan="5" className="px-4 py-4"><div className="h-4 skeleton rounded w-full" /></td></tr>
                ))
              ) : products.length === 0 ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-luxury-gray text-sm">No testers yet</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-b border-luxury-gold/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.images?.[0] || ''} alt="" className="w-10 h-10 rounded-lg object-cover bg-luxury-black" />
                        <span className="text-sm text-white">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-sm text-luxury-gold">{formatPrice(product.discountPrice || product.price)}</span></td>
                    <td className="px-4 py-3"><span className="text-sm text-luxury-gray">{product.gender}</span></td>
                    <td className="px-4 py-3"><span className={`text-sm ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>{product.stock}</span></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(product)} className="p-1.5 rounded-lg text-luxury-gray hover:text-luxury-gold hover:bg-luxury-gold/10 transition-all"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(product._id)} className="p-1.5 rounded-lg text-luxury-gray hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTesters;
