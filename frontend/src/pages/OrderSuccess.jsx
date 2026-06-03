import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, CreditCard, Banknote, Smartphone } from 'lucide-react';
import gsap from 'gsap';
import { orderService } from '../services/api';
import { formatPrice } from '../lib/utils';
import Loader from '../components/Loader';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    orderService.getById(id)
      .then((res) => setOrder(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (order && containerRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(containerRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' })
        .fromTo(containerRef.current.querySelector('.check-icon'), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.4')
        .fromTo(containerRef.current.querySelectorAll('.reveal-item'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.3');
    }
  }, [order]);

  if (loading) return <Loader />;
  if (!order) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <p className="text-luxury-gray text-lg">Order not found</p>
        <Link to="/" className="text-luxury-gold hover:underline mt-2 inline-block">Go Home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-luxury-black pt-24 pb-16 flex items-center justify-center">
      <div ref={containerRef} className="max-w-lg mx-auto px-4 w-full">
        <div className="luxury-card rounded-2xl p-8 sm:p-12 text-center">
          <div className="check-icon w-20 h-20 rounded-full bg-luxury-gold/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-luxury-gold" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-white mb-2 reveal-item">Order Successful!</h1>
          <p className="text-luxury-gray mb-8 reveal-item">Thank you for your purchase. Your order has been placed.</p>

          <div className="bg-luxury-black rounded-xl p-6 mb-8 reveal-item">
            <div className="flex justify-between items-center mb-4">
              <span className="text-luxury-gray text-sm">Order ID</span>
              <span className="text-luxury-gold font-mono text-sm font-medium">{order.orderId}</span>
            </div>

            <div className="flex justify-between items-center mb-4 border-t border-luxury-gold/10 pt-4">
              <span className="text-luxury-gray text-sm">Payment</span>
              <span className="flex items-center gap-2 text-sm">
                {order.paymentMethod === 'card' ? (
                  <><CreditCard className="w-4 h-4 text-luxury-gold" /> Card <span className="text-luxury-gray">(•••• {order.cardInfo?.lastFour})</span></>
                ) : order.paymentMethod === 'easypaisa' || order.paymentMethod === 'jazzcash' ? (
                  <><Smartphone className="w-4 h-4 text-luxury-gold" /> {order.mobilePaymentInfo?.provider || (order.paymentMethod === 'easypaisa' ? 'Easypaisa' : 'JazzCash')}</>
                ) : (
                  <><Banknote className="w-4 h-4 text-luxury-gold" /> Cash on Delivery</>
                )}
              </span>
            </div>
            {(order.paymentMethod === 'easypaisa' || order.paymentMethod === 'jazzcash') && order.mobilePaymentInfo?.transactionId && (
              <div className="flex justify-between items-center mb-4 border-t border-luxury-gold/10 pt-3">
                <span className="text-luxury-gray text-sm">Txn ID</span>
                <span className="text-white text-sm font-mono">{order.mobilePaymentInfo.transactionId}</span>
              </div>
            )}

            <div className="border-t border-luxury-gold/10 pt-4 space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-luxury-gray">{item.name} × {item.quantity}</span>
                  <span className="text-white">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-luxury-gold/10 pt-3 mt-3 flex justify-between">
              <span className="text-white font-medium">Total</span>
              <span className="text-luxury-gold font-display text-lg">{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="space-y-3 reveal-item">
            <Link to="/shop" className="btn-primary w-full py-3.5 rounded-lg text-sm tracking-wider uppercase flex items-center justify-center gap-2">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/" className="block text-luxury-gray hover:text-luxury-gold text-sm transition-colors">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
