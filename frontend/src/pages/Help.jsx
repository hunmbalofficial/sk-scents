import { useEffect, useRef, useState } from 'react';
import { HelpCircle, RotateCcw, Truck, MessageCircle, Mail, Send, CheckCircle, Phone, Clock, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { complaintService } from '../services/api';

const Help = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const formRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const tl = gsap.timeline();
    tl.fromTo(sectionRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    cardsRef.current.forEach((el, i) => {
      tl.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3');
    });
    tl.fromTo(formRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await complaintService.create(form);
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      alert('Failed to submit. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const supportCards = [
    { icon: Truck, label: 'Shipping', text: 'Track orders & delivery info', color: 'from-blue-500/20 to-blue-500/5' },
    { icon: RotateCcw, label: 'Returns', text: '14-day return policy', color: 'from-emerald-500/20 to-emerald-500/5' },
    { icon: MessageCircle, label: 'Contact Us', text: 'Reach our support team', color: 'from-amber-500/20 to-amber-500/5' },
  ];

  return (
    <div ref={sectionRef} className="min-h-screen bg-luxury-black pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 rounded-full bg-luxury-gold/5 blur-3xl" />
          </div>
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-luxury-gold/10 flex items-center justify-center mx-auto mb-6 rotate-45">
              <HelpCircle className="w-8 h-8 text-luxury-gold -rotate-45" />
            </div>
            <p className="text-luxury-gold text-sm tracking-[0.3em] uppercase mb-3">We're Here to Help</p>
            <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">Help & Support</h1>
            <p className="text-luxury-gray text-lg max-w-xl mx-auto">Find answers to common questions or get in touch with our team. We typically respond within 24 hours.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          {supportCards.map(({ icon: Icon, label, text, color }, i) => (
            <div
              key={label}
              ref={(el) => (cardsRef.current[i] = el)}
              className={`relative luxury-card rounded-xl p-6 text-center hover:border-luxury-gold/20 transition-all duration-300 group overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-luxury-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-luxury-gold" />
                </div>
                <h3 className="font-display text-lg text-white mb-1">{label}</h3>
                <p className="text-sm text-luxury-gray">{text}</p>
              </div>
            </div>
          ))}
        </div>



        <div ref={formRef} className="mb-12">
          <div className="luxury-card rounded-2xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-luxury-gold/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-5 h-5 text-luxury-gold" />
              </div>
              <h2 className="font-display text-2xl text-white mb-2">Submit a Complaint</h2>
              <p className="text-luxury-gray">We take your feedback seriously and will respond within 24 hours.</p>
            </div>
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="font-display text-xl text-white mb-2">Thank You!</h3>
                <p className="text-luxury-gray max-w-md mx-auto">Your complaint has been received. Our team will review it and get back to you shortly.</p>
                <button onClick={() => setSubmitted(false)} className="mt-8 btn-outline inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm">
                  Submit another <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Full Name *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required className="w-full bg-luxury-black border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-luxury-gray-dark focus:border-luxury-gold/40 outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" required className="w-full bg-luxury-black border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-luxury-gray-dark focus:border-luxury-gold/40 outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="03XX-XXXXXXX" className="w-full bg-luxury-black border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-luxury-gray-dark focus:border-luxury-gold/40 outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Subject *</label>
                  <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Brief title for your complaint" required className="w-full bg-luxury-black border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-luxury-gray-dark focus:border-luxury-gold/40 outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-luxury-gray uppercase tracking-wider mb-1.5">Message *</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Describe your issue in detail..." required rows={5} className="w-full bg-luxury-black border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-luxury-gray-dark focus:border-luxury-gold/40 outline-none transition-colors resize-none" />
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full py-3.5 rounded-lg text-sm tracking-wider uppercase flex items-center justify-center gap-2">
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {sending ? 'Sending...' : 'Submit Complaint'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent" />
          <div className="relative luxury-card rounded-2xl p-8 sm:p-10 text-center border-luxury-gold/10">
            <div className="max-w-md mx-auto">
              <h2 className="font-display text-2xl text-white mb-3">Still have questions?</h2>
              <p className="text-luxury-gray mb-8">Our support team is ready to help you with any inquiries or concerns.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href="mailto:hello@sk-scents.com" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm tracking-wider uppercase w-full sm:w-auto justify-center">
                  <Mail className="w-4 h-4" /> Email Us
                </a>
                <a href="tel:+1234567890" className="btn-outline inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm tracking-wider uppercase w-full sm:w-auto justify-center">
                  <Phone className="w-4 h-4" /> Call Us
                </a>
              </div>
              <p className="text-xs text-luxury-gray mt-6 flex items-center justify-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Response time: within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
