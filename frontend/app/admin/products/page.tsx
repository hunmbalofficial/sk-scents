'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { productService } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/Toaster';

const defaultForm = {
  name: '', price: '', discountPrice: '', description: '', notes: '',
  category: 'Oriental', gender: 'Unisex', stock: '10',
  topNotes: '', middleNotes: '', baseNotes: '',
  featured: false, bestSeller: false, imageUrls: '',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { addToast } = useToast();
  const [form, setForm] = useState({ ...defaultForm });

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = () => {
    setLoading(true);
    productService.getAll().then((res) => setProducts(res.data)).catch(() => addToast('Failed to load products', 'error')).finally(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({ ...defaultForm });
    setEditing(null);
    setShowForm(false);
    setPreviewUrls([]);
  };

  const handleEdit = (product: any) => {
    setForm({
      name: product.name, price: product.price.toString(), discountPrice: product.discountPrice?.toString() || '',
      description: product.description, notes: product.notes || '', category: product.category,
      gender: product.gender, stock: product.stock.toString(), topNotes: product.topNotes?.join(', ') || '',
      middleNotes: product.middleNotes?.join(', ') || '', baseNotes: product.baseNotes?.join(', ') || '',
      imageUrls: Array.isArray(product.images) ? product.images.join(', ') : '',
      featured: product.featured, bestSeller: product.bestSeller,
    });
    setPreviewUrls(Array.isArray(product.images) ? product.images : []);
    setEditing(product._id);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { addToast('Product name is required', 'error'); return; }
    if (!form.price || parseFloat(form.price) <= 0) { addToast('Valid price is required', 'error'); return; }
    if (!form.description.trim()) { addToast('Description is required', 'error'); return; }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('price', form.price);
      formData.append('description', form.description.trim());
      formData.append('category', form.category);
      formData.append('gender', form.gender);
      formData.append('stock', form.stock);
      formData.append('featured', form.featured.toString());
      formData.append('bestSeller', form.bestSeller.toString());
      formData.append('topNotes', JSON.stringify(form.topNotes.split(',').map((s) => s.trim()).filter(Boolean)));
      formData.append('middleNotes', JSON.stringify(form.middleNotes.split(',').map((s) => s.trim()).filter(Boolean)));
      formData.append('baseNotes', JSON.stringify(form.baseNotes.split(',').map((s) => s.trim()).filter(Boolean)));
      if (form.discountPrice) formData.append('discountPrice', form.discountPrice);
      if (form.notes) formData.append('notes', form.notes);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput?.files && fileInput.files.length > 0) {
        Array.from(fileInput.files).forEach((f) => formData.append('images', f));
      } else if (form.imageUrls.trim()) {
        formData.append('images', JSON.stringify(form.imageUrls.split(',').map((s) => s.trim()).filter(Boolean)));
      }

      if (editing) {
        await productService.update(editing, formData);
        addToast('Product updated successfully', 'success');
      } else {
        await productService.create(formData);
        addToast('Product created successfully', 'success');
      }
      resetForm();
      loadProducts();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Failed to save product';
      addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try { await productService.delete(id); addToast('Product deleted', 'success'); loadProducts(); }
    catch { addToast('Failed to delete product', 'error'); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls: string[] = [];
      Array.from(files).forEach((f) => urls.push(URL.createObjectURL(f)));
      setPreviewUrls(urls);
    }
  };

  const categories = ['Oriental', 'Woody', 'Fresh', 'Floral', 'Collections', 'Testers'];
  const genders = ['Men', 'Women', 'Unisex'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-white">Products</h1>
          <p className="text-sm text-luxury-gray mt-1">{products.length} product{products.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2 w-full sm:w-auto justify-center"><Plus className="w-4 h-4" /> Add Product</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-luxury-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-luxury-gold/10">
            <div className="sticky top-0 bg-luxury-card z-10 flex items-center justify-between p-6 pb-4 border-b border-luxury-gold/10">
              <h2 className="font-display text-lg text-white">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={resetForm} className="text-luxury-gray hover:text-white p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm text-luxury-gray mb-1">Name <span className="text-luxury-gold">*</span></label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" placeholder="Product name" />
                </div>
                <div>
                  <label className="block text-sm text-luxury-gray mb-1">Price <span className="text-luxury-gold">*</span></label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm text-luxury-gray mb-1">Discount Price</label>
                  <input type="number" step="0.01" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm text-luxury-gray mb-1">Category <span className="text-luxury-gold">*</span></label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-luxury-gray mb-1">Gender <span className="text-luxury-gold">*</span></label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm">
                    {genders.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-luxury-gray mb-1">Stock <span className="text-luxury-gold">*</span></label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" placeholder="0" />
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-6">
                  <label className="flex items-center gap-2 text-sm text-luxury-gray cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-luxury-gold" /> Featured</label>
                  <label className="flex items-center gap-2 text-sm text-luxury-gray cursor-pointer"><input type="checkbox" checked={form.bestSeller} onChange={(e) => setForm({ ...form, bestSeller: e.target.checked })} className="accent-luxury-gold" /> Best Seller</label>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm text-luxury-gray mb-1">Description <span className="text-luxury-gold">*</span></label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm min-h-[80px]" placeholder="Product description" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm text-luxury-gray mb-1">Notes</label>
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" placeholder="Special notes or ingredients" />
                </div>
                <div>
                  <label className="block text-sm text-luxury-gray mb-1">Top Notes</label>
                  <input value={form.topNotes} onChange={(e) => setForm({ ...form, topNotes: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" placeholder="e.g. Bergamot, Lemon" />
                </div>
                <div>
                  <label className="block text-sm text-luxury-gray mb-1">Middle Notes</label>
                  <input value={form.middleNotes} onChange={(e) => setForm({ ...form, middleNotes: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" placeholder="e.g. Rose, Jasmine" />
                </div>
                <div>
                  <label className="block text-sm text-luxury-gray mb-1">Base Notes</label>
                  <input value={form.baseNotes} onChange={(e) => setForm({ ...form, baseNotes: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" placeholder="e.g. Musk, Sandalwood" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm text-luxury-gray mb-1">Upload Images</label>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="text-sm text-luxury-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-luxury-gold/10 file:text-luxury-gold file:cursor-pointer cursor-pointer w-full" />
                  {previewUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {previewUrls.map((url, i) => (
                        <img key={i} src={url} alt="" className="w-16 h-16 rounded-lg object-cover border border-luxury-gold/10" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm text-luxury-gray mb-1">Or paste image URLs (comma separated)</label>
                  <input value={form.imageUrls} onChange={(e) => setForm({ ...form, imageUrls: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" />
                </div>
              </div>
              <div className="flex gap-3 pt-2 border-t border-luxury-gold/10">
                <button type="button" onClick={handleSubmit} disabled={saving} className="btn-primary flex-1 py-2.5 rounded-lg text-sm flex items-center justify-center gap-2">
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" onClick={resetForm} className="btn-outline px-6 py-2.5 rounded-lg text-sm">Cancel</button>
              </div>
            </div>
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
                <th className="text-left text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Category</th>
                <th className="text-left text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Gender</th>
                <th className="text-left text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Stock</th>
                <th className="text-right text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-luxury-gold/5"><td colSpan={6} className="px-4 py-4"><div className="h-4 skeleton rounded w-full" /></td></tr>
              )) : products.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-luxury-gray text-sm">No products yet. Click &quot;Add Product&quot; to create one.</td></tr>
              ) : products.map((product) => (
                <tr key={product._id} className="border-b border-luxury-gold/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-luxury-black border border-luxury-gold/10 flex items-center justify-center overflow-hidden shrink-0">
                        {product.images?.[0] ? <img src={product.images[0]} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-luxury-gray" />}
                      </div>
                      <span className="text-sm text-white font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-luxury-gold">{formatPrice(product.discountPrice || product.price)}</span>
                    {product.discountPrice && <span className="text-xs text-luxury-gray line-through ml-2">{formatPrice(product.price)}</span>}
                  </td>
                  <td className="px-4 py-3"><span className="text-sm text-luxury-gray capitalize">{product.category}</span></td>
                  <td className="px-4 py-3"><span className="text-sm text-luxury-gray">{product.gender}</span></td>
                  <td className="px-4 py-3"><span className={`text-sm ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>{product.stock}</span></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(product)} className="p-1.5 rounded-lg text-luxury-gray hover:text-luxury-gold hover:bg-luxury-gold/10 transition-all"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(product._id)} className="p-1.5 rounded-lg text-luxury-gray hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
