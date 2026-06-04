import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, CheckCircle, Mail, ChevronDown } from 'lucide-react';
import { faqService, complaintService } from '../services/api';
import { useToast } from '../components/ui/Toaster';

const AdminHelp = () => {
  const [tab, setTab] = useState('faq');
  const { addToast } = useToast();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-white">Help & FAQ</h1>

      <div className="flex gap-1 bg-luxury-card rounded-xl p-1 border border-luxury-gold/10 w-fit">
        {['faq', 'complaints'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm capitalize transition-all ${
              tab === t ? 'bg-luxury-gold/10 text-luxury-gold' : 'text-luxury-gray hover:text-white'
            }`}>
            {t === 'faq' ? 'FAQ' : 'Complaints'}
          </button>
        ))}
      </div>

      {tab === 'faq' ? <FaqManager /> : <ComplaintsManager />}
    </div>
  );
};

const FaqManager = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const { addToast } = useToast();
  const [form, setForm] = useState({ question: '', answer: '', order: 0, active: true });

  useEffect(() => { loadFaqs(); }, []);

  const loadFaqs = () => {
    setLoading(true);
    faqService.getAll({ all: true })
      .then((res) => setFaqs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({ question: '', answer: '', order: 0, active: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (faq) => {
    setForm({ question: faq.question, answer: faq.answer, order: faq.order || 0, active: faq.active });
    setEditing(faq._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await faqService.update(editing, form);
        addToast('FAQ updated', 'success');
      } else {
        await faqService.create(form);
        addToast('FAQ created', 'success');
      }
      resetForm();
      loadFaqs();
    } catch {
      addToast('Failed to save FAQ', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this FAQ?')) return;
    try {
      await faqService.delete(id);
      addToast('FAQ deleted', 'success');
      loadFaqs();
    } catch {
      addToast('Failed to delete', 'error');
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="bg-luxury-card border border-luxury-gold/10 rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-luxury-gold/10">
              <h2 className="font-display text-lg text-white">{editing ? 'Edit FAQ' : 'New FAQ'}</h2>
              <button onClick={resetForm} className="text-luxury-gray hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Question</label>
                <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full bg-luxury-black border border-luxury-gold/10 rounded-lg px-4 py-2.5 text-sm text-white" required />
              </div>
              <div>
                <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Answer</label>
                <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} className="w-full bg-luxury-black border border-luxury-gold/10 rounded-lg px-4 py-2.5 text-sm text-white" required />
              </div>
              <div>
                <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Display Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full bg-luxury-black border border-luxury-gold/10 rounded-lg px-4 py-2.5 text-sm text-white" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-luxury-gold" />
                <span className="text-sm text-white/80">Active</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleSubmit} className="flex-1 btn-primary py-2.5 rounded-lg text-xs tracking-wider uppercase">{editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={resetForm} className="flex-1 border border-white/10 text-luxury-gray hover:text-white py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="luxury-card rounded-xl p-5"><div className="h-4 skeleton rounded w-3/4" /></div>
          ))}
        </div>
      ) : faqs.length === 0 ? (
        <div className="text-center text-luxury-gray py-20">No FAQs yet</div>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq) => (
            <div key={faq._id} className="luxury-card rounded-xl p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-sm font-medium text-white">{faq.question}</h3>
                  {!faq.active && <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">Inactive</span>}
                </div>
                <p className="text-sm text-luxury-gray line-clamp-2 mt-1">{faq.answer}</p>
                {faq.order > 0 && <span className="text-xs text-luxury-gray-dark mt-1 inline-block">Order: {faq.order}</span>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => handleEdit(faq)} className="p-2 rounded-lg text-luxury-gray hover:text-luxury-gold hover:bg-luxury-gold/10 transition-all"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(faq._id)} className="p-2 rounded-lg text-luxury-gray hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const ComplaintsManager = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const { addToast } = useToast();

  useEffect(() => { loadComplaints(); }, []);

  const loadComplaints = () => {
    setLoading(true);
    complaintService.getAll()
      .then((res) => setComplaints(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleResolve = async (id) => {
    try {
      await complaintService.update(id, { status: 'resolved' });
      addToast('Complaint marked as resolved', 'success');
      loadComplaints();
    } catch {
      addToast('Failed to update', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this complaint?')) return;
    try {
      await complaintService.delete(id);
      addToast('Complaint deleted', 'success');
      loadComplaints();
    } catch {
      addToast('Failed to delete', 'error');
    }
  };

  const pendingCount = complaints.filter((c) => c.status === 'pending').length;

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-luxury-gray">{complaints.length} total</span>
        {pendingCount > 0 && (
          <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full">{pendingCount} pending</span>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="luxury-card rounded-xl p-5"><div className="h-4 skeleton rounded w-3/4" /></div>
          ))}
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center text-luxury-gray py-20">No complaints yet</div>
      ) : (
        <div className="space-y-2">
          {complaints.map((c) => (
            <div key={c._id} className={`luxury-card rounded-xl overflow-hidden border-l-2 transition-all ${
              c.status === 'pending' ? 'border-l-yellow-500/50' : 'border-l-green-500/30'
            }`}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-sm font-medium text-white">{c.subject}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        c.status === 'pending'
                          ? 'text-yellow-400 bg-yellow-400/10'
                          : 'text-green-400 bg-green-400/10'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-luxury-gray">
                      <span>{c.name}</span>
                      <span>{c.email}</span>
                      {c.phone && <span>{c.phone}</span>}
                    </div>
                    <p className="text-xs text-luxury-gray-dark mt-2">{new Date(c.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {c.status === 'pending' && (
                      <button onClick={() => handleResolve(c._id)} className="p-2 rounded-lg text-luxury-gray hover:text-green-400 hover:bg-green-400/10 transition-all" title="Mark as resolved">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => setExpanded(expanded === c._id ? null : c._id)} className={`p-2 rounded-lg transition-all ${
                      expanded === c._id ? 'text-luxury-gold bg-luxury-gold/10' : 'text-luxury-gray hover:text-luxury-gold hover:bg-luxury-gold/10'
                    }`}>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expanded === c._id ? 'rotate-180' : ''}`} />
                    </button>
                    <button onClick={() => handleDelete(c._id)} className="p-2 rounded-lg text-luxury-gray hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${
                expanded === c._id ? 'max-h-96' : 'max-h-0'
              }`}>
                <div className="px-5 pb-5 pt-0 border-t border-luxury-gold/5">
                  <p className="text-sm text-luxury-gray leading-relaxed whitespace-pre-wrap mt-3">{c.message}</p>
                  <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1.5 text-xs text-luxury-gold hover:underline mt-3">
                    <Mail className="w-3 h-3" /> Reply via email
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AdminHelp;
