'use client';

import { useState, useEffect } from 'react';
import { orderService } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/Toaster';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';

const statusColors: Record<string, string> = {
  Pending: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Confirmed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Shipped: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  Delivered: 'text-green-400 bg-green-400/10 border-green-400/20',
  Cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const paymentLabels: Record<string, string> = { cod: 'COD', card: 'Card', easypaisa: 'Easypaisa', jazzcash: 'JazzCash' };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { addToast } = useToast();

  useEffect(() => { loadOrders(); }, [statusFilter]);

  const loadOrders = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (statusFilter) params.status = statusFilter;
    orderService.getAll(params).then((res) => setOrders(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await orderService.updateStatus(id, newStatus);
      addToast(`Order status updated to ${newStatus}`, 'success');
      loadOrders();
      if (selectedOrder?._id === id) setSelectedOrder((prev: any) => prev ? { ...prev, status: newStatus } : prev);
    } catch { addToast('Failed to update status', 'error'); }
  };

  const statuses = ['', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-white">Orders</h1>
        <div className="hidden sm:flex gap-2">
          {statuses.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs tracking-wider uppercase transition-all ${statusFilter === s ? 'bg-luxury-gold text-luxury-black' : 'bg-luxury-card text-luxury-gray hover:text-white border border-luxury-gold/10'}`}>{s || 'All'}</button>
          ))}
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:hidden input-luxury rounded-lg px-3 py-2 text-xs">
          {statuses.map((s) => (<option key={s} value={s}>{s || 'All'}</option>))}
        </select>
      </div>

      <div className="luxury-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-luxury-gold/10">
              <th className="text-left text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Order ID</th>
              <th className="text-left text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Customer</th>
              <th className="text-left text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Payment</th>
              <th className="text-left text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Total</th>
              <th className="text-left text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Date</th>
              <th className="text-left text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-right text-xs text-luxury-gray uppercase tracking-wider px-4 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-luxury-gold/5"><td colSpan={7} className="px-4 py-4"><div className="h-4 skeleton rounded w-full" /></td></tr>
              )) : orders.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-luxury-gray text-sm">No orders found</td></tr>
              ) : orders.map((order) => (
                <tr key={order._id} className="border-b border-luxury-gold/5 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <td className="px-4 py-3"><span className="text-sm font-mono text-luxury-gold">{order.orderId}</span></td>
                  <td className="px-4 py-3"><div><p className="text-sm text-white">{order.guestInfo?.fullName}</p><p className="text-xs text-luxury-gray">{order.guestInfo?.phoneNumber}</p></div></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {order.paymentMethod === 'card' ? <CreditCard className="w-3.5 h-3.5 text-luxury-gold" /> : order.paymentMethod === 'easypaisa' || order.paymentMethod === 'jazzcash' ? <Smartphone className="w-3.5 h-3.5 text-luxury-gold" /> : <Banknote className="w-3.5 h-3.5 text-luxury-gold" />}
                      <span className="text-sm text-luxury-gray">{paymentLabels[order.paymentMethod] || order.paymentMethod}</span>
                    </div>
                    <span className={`text-[10px] mt-1 inline-block px-1.5 py-0.5 rounded ${order.paymentStatus === 'Paid' ? 'text-green-400 bg-green-400/10' : 'text-amber-400 bg-amber-400/10'}`}>{order.paymentStatus}</span>
                  </td>
                  <td className="px-4 py-3"><span className="text-sm text-luxury-gold">{formatPrice(order.total)}</span></td>
                  <td className="px-4 py-3"><span className="text-sm text-luxury-gray">{new Date(order.createdAt).toLocaleDateString()}</span></td>
                  <td className="px-4 py-3"><span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-medium border ${statusColors[order.status] || 'text-luxury-gray bg-luxury-gray/10'}`}>{order.status}</span></td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className="input-luxury rounded-lg px-3 py-1.5 text-xs">
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-luxury-card rounded-2xl p-6 w-full max-w-lg border border-luxury-gold/10" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-lg text-white mb-4">Order {selectedOrder.orderId}</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-luxury-gray">Customer</span><span className="text-white">{selectedOrder.guestInfo?.fullName}</span></div>
              <div className="flex justify-between"><span className="text-luxury-gray">Phone</span><span className="text-white">{selectedOrder.guestInfo?.phoneNumber}</span></div>
              <div className="flex justify-between"><span className="text-luxury-gray">Address</span><span className="text-white text-right max-w-[200px]">{selectedOrder.guestInfo?.address}, {selectedOrder.guestInfo?.city}</span></div>
              {selectedOrder.guestInfo?.notes && <div className="flex justify-between"><span className="text-luxury-gray">Notes</span><span className="text-white">{selectedOrder.guestInfo.notes}</span></div>}
              <div className="border-t border-luxury-gold/10 pt-3 mt-3">
                {selectedOrder.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between py-1"><span className="text-luxury-gray">{item.name} x {item.quantity}</span><span className="text-white">{formatPrice(item.price * item.quantity)}</span></div>
                ))}
              </div>
              <div className="border-t border-luxury-gold/10 pt-3 flex justify-between"><span className="text-white font-medium">Total</span><span className="text-luxury-gold font-display">{formatPrice(selectedOrder.total)}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
