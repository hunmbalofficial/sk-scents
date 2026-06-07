'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, CreditCard, Banknote, Check, Smartphone } from 'lucide-react';
import gsap from 'gsap';
import { useCartStore, useCartSubtotal } from '@/lib/store/useCartStore';
import { orderService } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/Toaster';

const paymentOptions = [
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: Banknote },
  { id: 'easypaisa', label: 'Easypaisa', desc: 'Pay via Easypaisa', icon: Smartphone },
  { id: 'jazzcash', label: 'JazzCash', desc: 'Pay via JazzCash', icon: Smartphone },
  { id: 'card', label: 'Card Payment', desc: 'Visa, Mastercard, etc.', icon: CreditCard },
];

export default function CheckoutContent() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const subtotal = useCartSubtotal();
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [form, setForm] = useState({ fullName: '', phoneNumber: '', city: '', address: '', notes: '' });
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [mobilePayment, setMobilePayment] = useState({ accountNumber: '', transactionId: '' });

  useEffect(() => {
    if (formRef.current) gsap.fromTo(formRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
  }, []);

  if (items.length === 0) { router.push('/cart'); return null; }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.phoneNumber.trim()) errs.phoneNumber = 'Phone number is required';
    else if (!/^[\d\s+\-()]{7,15}$/.test(form.phoneNumber)) errs.phoneNumber = 'Invalid phone number';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (paymentMethod === 'card') {
      const cleanNum = card.number.replace(/\s/g, '');
      if (!/^\d{13,19}$/.test(cleanNum)) errs.cardNumber = 'Invalid card number';
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) errs.expiry = 'Invalid expiry (MM/YY)';
      if (!/^\d{3,4}$/.test(card.cvc)) errs.cvc = 'Invalid CVC';
      if (!card.name.trim()) errs.cardName = 'Cardholder name is required';
    }
    if (paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') {
      if (!mobilePayment.accountNumber.trim()) errs.accountNumber = 'Account number is required';
      else if (!/^03\d{9}$/.test(mobilePayment.accountNumber.replace(/\s/g, ''))) errs.accountNumber = 'Invalid Pakistani mobile number';
      if (!mobilePayment.transactionId.trim()) errs.transactionId = 'Transaction ID is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'number') setCard((prev) => ({ ...prev, number: formatCardNumber(value) }));
    else if (name === 'expiry') {
      const cleaned = value.replace(/[^\d/]/g, '').slice(0, 5);
      setCard((prev) => ({ ...prev, expiry: cleaned.length === 2 && !cleaned.includes('/') ? cleaned + '/' : cleaned }));
    } else if (name === 'cvc') setCard((prev) => ({ ...prev, cvc: value.replace(/\D/g, '').slice(0, 4) }));
    else setCard((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'accountNumber') setMobilePayment((prev) => ({ ...prev, accountNumber: value.replace(/\D/g, '').slice(0, 11) }));
    else setMobilePayment((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const orderData: Record<string, any> = {
        items: items.map((item) => ({ product: item.product, quantity: item.quantity })),
        guestInfo: form,
        paymentMethod,
        cardInfo: paymentMethod === 'card' ? {
          lastFour: card.number.replace(/\s/g, '').slice(-4),
          brand: card.number.startsWith('4') ? 'Visa' : card.number.startsWith('5') ? 'Mastercard' : 'Card',
        } : undefined,
        mobilePaymentInfo: ['easypaisa', 'jazzcash'].includes(paymentMethod) ? { ...mobilePayment, provider: paymentMethod === 'easypaisa' ? 'Easypaisa' : 'JazzCash' } : undefined,
      };
      const res = await orderService.create(orderData);
      clearCart();
      router.push(`/order-success/${res.data._id}`);
    } catch (err: any) {
      addToast(err?.response?.data?.message || 'Failed to place order', 'error');
    } finally { setSubmitting(false); }
  };

  const paymentLabel: Record<string, string> = { cod: 'Cash on Delivery', card: 'Card Payment', easypaisa: 'Easypaisa', jazzcash: 'JazzCash' };

  return (
    <div className="min-h-screen bg-luxury-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8"><Link href="/cart" className="inline-flex items-center gap-2 text-luxury-gray hover:text-luxury-gold text-sm transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Cart</Link></div>
        <h1 className="font-display text-4xl text-white mb-10">Checkout</h1>

        <form ref={formRef} onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="luxury-card rounded-xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 rounded-full bg-luxury-gold text-luxury-black flex items-center justify-center text-sm font-bold">1</div><h2 className="font-display text-xl text-white">Guest Information</h2></div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-luxury-gray mb-1.5">Full Name *</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} className="input-luxury w-full rounded-lg px-4 py-3 text-sm" placeholder="John Doe" />
                  {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-luxury-gray mb-1.5">Phone Number *</label>
                    <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="input-luxury w-full rounded-lg px-4 py-3 text-sm" placeholder="03XX-XXXXXXX" />
                    {errors.phoneNumber && <p className="text-red-400 text-xs mt-1">{errors.phoneNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-luxury-gray mb-1.5">City *</label>
                    <input name="city" value={form.city} onChange={handleChange} className="input-luxury w-full rounded-lg px-4 py-3 text-sm" placeholder="Karachi" />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-luxury-gray mb-1.5">Address *</label>
                  <textarea name="address" value={form.address} onChange={handleChange} className="input-luxury w-full rounded-lg px-4 py-3 text-sm min-h-[80px]" placeholder="House #, Street, Area" />
                  {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm text-luxury-gray mb-1.5">Notes <span className="text-luxury-gray-dark">(optional)</span></label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} className="input-luxury w-full rounded-lg px-4 py-3 text-sm min-h-[80px]" placeholder="Delivery instructions, etc." />
                </div>
              </div>
            </div>

            <div className="luxury-card rounded-xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 rounded-full bg-luxury-gold text-luxury-black flex items-center justify-center text-sm font-bold">2</div><h2 className="font-display text-xl text-white">Payment Method</h2></div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {paymentOptions.map((opt) => {
                  const Icon = opt.icon;
                  const selected = paymentMethod === opt.id;
                  return (
                    <button key={opt.id} type="button" onClick={() => setPaymentMethod(opt.id)}
                      className={`relative p-5 rounded-xl border-2 text-left transition-all ${selected ? 'border-luxury-gold bg-luxury-gold/5' : 'border-luxury-gold/10 bg-luxury-card hover:border-luxury-gold/30'}`}>
                      {selected && <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-luxury-gold flex items-center justify-center"><Check className="w-3 h-3 text-luxury-black" /></div>}
                      <Icon className={`w-8 h-8 mb-3 ${selected ? 'text-luxury-gold' : 'text-luxury-gray'}`} />
                      <p className={`font-medium text-sm ${selected ? 'text-white' : 'text-luxury-gray'}`}>{opt.label}</p>
                      <p className="text-xs text-luxury-gray mt-1">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
              {paymentMethod === 'card' && (
                <div className="space-y-4 border-t border-luxury-gold/10 pt-6">
                  <div><label className="block text-sm text-luxury-gray mb-1.5">Card Number *</label><input name="number" value={card.number} onChange={handleCardChange} className="input-luxury w-full rounded-lg px-4 py-3 text-sm" placeholder="4242 4242 4242 4242" />{errors.cardNumber && <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>}</div>
                  <div><label className="block text-sm text-luxury-gray mb-1.5">Cardholder Name *</label><input name="name" value={card.name} onChange={handleCardChange} className="input-luxury w-full rounded-lg px-4 py-3 text-sm" placeholder="John Doe" />{errors.cardName && <p className="text-red-400 text-xs mt-1">{errors.cardName}</p>}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm text-luxury-gray mb-1.5">Expiry Date *</label><input name="expiry" value={card.expiry} onChange={handleCardChange} className="input-luxury w-full rounded-lg px-4 py-3 text-sm" placeholder="MM/YY" />{errors.expiry && <p className="text-red-400 text-xs mt-1">{errors.expiry}</p>}</div>
                    <div><label className="block text-sm text-luxury-gray mb-1.5">CVC *</label><input name="cvc" value={card.cvc} onChange={handleCardChange} className="input-luxury w-full rounded-lg px-4 py-3 text-sm" placeholder="123" />{errors.cvc && <p className="text-red-400 text-xs mt-1">{errors.cvc}</p>}</div>
                  </div>
                </div>
              )}
              {(paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') && (
                <div className="space-y-4 border-t border-luxury-gold/10 pt-6">
                  <div className="bg-luxury-black/50 rounded-lg p-4 mb-4"><p className="text-sm text-luxury-gray">Send payment to <span className="text-luxury-gold font-medium">{paymentMethod === 'easypaisa' ? 'Easypaisa' : 'JazzCash'}</span> account:</p><p className="text-lg font-mono text-white mt-1">03XX-XXXXXXX</p><p className="text-xs text-luxury-gray mt-1">Then enter your details below</p></div>
                  <div><label className="block text-sm text-luxury-gray mb-1.5">Your {paymentMethod === 'easypaisa' ? 'Easypaisa' : 'JazzCash'} Account Number *</label><input name="accountNumber" value={mobilePayment.accountNumber} onChange={handleMobileChange} className="input-luxury w-full rounded-lg px-4 py-3 text-sm" placeholder="03XXXXXXXXX" />{errors.accountNumber && <p className="text-red-400 text-xs mt-1">{errors.accountNumber}</p>}</div>
                  <div><label className="block text-sm text-luxury-gray mb-1.5">Transaction ID *</label><input name="transactionId" value={mobilePayment.transactionId} onChange={handleMobileChange} className="input-luxury w-full rounded-lg px-4 py-3 text-sm" placeholder="Enter transaction/reference ID" />{errors.transactionId && <p className="text-red-400 text-xs mt-1">{errors.transactionId}</p>}</div>
                </div>
              )}
              <div className="mt-6">
                <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 rounded-lg text-sm tracking-wider uppercase flex items-center justify-center gap-2 disabled:opacity-70">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {submitting ? 'Processing...' : `Place Order - ${formatPrice(subtotal)}`}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="luxury-card rounded-xl p-6 sticky top-28">
              <h3 className="font-display text-lg text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.product} className="flex justify-between text-sm"><span className="text-luxury-gray truncate mr-4">{item.name} x {item.quantity}</span><span className="text-white whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span></div>
                ))}
              </div>
              <div className="border-t border-luxury-gold/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-luxury-gray">Subtotal</span><span className="text-white">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-luxury-gray">Shipping</span><span className="text-green-400">Free</span></div>
                <div className="flex justify-between text-sm"><span className="text-luxury-gray">Payment</span><span className="text-white capitalize">{paymentLabel[paymentMethod]}</span></div>
              </div>
              <div className="border-t border-luxury-gold/10 pt-3 mt-3 flex justify-between"><span className="text-white font-medium">Total</span><span className="text-luxury-gold font-display text-xl">{formatPrice(subtotal)}</span></div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
