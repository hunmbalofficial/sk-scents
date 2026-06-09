'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MessageCircle, Mail, MapPin, Send, HelpCircle, Loader2, Sparkles, User, Hash, MessageSquare, Phone } from 'lucide-react';
import { complaintService, settingService } from '@/lib/api';
import { useToast } from '@/components/ui/Toaster';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HelpPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [complaintForm, setComplaintForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [complaintLoading, setComplaintLoading] = useState(false);
  const { addToast } = useToast();
  const pageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(pageRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
      if (headingRef.current) {
        gsap.fromTo(headingRef.current, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
        });
      }
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: cardsRef.current, start: 'top 80%' },
          }
        );
      }
      if (formCardRef.current) {
        gsap.fromTo(formCardRef.current, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: formCardRef.current, start: 'top 80%' },
        });
      }
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' },
        });
      }
      document.querySelectorAll('.floating-dot').forEach((dot, i) => {
        gsap.to(dot, {
          y: gsap.utils.random(-20, -40),
          x: gsap.utils.random(-15, 15),
          duration: gsap.utils.random(2, 4),
          repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.3,
        });
      });
    });
    settingService.getAll().then((res) => setSettings(res.data)).catch(() => {});
    return () => ctx.revert();
  }, []);

  const handleComplaint = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintForm.name.trim() || !complaintForm.message.trim()) { addToast('Please fill required fields', 'error'); return; }
    setComplaintLoading(true);
    try {
      await complaintService.create({ ...complaintForm, email: complaintForm.email || 'not@provided.com', subject: 'Customer Complaint' });
      addToast('Complaint submitted successfully', 'success');
      setComplaintForm({ name: '', email: '', phone: '', message: '' });
    } catch { addToast('Failed to submit complaint', 'error'); }
    finally { setComplaintLoading(false); }
  }, [complaintForm, addToast]);

  const contactCards = [
    { icon: Mail, label: 'Email Us', value: settings.contactEmail || 'hello@sk-scents.com', href: `mailto:${settings.contactEmail || 'hello@sk-scents.com'}` },
    { icon: MessageCircle, label: 'WhatsApp', value: settings.contactPhone || '+1 (555) 123-4567', href: `https://wa.me/${(settings.contactPhone || '+15551234567').replace(/[^0-9]/g, '')}` },
    { icon: MapPin, label: 'Visit Us', value: settings.contactAddress ? settings.contactAddress.split(',')[0] : 'New York, USA', href: '#' },
  ];

  return (
    <div ref={pageRef} className="min-h-screen bg-luxury-black pt-28 pb-16 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-luxury-gold/5 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-luxury-gold/3 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-40 right-20 w-2 h-2 bg-luxury-gold/30 rounded-full floating-dot pointer-events-none" />
      <div className="absolute top-60 left-10 w-1.5 h-1.5 bg-luxury-gold/20 rounded-full floating-dot pointer-events-none" />
      <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-luxury-gold/25 rounded-full floating-dot pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-luxury-gold/30 rounded-full floating-dot pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div ref={headingRef} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-luxury-gold/10 border border-luxury-gold/25 rounded-full px-4 py-1.5 mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="text-luxury-gold text-xs tracking-[0.3em] uppercase">Support</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">How Can We Help?</h1>
          <p className="text-luxury-gray text-lg max-w-2xl mx-auto">We are here to assist you with any questions, concerns, or feedback.</p>
        </div>

        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/[0.02] to-transparent pointer-events-none" />
          <div className="relative">
            <div className="text-center mb-14">
              <p className="text-luxury-gold text-sm tracking-[0.3em] uppercase mb-2">Contact</p>
              <h2 className="font-display text-3xl sm:text-4xl text-white">Get in Touch</h2>
            </div>
            <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
              {contactCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <a key={i} href={card.href} target="_blank" rel="noopener noreferrer" className="luxury-card rounded-xl p-8 text-center hover:border-luxury-gold/30 transition-all duration-300 group">
                    <div className="w-14 h-14 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-luxury-gold/20 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-6 h-6 text-luxury-gold" />
                    </div>
                    <h3 className="font-display text-lg text-white mb-2">{card.label}</h3>
                    <p className="text-sm text-luxury-gray">{card.value}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-luxury-gold/[0.01] to-transparent pointer-events-none" />
          <div className="relative max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-luxury-gold text-sm tracking-[0.3em] uppercase mb-2">Complaints</p>
              <h2 className="font-display text-3xl sm:text-4xl text-white">Submit a Complaint</h2>
              <p className="text-luxury-gray text-sm mt-2">We will get back to you within 24 hours</p>
            </div>
            <div ref={formCardRef}>
              <div className="luxury-card rounded-xl p-6 sm:p-8 border-luxury-gold/15">
                <form onSubmit={handleComplaint} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-luxury-gray mb-1.5">
                        Name <span className="text-luxury-gold">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-luxury-gold/60" />
                        <input
                          value={complaintForm.name}
                          onChange={(e) => setComplaintForm((p) => ({ ...p, name: e.target.value }))}
                          className="input-luxury w-full rounded-lg pl-9 pr-3.5 py-2.5 text-sm"
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-luxury-gray mb-1.5">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-luxury-gold/60" />
                        <input
                          type="email"
                          value={complaintForm.email}
                          onChange={(e) => setComplaintForm((p) => ({ ...p, email: e.target.value }))}
                          className="input-luxury w-full rounded-lg pl-9 pr-3.5 py-2.5 text-sm"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-luxury-gray mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-luxury-gold/60" />
                      <input
                        value={complaintForm.phone}
                        onChange={(e) => setComplaintForm((p) => ({ ...p, phone: e.target.value }))}
                        className="input-luxury w-full rounded-lg pl-9 pr-3.5 py-2.5 text-sm"
                        placeholder="03XX-XXXXXXX"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-luxury-gray mb-1.5">
                      Message <span className="text-luxury-gold">*</span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-3.5 h-3.5 text-luxury-gold/60" />
                      <textarea
                        value={complaintForm.message}
                        onChange={(e) => setComplaintForm((p) => ({ ...p, message: e.target.value }))}
                        className="input-luxury w-full rounded-lg pl-9 pr-3.5 py-2.5 text-sm min-h-[120px] resize-none"
                        placeholder="Describe your issue in detail..."
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={complaintLoading}
                    className="btn-primary w-full py-3 rounded-lg text-sm tracking-wider uppercase inline-flex items-center justify-center gap-2"
                  >
                    {complaintLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {complaintLoading ? 'Submitting...' : 'Submit Complaint'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <div ref={ctaRef} className="text-center mt-8 mb-16 relative">
          <div className="absolute inset-0 bg-luxury-gold/5 rounded-[2rem] blur-[60px] pointer-events-none" />
          <div className="relative luxury-card rounded-[2rem] p-12 sm:p-16 border border-luxury-gold/10">
            <div className="w-16 h-16 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-luxury-gold" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">Still Have Questions?</h2>
            <p className="text-luxury-gray text-lg max-w-xl mx-auto mb-8">Our support team is ready to help you with any inquiries you may have.</p>
            <a
              href={`mailto:${settings.contactEmail || 'hello@sk-scents.com'}`}
              className="btn-primary px-10 py-3.5 rounded-lg text-sm tracking-wider uppercase inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
