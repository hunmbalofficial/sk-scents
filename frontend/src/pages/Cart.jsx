import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';

const Cart = () => {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-black pt-24 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-luxury-gray mx-auto mb-4" />
          <h1 className="font-display text-3xl text-white mb-2">Your Cart is Empty</h1>
          <p className="text-luxury-gray mb-8">Explore our luxury fragrance collection</p>
          <Link to="/shop" className="btn-primary px-8 py-3 rounded-lg text-sm tracking-wider uppercase inline-block">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/shop" className="inline-flex items-center gap-2 text-luxury-gray hover:text-luxury-gold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        <h1 className="font-display text-4xl text-white mb-10">Shopping Cart ({itemCount})</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product} className="luxury-card rounded-xl p-4 sm:p-6 flex gap-4 sm:gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-luxury-black flex-shrink-0">
                  <img src={item.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200'} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product}`} className="font-display text-white hover:text-luxury-gold transition-colors block truncate">
                    {item.name}
                  </Link>
                  <p className="text-luxury-gold font-medium mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center bg-luxury-black rounded-lg border border-luxury-gold/20">
                      <button onClick={() => updateQuantity(item.product, item.quantity - 1)} className="px-3 py-1.5 text-luxury-gray hover:text-white transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 py-1.5 text-white text-sm min-w-[30px] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product, item.quantity + 1)} className="px-3 py-1.5 text-luxury-gray hover:text-white transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.product)} className="text-luxury-gray hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-white font-medium text-right whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="luxury-card rounded-xl p-6 sticky top-28">
              <h3 className="font-display text-xl text-white mb-6">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-luxury-gray">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-luxury-gray">
                  <span>Shipping</span>
                  <span className="text-white">Calculated at checkout</span>
                </div>
                <div className="border-t border-luxury-gold/10 pt-3 flex justify-between">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-luxury-gold font-display text-xl">{formatPrice(subtotal)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="btn-primary w-full py-3.5 rounded-lg text-sm tracking-wider uppercase flex items-center justify-center gap-2"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
