'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { settingService } from '@/lib/api';

export default function Footer() {
  const [s, setS] = useState<Record<string, string>>({});

  useEffect(() => {
    settingService.getAll().then((res) => setS(res.data)).catch(() => {});
  }, []);

  return (
    <footer className="bg-luxury-card border-t border-luxury-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="font-display text-2xl text-luxury-gold">SK</span>{' '}
              <span className="font-display text-lg text-white/80">SCENTS</span>
            </Link>
            <p className="text-sm text-luxury-gray leading-relaxed">
              Luxury fragrances crafted for confidence, elegance and timeless identity. Discover your signature scent.
            </p>
            <div className="flex gap-3 mt-6">
              {s.socialInstagram && (
                <a href={s.socialInstagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-luxury-gold/20 flex items-center justify-center text-luxury-gray hover:text-luxury-gold hover:border-luxury-gold transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {s.socialFacebook && (
                <a href={s.socialFacebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-luxury-gold/20 flex items-center justify-center text-luxury-gray hover:text-luxury-gold hover:border-luxury-gold transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {s.socialTwitter && (
                <a href={s.socialTwitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-luxury-gold/20 flex items-center justify-center text-luxury-gray hover:text-luxury-gold hover:border-luxury-gold transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg text-white mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { href: '/shop', label: 'Shop All' },
                { href: '/shop?gender=Men', label: 'Men' },
                { href: '/shop?gender=Women', label: 'Women' },
                { href: '/shop?gender=Unisex', label: 'Unisex' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-luxury-gray hover:text-luxury-gold transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg text-white mb-4">Support</h4>
            <div className="flex flex-col gap-2">
              {[
                { href: '#', label: 'Shipping Info', key: 'shipping' },
                { href: '#', label: 'Returns', key: 'returns' },
                { href: '/help', label: 'FAQ', key: 'faq' },
              ].map((link) => (
                <Link key={link.key} href={link.href} className="text-sm text-luxury-gray hover:text-luxury-gold transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg text-white mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-luxury-gray">
                <Mail className="w-4 h-4 text-luxury-gold flex-shrink-0" />
                <span>{s.contactEmail || 'hello@sk-scents.com'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-luxury-gray">
                <Phone className="w-4 h-4 text-luxury-gold flex-shrink-0" />
                <span>{s.contactPhone || '+1 (555) 123-4567'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-luxury-gray">
                <MapPin className="w-4 h-4 text-luxury-gold flex-shrink-0" />
                <span>{s.contactAddress ? s.contactAddress.split(',')[0] : 'New York, USA'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-luxury-gold/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-luxury-gray">
            &copy; {new Date().getFullYear()} SK SCENTS. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-luxury-gray">
            <a href="#" className="hover:text-luxury-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-luxury-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
