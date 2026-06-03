import { useState, useEffect } from 'react';
import { Save, Settings2, CreditCard, Shield, Wrench, Globe, Mail, Hash } from 'lucide-react';
import { settingService } from '../services/api';
import { useToast } from '../components/ui/Toaster';

const tabs = [
  { id: 'general', label: 'General', icon: Settings2 },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'contact', label: 'Contact & Social', icon: Mail },
  { id: 'maintenance', label: 'Maintenance', icon: Shield },
];

const AdminSettings = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    siteName: 'SK SCENTS',
    siteDescription: 'Luxury fragrances crafted for confidence, elegance and timeless identity.',
    adminEmail: 'admin@sk-scents.com',
    currency: 'PKR',
    taxRate: 0,
    shippingFee: 0,
    freeShippingThreshold: 200,
    enableNewsletter: true,
    maintenanceMode: false,
    easypaisaEnabled: true,
    jazzcashEnabled: true,
    cardEnabled: true,
    codEnabled: true,
    easypaisaNumber: '',
    jazzcashNumber: '',
    contactEmail: 'hello@sk-scents.com',
    contactEmail2: 'support@sk-scents.com',
    contactPhone: '+1 (555) 123-4567',
    contactPhone2: '+1 (555) 987-6543',
    contactAddress: 'SK SCENTS Headquarters, New York, NY 10001, USA',
    socialFacebook: '',
    socialInstagram: '',
    socialTwitter: '',
    socialYouTube: '',
    socialTikTok: '',
    socialLinkedin: '',
  });

  useEffect(() => {
    settingService.getAll()
      .then((res) => setForm((prev) => ({ ...prev, ...res.data })))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingService.update(form);
      addToast('Settings saved successfully', 'success');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Failed to save settings';
      console.error('Settings save error:', err?.response?.data || err.message);
      addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const TabButton = ({ tab: t }) => {
    const Icon = t.icon;
    return (
      <button onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all ${activeTab === t.id ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20' : 'text-luxury-gray hover:text-white border border-transparent'}`}>
        <Icon className="w-4 h-4" /> {t.label}
      </button>
    );
  };

  if (loading) return <div className="text-center text-luxury-gray py-20">Loading...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-2xl text-white">Settings</h1>

      <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map((t) => <TabButton key={t.id} tab={t} />)}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === 'general' && (
          <div className="luxury-card rounded-xl p-6 space-y-4">
            <h2 className="font-display text-lg text-white mb-4">General Settings</h2>
            <div>
              <label className="block text-sm text-luxury-gray mb-1">Site Name</label>
              <input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-luxury-gray mb-1">Site Description</label>
              <textarea value={form.siteDescription} onChange={(e) => setForm({ ...form, siteDescription: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm min-h-[80px]" />
            </div>
            <div>
              <label className="block text-sm text-luxury-gray mb-1">Admin Email</label>
              <input type="email" value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-luxury-gray mb-1">Currency</label>
                <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm">
                  <option value="PKR">PKR (₨)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-luxury-gray mb-1">Tax Rate (%)</label>
                <input type="number" step="0.1" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-luxury-gray mb-1">Shipping Fee</label>
                <input type="number" step="0.01" value={form.shippingFee} onChange={(e) => setForm({ ...form, shippingFee: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-luxury-gray mb-1">Free Shipping Over</label>
                <input type="number" step="0.01" value={form.freeShippingThreshold} onChange={(e) => setForm({ ...form, freeShippingThreshold: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input type="checkbox" checked={form.enableNewsletter} onChange={(e) => setForm({ ...form, enableNewsletter: e.target.checked })} className="accent-luxury-gold" />
              <span className="text-sm text-luxury-gray">Enable Newsletter Signup</span>
            </label>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="luxury-card rounded-xl p-6 space-y-4">
              <h2 className="font-display text-lg text-white mb-4">Payment Methods</h2>
              {[
                { key: 'codEnabled', label: 'Cash on Delivery (COD)', desc: 'Customers pay in cash upon delivery' },
                { key: 'easypaisaEnabled', label: 'Easypaisa', desc: 'Mobile wallet payment via Easypaisa' },
                { key: 'jazzcashEnabled', label: 'JazzCash', desc: 'Mobile wallet payment via JazzCash' },
                { key: 'cardEnabled', label: 'Credit / Debit Card', desc: 'Card payments with last 4 digits & brand' },
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex items-center justify-between p-3 rounded-lg bg-luxury-black/50 border border-white/5 cursor-pointer hover:border-luxury-gold/20 transition-all">
                  <div>
                    <p className="text-sm text-white">{label}</p>
                    <p className="text-xs text-luxury-gray mt-0.5">{desc}</p>
                  </div>
                  <input type="checkbox" checked={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} className="accent-luxury-gold scale-110" />
                </label>
              ))}
            </div>
            <div className="luxury-card rounded-xl p-6 space-y-4">
              <h2 className="font-display text-lg text-white mb-4">Mobile Account Details</h2>
              <div>
                <label className="block text-sm text-luxury-gray mb-1">Easypaisa Account Number</label>
                <input value={form.easypaisaNumber} onChange={(e) => setForm({ ...form, easypaisaNumber: e.target.value })} placeholder="03XXXXXXXXX" className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-luxury-gray mb-1">JazzCash Account Number</label>
                <input value={form.jazzcashNumber} onChange={(e) => setForm({ ...form, jazzcashNumber: e.target.value })} placeholder="03XXXXXXXXX" className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="luxury-card rounded-xl p-6 space-y-4">
              <h2 className="font-display text-lg text-white mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-luxury-gray mb-1">Primary Email</label>
                  <input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-luxury-gray mb-1">Secondary Email</label>
                  <input value={form.contactEmail2} onChange={(e) => setForm({ ...form, contactEmail2: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-luxury-gray mb-1">Primary Phone</label>
                  <input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-luxury-gray mb-1">Secondary Phone</label>
                  <input value={form.contactPhone2} onChange={(e) => setForm({ ...form, contactPhone2: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm text-luxury-gray mb-1">Address</label>
                  <input value={form.contactAddress} onChange={(e) => setForm({ ...form, contactAddress: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" />
                </div>
              </div>
            </div>
            <div className="luxury-card rounded-xl p-6 space-y-4">
              <h2 className="font-display text-lg text-white mb-4">Social Media Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'socialFacebook', label: 'Facebook', icon: 'facebook', placeholder: 'https://facebook.com/...' },
                  { key: 'socialInstagram', label: 'Instagram', icon: 'instagram', placeholder: 'https://instagram.com/...' },
                  { key: 'socialTwitter', label: 'Twitter / X', icon: 'twitter', placeholder: 'https://twitter.com/...' },
                  { key: 'socialYouTube', label: 'YouTube', icon: 'youtube', placeholder: 'https://youtube.com/...' },
                  { key: 'socialTikTok', label: 'TikTok', icon: 'tiktok', placeholder: 'https://tiktok.com/...' },
                  { key: 'socialLinkedin', label: 'LinkedIn', icon: 'linkedin', placeholder: 'https://linkedin.com/...' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm text-luxury-gray mb-1">{label}</label>
                    <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="luxury-card rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg text-white">Maintenance Mode</h2>
                <p className="text-sm text-luxury-gray mt-1">When enabled, only admins can access the site. Visitors will see a maintenance page.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.maintenanceMode} onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })} className="sr-only peer" />
                <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-luxury-gold peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            {form.maintenanceMode && (
              <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4">
                <p className="text-yellow-300 text-sm flex items-center gap-2">
                  <Wrench className="w-4 h-4 shrink-0" />
                  Your site is currently in maintenance mode. Only logged-in admins can access the frontend.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs tracking-wider uppercase">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
