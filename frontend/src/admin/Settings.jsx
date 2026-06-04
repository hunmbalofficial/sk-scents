import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Save,
  Settings2,
  CreditCard,
  Shield,
  Wrench,
  Mail,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Info,
} from 'lucide-react';
import { settingService } from '../services/api';
import { useToast } from '../components/ui/Toaster';

const TABS = [
  { id: 'general', label: 'General', icon: Settings2 },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'contact', label: 'Contact & Social', icon: Mail },
  { id: 'maintenance', label: 'Maintenance', icon: Shield },
];

const DEFAULTS = {
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
};

const isValidUrl = (val) => {
  if (!val) return true;
  try {
    const u = new URL(val);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidEmail = (val) => {
  if (!val) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
};

const num = (v, fallback = 0) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

const AdminSettings = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [savedForm, setSavedForm] = useState({ ...DEFAULTS });
  const [form, setForm] = useState({ ...DEFAULTS });
  const [savingSection, setSavingSection] = useState(null);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [errors, setErrors] = useState({});
  const [maintenanceConfirm, setMaintenanceConfirm] = useState(false);
  const [showAccount, setShowAccount] = useState({ easypaisa: false, jazzcash: false });
  const tabRefs = useRef({});

  useEffect(() => {
    let mounted = true;
    settingService.getAll()
      .then((res) => {
        if (!mounted) return;
        const merged = { ...DEFAULTS, ...(res?.data || {}) };
        setForm(merged);
        setSavedForm(merged);
      })
      .catch((err) => {
        if (!mounted) return;
        addToast('Failed to load settings. Reloading defaults.', 'error');
        setForm({ ...DEFAULTS });
        setSavedForm({ ...DEFAULTS });
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [addToast]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const dirty = useMemo(() => {
    return Object.keys(DEFAULTS).some((k) => form[k] !== savedForm[k]);
  }, [form, savedForm]);

  const sectionDirty = (keys) => keys.some((k) => form[k] !== savedForm[k]);

  const validateSection = (keys) => {
    const e = {};
    keys.forEach((k) => {
      if (k === 'adminEmail' || k === 'contactEmail' || k === 'contactEmail2') {
        if (!isValidEmail(form[k])) e[k] = 'Invalid email format';
      }
      if (k.startsWith('social') && form[k] && !isValidUrl(form[k])) {
        e[k] = 'Must be a valid URL (https://...)';
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (sectionKey, fields) => {
    if (!validateSection(fields)) {
      addToast('Please fix the highlighted fields', 'error');
      return;
    }

    setSavingSection(sectionKey);
    try {
      const payload = {};
      fields.forEach((f) => { payload[f] = form[f]; });
      await settingService.update(payload);
      const newSaved = { ...savedForm, ...payload };
      setForm(newSaved);
      setSavedForm(newSaved);
      setLastSavedAt(new Date());
      addToast('Settings saved successfully', 'success');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Failed to save settings';
      console.error('Settings save error:', err?.response?.data || err.message);
      addToast(msg, 'error');
    } finally {
      setSavingSection(null);
    }
  };

  const handleReset = (fields) => {
    const next = { ...form };
    fields.forEach((f) => { next[f] = DEFAULTS[f]; });
    setForm(next);
    addToast('Reset to defaults (not saved yet)', 'info');
  };

  const handleTabClick = (id) => {
    setActiveTab(id);
    tabRefs.current[id]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const ToggleSwitch = ({ checked, onChange, label }) => (
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-luxury-gold peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
      {label && <span className="sr-only">{label}</span>}
    </label>
  );

  const Field = ({ label, hint, children, error }) => (
    <div>
      {label && <label className="block text-xs uppercase tracking-wider text-luxury-gray mb-1.5">{label}</label>}
      {children}
      {hint && !error && <p className="text-[11px] text-luxury-gray/70 mt-1">{hint}</p>}
      {error && <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );

  const SaveBar = ({ sectionKey, fields, label = 'Save' }) => {
    const isDirty = sectionDirty(fields);
    const saving = savingSection === sectionKey;
    return (
      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => handleReset(fields)}
          disabled={!isDirty || saving}
          className="px-4 py-2 rounded-lg text-[11px] uppercase tracking-wider text-luxury-gray hover:text-white border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
        <button
          type="button"
          onClick={() => handleSave(sectionKey, fields)}
          disabled={!isDirty || saving}
          className="btn-primary px-5 py-2 rounded-lg text-[11px] uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {saving ? 'Saving...' : label}
        </button>
      </div>
    );
  };

  const Card = ({ title, description, children, footer }) => (
    <div className="luxury-card rounded-xl p-5 sm:p-6 space-y-4">
      {(title || description) && (
        <div className="border-b border-white/5 pb-3">
          {title && <h2 className="font-display text-base sm:text-lg text-white">{title}</h2>}
          {description && <p className="text-xs text-luxury-gray mt-1">{description}</p>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
      {footer}
    </div>
  );

  const TabButton = ({ tab: t }) => {
    const Icon = t.icon;
    const isActive = activeTab === t.id;
    return (
      <button
        ref={(el) => (tabRefs.current[t.id] = el)}
        onClick={() => handleTabClick(t.id)}
        className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-[11px] tracking-wider uppercase whitespace-nowrap transition-all shrink-0 ${
          isActive
            ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20'
            : 'text-luxury-gray hover:text-white border border-transparent'
        }`}
      >
        <Icon className="w-4 h-4" /> {t.label}
        {dirty && t.id === 'general' && isActive && (
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-luxury-gold"></span>
        )}
      </button>
    );
  };

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="h-8 w-40 bg-white/5 rounded animate-pulse" />
        <div className="flex gap-2">
          {TABS.map((t) => (
            <div key={t.id} className="h-10 w-28 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="luxury-card rounded-xl p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
              <div className="h-10 w-full bg-white/5 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl text-white">Settings</h1>
          <p className="text-xs text-luxury-gray mt-1">Manage your store configuration</p>
        </div>
        {lastSavedAt && (
          <p className="text-[11px] text-luxury-gray/70 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400/70" />
            Last saved {lastSavedAt.toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0">
        {TABS.map((t) => <TabButton key={t.id} tab={t} />)}
      </div>

      {activeTab === 'general' && (
        <Card
          title="General Settings"
          description="Basic site configuration"
          footer={<SaveBar sectionKey="general" fields={['siteName','siteDescription','adminEmail','currency','taxRate','shippingFee','freeShippingThreshold','enableNewsletter']} />}
        >
          <Field label="Site Name">
            <input
              value={form.siteName}
              onChange={(e) => setField('siteName', e.target.value)}
              className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm"
              maxLength={60}
            />
          </Field>
          <Field label="Site Description" hint="Shown in footer and meta description">
            <textarea
              value={form.siteDescription}
              onChange={(e) => setField('siteDescription', e.target.value)}
              className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm min-h-[80px] resize-y"
              maxLength={500}
            />
            <p className="text-[10px] text-luxury-gray/50 mt-1 text-right">{form.siteDescription.length}/500</p>
          </Field>
          <Field label="Admin Email" error={errors.adminEmail}>
            <input
              type="email"
              value={form.adminEmail}
              onChange={(e) => setField('adminEmail', e.target.value)}
              className={`input-luxury w-full rounded-lg px-4 py-2.5 text-sm ${errors.adminEmail ? 'border-red-400/50' : ''}`}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Currency">
              <select
                value={form.currency}
                onChange={(e) => setField('currency', e.target.value)}
                className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm"
              >
                <option value="PKR">PKR (₨)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </Field>
            <Field label="Tax Rate (%)" hint="0 disables tax">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={form.taxRate}
                onChange={(e) => setField('taxRate', e.target.value === '' ? 0 : num(e.target.value))}
                className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm"
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Shipping Fee">
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.shippingFee}
                onChange={(e) => setField('shippingFee', e.target.value === '' ? 0 : num(e.target.value))}
                className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm"
              />
            </Field>
            <Field label="Free Shipping Over" hint="Orders above this value get free shipping">
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.freeShippingThreshold}
                onChange={(e) => setField('freeShippingThreshold', e.target.value === '' ? 0 : num(e.target.value))}
                className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm"
              />
            </Field>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-luxury-black/50 border border-white/5">
            <div>
              <p className="text-sm text-white">Enable Newsletter Signup</p>
              <p className="text-[11px] text-luxury-gray mt-0.5">Show the newsletter form on the homepage</p>
            </div>
            <ToggleSwitch checked={form.enableNewsletter} onChange={(v) => setField('enableNewsletter', v)} label="Toggle newsletter" />
          </div>
        </Card>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-6">
          <Card
            title="Payment Methods"
            description="Enable or disable payment options for customers"
            footer={<SaveBar sectionKey="payments-methods" fields={['codEnabled','easypaisaEnabled','jazzcashEnabled','cardEnabled']} />}
          >
            {[
              { key: 'codEnabled', label: 'Cash on Delivery (COD)', desc: 'Customers pay in cash upon delivery' },
              { key: 'easypaisaEnabled', label: 'Easypaisa', desc: 'Mobile wallet payment via Easypaisa' },
              { key: 'jazzcashEnabled', label: 'JazzCash', desc: 'Mobile wallet payment via JazzCash' },
              { key: 'cardEnabled', label: 'Credit / Debit Card', desc: 'Card payments with last 4 digits & brand' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-luxury-black/50 border border-white/5">
                <div>
                  <p className="text-sm text-white">{label}</p>
                  <p className="text-[11px] text-luxury-gray mt-0.5">{desc}</p>
                </div>
                <ToggleSwitch checked={form[key]} onChange={(v) => setField(key, v)} label={`Toggle ${label}`} />
              </div>
            ))}
          </Card>

          <Card
            title="Mobile Account Details"
            description="Account numbers customers will send payments to"
            footer={<SaveBar sectionKey="payments-accounts" fields={['easypaisaNumber','jazzcashNumber']} />}
          >
            <Field label="Easypaisa Account Number" hint="Format: 03XXXXXXXXX" error={!form.easypaisaEnabled ? undefined : (!form.easypaisaNumber ? 'Required when Easypaisa is enabled' : undefined)}>
              <div className="relative">
                <input
                  type={showAccount.easypaisa ? 'text' : 'password'}
                  value={form.easypaisaNumber}
                  onChange={(e) => setField('easypaisaNumber', e.target.value.replace(/[^\d+]/g, ''))}
                  placeholder="03XXXXXXXXX"
                  disabled={!form.easypaisaEnabled}
                  className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm pr-10 disabled:opacity-50"
                  maxLength={14}
                />
                <button
                  type="button"
                  onClick={() => setShowAccount((s) => ({ ...s, easypaisa: !s.easypaisa }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-luxury-gray hover:text-white"
                  tabIndex={-1}
                >
                  {showAccount.easypaisa ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
            <Field label="JazzCash Account Number" hint="Format: 03XXXXXXXXX" error={!form.jazzcashEnabled ? undefined : (!form.jazzcashNumber ? 'Required when JazzCash is enabled' : undefined)}>
              <div className="relative">
                <input
                  type={showAccount.jazzcash ? 'text' : 'password'}
                  value={form.jazzcashNumber}
                  onChange={(e) => setField('jazzcashNumber', e.target.value.replace(/[^\d+]/g, ''))}
                  placeholder="03XXXXXXXXX"
                  disabled={!form.jazzcashEnabled}
                  className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm pr-10 disabled:opacity-50"
                  maxLength={14}
                />
                <button
                  type="button"
                  onClick={() => setShowAccount((s) => ({ ...s, jazzcash: !s.jazzcash }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-luxury-gray hover:text-white"
                  tabIndex={-1}
                >
                  {showAccount.jazzcash ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
            {(!form.easypaisaEnabled || !form.jazzcashEnabled) && (
              <p className="text-[11px] text-luxury-gray/70 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>You can leave the account number empty if the payment method is disabled.</span>
              </p>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="space-y-6">
          <Card
            title="Contact Information"
            description="Shown in the footer and Help page"
            footer={<SaveBar sectionKey="contact-info" fields={['contactEmail','contactEmail2','contactPhone','contactPhone2','contactAddress']} />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Primary Email" error={errors.contactEmail}>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setField('contactEmail', e.target.value)}
                  className={`input-luxury w-full rounded-lg px-4 py-2.5 text-sm ${errors.contactEmail ? 'border-red-400/50' : ''}`}
                />
              </Field>
              <Field label="Secondary Email" error={errors.contactEmail2}>
                <input
                  type="email"
                  value={form.contactEmail2}
                  onChange={(e) => setField('contactEmail2', e.target.value)}
                  className={`input-luxury w-full rounded-lg px-4 py-2.5 text-sm ${errors.contactEmail2 ? 'border-red-400/50' : ''}`}
                />
              </Field>
              <Field label="Primary Phone">
                <input
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => setField('contactPhone', e.target.value)}
                  className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm"
                />
              </Field>
              <Field label="Secondary Phone">
                <input
                  type="tel"
                  value={form.contactPhone2}
                  onChange={(e) => setField('contactPhone2', e.target.value)}
                  className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm"
                />
              </Field>
              <div className="col-span-1 sm:col-span-2">
                <Field label="Address">
                  <input
                    value={form.contactAddress}
                    onChange={(e) => setField('contactAddress', e.target.value)}
                    className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm"
                    maxLength={200}
                  />
                </Field>
              </div>
            </div>
          </Card>

          <Card
            title="Social Media Links"
            description="Add full URLs for your social profiles"
            footer={<SaveBar sectionKey="contact-social" fields={['socialFacebook','socialInstagram','socialTwitter','socialYouTube','socialTikTok','socialLinkedin']} />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'socialFacebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
                { key: 'socialInstagram', label: 'Instagram', placeholder: 'https://instagram.com/yourpage' },
                { key: 'socialTwitter', label: 'Twitter / X', placeholder: 'https://twitter.com/yourpage' },
                { key: 'socialYouTube', label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel' },
                { key: 'socialTikTok', label: 'TikTok', placeholder: 'https://tiktok.com/@yourpage' },
                { key: 'socialLinkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourpage' },
              ].map(({ key, label, placeholder }) => (
                <Field key={key} label={label} error={errors[key]}>
                  <input
                    value={form[key]}
                    onChange={(e) => setField(key, e.target.value)}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v && !/^https?:\/\//i.test(v)) {
                        setField(key, `https://${v}`);
                      }
                    }}
                    placeholder={placeholder}
                    className={`input-luxury w-full rounded-lg px-4 py-2.5 text-sm ${errors[key] ? 'border-red-400/50' : ''}`}
                  />
                </Field>
              ))}
            </div>
            <p className="text-[11px] text-luxury-gray/70 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>https:// will be added automatically if you forget. Leave blank to hide a social link.</span>
            </p>
          </Card>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <Card
          title="Maintenance Mode"
          description="When enabled, only admins can access the frontend. Visitors will see a maintenance page."
          footer={<SaveBar sectionKey="maintenance" fields={['maintenanceMode']} />}
        >
          <div className="flex items-center justify-between p-3 rounded-lg bg-luxury-black/50 border border-white/5">
            <div>
              <p className="text-sm text-white">Maintenance Mode</p>
              <p className="text-[11px] text-luxury-gray mt-0.5">
                {form.maintenanceMode ? 'Site is currently offline to visitors' : 'Site is currently online for everyone'}
              </p>
            </div>
            <ToggleSwitch
              checked={form.maintenanceMode}
              onChange={(v) => {
                if (v && !maintenanceConfirm) {
                  setMaintenanceConfirm(true);
                  addToast('Click toggle again within 5s to confirm', 'info');
                  setTimeout(() => setMaintenanceConfirm(false), 5000);
                  return;
                }
                setField('maintenanceMode', v);
                setMaintenanceConfirm(false);
              }}
              label="Toggle maintenance mode"
            />
          </div>

          {maintenanceConfirm && (
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
              <p className="text-yellow-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Click the toggle again to confirm turning maintenance mode ON. Visitors will not be able to browse the site.</span>
              </p>
            </div>
          )}

          {form.maintenanceMode && (
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
              <p className="text-yellow-300 text-xs flex items-start gap-2">
                <Wrench className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Your site is currently in maintenance mode. Only logged-in admins can access the frontend.</span>
              </p>
            </div>
          )}

          <div className="bg-luxury-black/30 border border-white/5 rounded-lg p-3">
            <p className="text-[11px] text-luxury-gray flex items-start gap-2">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Tip: The admin panel is always accessible. You can keep building while visitors see a maintenance page.</span>
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminSettings;
