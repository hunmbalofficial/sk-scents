'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Send, HelpCircle, ChevronDown } from 'lucide-react';
import { complaintService, faqService, settingService } from '@/lib/api';
import { useToast } from '@/components/ui/Toaster';
import gsap from 'gsap';

export default function HelpPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [complaintForm, setComplaintForm] = useState({ name: '', email: '', orderId: '', message: '' });
  const [complaintLoading, setComplaintLoading] = useState(false);
  const { addToast } = useToast();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageRef.current) gsap.fromTo(pageRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    faqService.getAll().then((res) => setFaqs(res.data)).catch(() => {});
    settingService.getAll().then((res) => setSettings(res.data)).catch(() => {});
  }, []);

  const handleComplaint = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintForm.name.trim() || !complaintForm.message.trim()) { addToast('Please fill required fields', 'error'); return; }
    setComplaintLoading(true);
    try {
      await complaintService.create(complaintForm);
      addToast('Complaint submitted successfully', 'success');
      setComplaintForm({ name: '', email: '', orderId: '', message: '' });
    } catch { addToast('Failed to submit complaint', 'error'); }
    finally { setComplaintLoading(false); }
  }, [complaintForm, addToast]);

  return (
    <div ref={pageRef} className="min-h-screen bg-luxury-black pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <HelpCircle className="w-10 h-10 text-luxury-gold mx-auto mb-4" />
          <p className="text-luxury-gold text-sm tracking-[0.3em] uppercase mb-2">Support</p>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">How Can We Help?</h1>
          <p className="text-luxury-gray text-lg max-w-2xl mx-auto">We are here to assist you with any questions, concerns, or feedback.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Mail, label: 'Email Us', value: settings.contactEmail || 'hello@sk-scents.com', href: `mailto:${settings.contactEmail || 'hello@sk-scents.com'}` },
            { icon: MessageCircle, label: 'WhatsApp', value: settings.contactPhone || '+1 (555) 123-4567', href: `https://wa.me/${(settings.contactPhone || '+15551234567').replace(/[^0-9]/g, '')}` },
            { icon: MapPin, label: 'Visit Us', value: settings.contactAddress ? settings.contactAddress.split(',')[0] : 'New York, USA', href: '#' },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <a key={i} href={card.href} target="_blank" rel="noopener noreferrer" className="luxury-card rounded-xl p-6 text-center hover:border-luxury-gold/30 transition-all duration-300 group">
                <Icon className="w-8 h-8 text-luxury-gold mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-lg text-white mb-1">{card.label}</h3>
                <p className="text-sm text-luxury-gray">{card.value}</p>
              </a>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {faqs.length > 0 && (
            <div className="luxury-card rounded-xl p-6">
              <h2 className="font-display text-xl text-white mb-6 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-luxury-gold" /> Frequently Asked Questions</h2>
              <div className="space-y-2">
                {faqs.map((faq) => (
                  <div key={faq._id} className="border border-luxury-gold/10 rounded-lg overflow-hidden">
                    <button onClick={() => setActiveFaq(activeFaq === faq._id ? null : faq._id)} className="w-full flex items-center justify-between p-4 text-left text-sm text-white hover:bg-luxury-gold/5 transition-colors">
                      <span className="font-medium pr-4">{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-luxury-gold shrink-0 transition-transform ${activeFaq === faq._id ? 'rotate-180' : ''}`} />
                    </button>
                    {activeFaq === faq._id && <div className="px-4 pb-4 text-sm text-luxury-gray leading-relaxed border-t border-luxury-gold/10 pt-3"><p>{faq.answer}</p></div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="luxury-card rounded-xl p-6">
            <h2 className="font-display text-xl text-white mb-6 flex items-center gap-2"><Send className="w-5 h-5 text-luxury-gold" /> Submit a Complaint</h2>
            <form onSubmit={handleComplaint} className="space-y-4">
              <div><label className="block text-sm text-luxury-gray mb-1">Name *</label><input value={complaintForm.name} onChange={(e) => setComplaintForm((p) => ({ ...p, name: e.target.value }))} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" placeholder="Your name" /></div>
              <div><label className="block text-sm text-luxury-gray mb-1">Email</label><input type="email" value={complaintForm.email} onChange={(e) => setComplaintForm((p) => ({ ...p, email: e.target.value }))} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" placeholder="your@email.com" /></div>
              <div><label className="block text-sm text-luxury-gray mb-1">Order ID</label><input value={complaintForm.orderId} onChange={(e) => setComplaintForm((p) => ({ ...p, orderId: e.target.value }))} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm" placeholder="SK-123456" /></div>
              <div><label className="block text-sm text-luxury-gray mb-1">Message *</label><textarea value={complaintForm.message} onChange={(e) => setComplaintForm((p) => ({ ...p, message: e.target.value }))} className="input-luxury w-full rounded-lg px-4 py-2.5 text-sm min-h-[100px]" placeholder="Describe your issue..." /></div>
              <button type="submit" disabled={complaintLoading} className="btn-primary w-full py-2.5 rounded-lg text-sm tracking-wider uppercase">Submit</button>
            </form>
          </div>
        </div>

        <div className="text-center mt-16">
          <h2 className="font-display text-2xl text-white mb-4">Still Have Questions?</h2>
          <p className="text-luxury-gray mb-6">Our support team is ready to help you.</p>
          <a href={`mailto:${settings.contactEmail || 'hello@sk-scents.com'}`} className="btn-primary px-8 py-3 rounded-lg text-sm tracking-wider uppercase inline-flex items-center gap-2"><Mail className="w-4 h-4" /> Get in Touch</a>
        </div>
      </div>
    </div>
  );
}
