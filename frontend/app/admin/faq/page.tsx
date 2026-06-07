'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, HelpCircle, MessageSquare, Check, XCircle } from 'lucide-react';
import { faqService, complaintService } from '@/lib/api';
import { useToast } from '@/components/ui/Toaster';

export default function AdminFaqPage() {
  const [activeTab, setActiveTab] = useState('faq');
  const [faqs, setFaqs] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState<string | null>(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });
  const { addToast } = useToast();

  useEffect(() => {
    setLoading(true);
    Promise.all([faqService.getAll(), complaintService.getAll()])
      .then(([faqRes, compRes]) => { setFaqs(faqRes.data); setComplaints(compRes.data); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleFaqSubmit = async () => {
    try {
      if (editingFaq) { await faqService.update(editingFaq, faqForm); addToast('FAQ updated', 'success'); }
      else { await faqService.create(faqForm); addToast('FAQ created', 'success'); }
      setShowFaqForm(false); setEditingFaq(null); setFaqForm({ question: '', answer: '' });
      const res = await faqService.getAll(); setFaqs(res.data);
    } catch { addToast('Failed to save FAQ', 'error'); }
  };

  const handleFaqDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    try { await faqService.delete(id); addToast('FAQ deleted', 'success'); const res = await faqService.getAll(); setFaqs(res.data); }
    catch { addToast('Failed to delete', 'error'); }
  };

  const handleComplaintResolve = async (complaint: any) => {
    try { await complaintService.update(complaint._id, { status: 'Resolved' }); addToast('Complaint marked as resolved', 'success'); const res = await complaintService.getAll(); setComplaints(res.data); }
    catch { addToast('Failed to update', 'error'); }
  };

  const handleComplaintDelete = async (id: string) => {
    if (!confirm('Delete this complaint?')) return;
    try { await complaintService.delete(id); addToast('Complaint deleted', 'success'); const res = await complaintService.getAll(); setComplaints(res.data); }
    catch { addToast('Failed to delete', 'error'); }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-white">Help Management</h1>

      <div className="flex gap-2">
        <button onClick={() => setActiveTab('faq')} className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-all ${activeTab === 'faq' ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20' : 'text-luxury-gray hover:text-white border border-transparent'}`}>
          <HelpCircle className="w-4 h-4 inline mr-1.5" />FAQs
        </button>
        <button onClick={() => setActiveTab('complaints')} className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-all ${activeTab === 'complaints' ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20' : 'text-luxury-gray hover:text-white border border-transparent'}`}>
          <MessageSquare className="w-4 h-4 inline mr-1.5" />Complaints ({complaints.length})
        </button>
      </div>

      {activeTab === 'faq' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setEditingFaq(null); setFaqForm({ question: '', answer: '' }); setShowFaqForm(true); }} className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add FAQ</button>
          </div>

          {showFaqForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFaqForm(false)} />
              <div className="relative bg-luxury-card rounded-2xl p-6 w-full max-w-lg border border-luxury-gold/10">
                <div className="flex items-center justify-between mb-6"><h2 className="font-display text-lg text-white">{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</h2><button onClick={() => setShowFaqForm(false)} className="text-luxury-gray hover:text-white"><X className="w-5 h-5" /></button></div>
                <div className="space-y-4">
                  <div><label className="block text-sm text-luxury-gray mb-1">Question</label><input value={faqForm.question} onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label className="block text-sm text-luxury-gray mb-1">Answer</label><textarea value={faqForm.answer} onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm min-h-[100px]" /></div>
                  <div className="flex gap-3">
                    <button type="button" onClick={handleFaqSubmit} className="btn-primary flex-1 py-2.5 rounded-lg text-sm">{editingFaq ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => setShowFaqForm(false)} className="btn-outline px-6 py-2.5 rounded-lg text-sm">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="luxury-card rounded-xl overflow-hidden">
            <div className="divide-y divide-luxury-gold/5">
              {faqs.length === 0 ? <p className="text-center text-luxury-gray text-sm py-8">No FAQs yet</p> : faqs.map((faq) => (
                <div key={faq._id} className="p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{faq.question}</p>
                    <p className="text-sm text-luxury-gray mt-1">{faq.answer}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => { setEditingFaq(faq._id); setFaqForm({ question: faq.question, answer: faq.answer }); setShowFaqForm(true); }} className="p-1.5 rounded-lg text-luxury-gray hover:text-luxury-gold transition-all"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleFaqDelete(faq._id)} className="p-1.5 rounded-lg text-luxury-gray hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'complaints' && (
        <div className="luxury-card rounded-xl overflow-hidden">
          {loading ? Array.from({ length: 3 }).map((_, i) => (<div key={i} className="p-4 border-b border-luxury-gold/5"><div className="h-4 skeleton rounded w-full" /></div>)) :
            complaints.length === 0 ? <p className="text-center text-luxury-gray text-sm py-8">No complaints</p> :
            <div className="divide-y divide-luxury-gold/5">
              {complaints.map((c: any) => (
                <div key={c._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1"><span className="text-sm text-white font-medium">{c.name}</span><span className={`text-[10px] px-2 py-0.5 rounded-full ${c.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{c.status || 'Pending'}</span></div>
                      {c.email && <p className="text-xs text-luxury-gray">{c.email}</p>}
                      {c.orderId && <p className="text-xs text-luxury-gray">Order: {c.orderId}</p>}
                      <p className="text-sm text-luxury-gray mt-2">{c.message}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {c.status !== 'Resolved' && <button onClick={() => handleComplaintResolve(c)} className="p-1.5 rounded-lg text-luxury-gray hover:text-emerald-400 transition-all"><Check className="w-4 h-4" /></button>}
                      <button onClick={() => handleComplaintDelete(c._id)} className="p-1.5 rounded-lg text-luxury-gray hover:text-red-400 transition-all"><XCircle className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      )}
    </div>
  );
}
