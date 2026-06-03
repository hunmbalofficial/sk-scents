import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import { ShoppingCart, DollarSign, Package, Clock } from 'lucide-react';
import { formatPrice } from '../lib/utils';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-white">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="luxury-card rounded-xl p-6">
            <div className="h-4 w-20 skeleton rounded mb-3" />
            <div className="h-8 w-16 skeleton rounded" />
          </div>
        ))}
      </div>
    </div>
  );

  const cards = [
    { icon: ShoppingCart, label: 'Total Orders', value: stats?.totalOrders || 0, color: 'text-blue-400' },
    { icon: DollarSign, label: 'Revenue', value: formatPrice(stats?.totalRevenue || 0), color: 'text-green-400' },
    { icon: Package, label: 'Products', value: stats?.totalProducts || 0, color: 'text-luxury-gold' },
    { icon: Clock, label: 'Pending', value: stats?.pendingOrders || 0, color: 'text-amber-400' },
  ];

  const statusColors = {
    Pending: 'text-amber-400 bg-amber-400/10',
    Confirmed: 'text-blue-400 bg-blue-400/10',
    Shipped: 'text-purple-400 bg-purple-400/10',
    Delivered: 'text-green-400 bg-green-400/10',
    Cancelled: 'text-red-400 bg-red-400/10',
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-white">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="luxury-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-luxury-gray text-sm">{card.label}</p>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className={`text-2xl font-display ${card.color}`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="luxury-card rounded-xl p-6">
          <h2 className="font-display text-lg text-white mb-4">Order Status Overview</h2>
          <div className="space-y-3">
            {[
              { label: 'Pending', count: stats?.pendingOrders || 0, color: 'bg-amber-400' },
              { label: 'Shipped', count: stats?.shippedOrders || 0, color: 'bg-purple-400' },
              { label: 'Delivered', count: stats?.deliveredOrders || 0, color: 'bg-green-400' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-sm text-luxury-gray flex-1">{item.label}</span>
                <span className="text-sm text-white font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="luxury-card rounded-xl p-6">
          <h2 className="font-display text-lg text-white mb-4">Recent Orders</h2>
          {stats?.recentOrders?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between py-2 border-b border-luxury-gold/5 last:border-0">
                  <div>
                    <p className="text-sm text-white">{order.orderId}</p>
                    <p className="text-xs text-luxury-gray">{order.guestInfo?.fullName}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-medium ${statusColors[order.status] || 'text-luxury-gray bg-luxury-gray/10'}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-luxury-gray">No orders yet</p>
          )}
        </div>
      </div>

      {stats?.ordersByMonth?.length > 0 && (
        <div className="luxury-card rounded-xl p-6">
          <h2 className="font-display text-lg text-white mb-4">Monthly Revenue</h2>
          <div className="flex items-end gap-3 h-32">
            {stats.ordersByMonth.slice().reverse().map((m, i) => {
              const maxRevenue = Math.max(...stats.ordersByMonth.map((o) => o.revenue));
              const height = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-luxury-gray">${(m.revenue / 1000).toFixed(0)}k</span>
                  <div className="w-full bg-luxury-gold/20 rounded-t relative" style={{ height: `${Math.max(height, 5)}%` }}>
                    <div className="absolute bottom-0 left-0 right-0 bg-luxury-gold rounded-t" style={{ height: `${height}%` }} />
                  </div>
                  <span className="text-[10px] text-luxury-gray">{months[m._id.month - 1]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
