import { useEffect, useRef, useState } from 'react';
import { HelpCircle, RotateCcw, Truck, MessageCircle, Mail, ChevronDown, Send, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { faqService, complaintService } from '../services/api';

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const sectionRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.fromTo(sectionRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    faqService.getAll().then((res) => setFaqs(res.data)).catch(() => {});
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
    { icon: Truck, label: 'Shipping', text: 'Track orders & delivery info' },
    { icon: RotateCcw, label: 'Returns', text: '14-day return policy' },
    { icon: MessageCircle, label: 'Contact Us', text: 'Reach our support team' },
  ];

  return (
    <div ref={sectionRef} className="min-h-screen bg-luxury-black pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <HelpCircle className="w-10 h-10 text-luxury-gold mx-auto mb-4" />
          <p className="text-luxury-gold text-sm tracking-[0.3em] uppercase mb-2">We're Here to Help</p>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">Help & Support</h1>
          <p className="text-luxury-gray text-lg">Find answers to common questions or get in touch with our team.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          {supportCards.map(({ icon: Icon, label, text }) => (
            <div key={label} className="luxury-card rounded-xl p-6 text-center hover:border-luxury-gold/20 transition-all duration-300">
              <Icon className="w-6 h-6 text-luxury-gold mx-auto mb-3" />
              <h3 className="font-display text-lg text-white mb-1">{label}</h3>
              <p className="text-sm text-luxury-gray">{text}</p>
            </div>
          ))}
        </div>

        <div className="luxury-card rounded-2xl p-8 mb-12">
          <h2 className="font-display text-2xl text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.length === 0 ? (
              <p className="text-center text-luxury-gray py-8">No FAQs available.</p>
            ) : (
              faqs.map((faq, i) => (
                <div key={faq._id} className="border border-white/[0.06] rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left text-sm text-white hover:text-luxury-gold transition-colors">
                    {faq.question}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                    <p className="px-4 pb-4 text-sm text-luxury-gray leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="luxury-card rounded-2xl p-8 mb-12">
          <h2 className="font-display text-2xl text-white mb-4 text-center">Submit a Complaint</h2>
          <p className="text-luxury-gray text-center mb-8">We take your feedback seriously and will respond within 24 hours.</p>
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="font-display text-xl text-white mb-2">Thank You!</h3>
              <p className="text-luxury-gray">Your complaint has been received. Our team will get back to you shortly.</p>
              <button onClick={() => setSubmitted(false)} className="mt-6 text-luxury-gold text-sm hover:underline">Submit another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name *" required className="w-full bg-luxury-black border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-luxury-gray-dark focus:border-luxury-gold/40 outline-none transition-colors" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email *" required className="w-full bg-luxury-black border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-luxury-gray-dark focus:border-luxury-gold/40 outline-none transition-colors" />
              </div>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone Number" className="w-full bg-luxury-black border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-luxury-gray-dark focus:border-luxury-gold/40 outline-none transition-colors" />
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject *" required className="w-full bg-luxury-black border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-luxury-gray-dark focus:border-luxury-gold/40 outline-none transition-colors" />
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your Message *" required rows={5} className="w-full bg-luxury-black border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-luxury-gray-dark focus:border-luxury-gold/40 outline-none transition-colors resize-none" />
              <button type="submit" disabled={sending} className="btn-primary w-full py-3 rounded-lg text-sm tracking-wider uppercase flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> {sending ? 'Sending...' : 'Submit Complaint'}
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <h2 className="font-display text-2xl text-white mb-4">Still have questions?</h2>
          <p className="text-luxury-gray mb-8">Our support team is ready to help you.</p>
          <a href="mailto:hello@sk-scents.com" className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm tracking-wider uppercase">
            <Mail className="w-4 h-4" /> Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help;
