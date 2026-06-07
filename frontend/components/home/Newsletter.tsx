'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { alert('Thank you for subscribing!'); setEmail(''); }
  };

  return (
    <section className="py-24 bg-luxury-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/[0.03] to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-luxury-gold/5 rounded-full blur-[100px]" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <p className="text-luxury-gold text-sm tracking-[0.3em] uppercase mb-4">Stay Connected</p>
        <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">Join Our World</h2>
        <p className="text-luxury-gray mb-8 max-w-md mx-auto">Subscribe to receive exclusive offers, new fragrance launches, and luxury insights.</p>
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="flex-1 input-luxury rounded-lg px-5 py-3 text-sm" />
          <button type="submit" className="btn-primary px-6 py-3 rounded-lg"><Send className="w-4 h-4" /></button>
        </form>
      </div>
    </section>
  );
}
