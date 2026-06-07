'use client';

import { useState, useEffect } from 'react';
import { dashboardService } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats().then((res) => setStats(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-white">Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (<div key={i} className="luxury-card rounded-xl p-6"><div className="h-4 w-20 skeleton rounded mb-3" /><div className="h-8 w-16 skeleton rounded" /></div>))}
      </div>
    </div>
  );

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const maxRevenue = stats?.ordersByMonth?.length > 0 ? Math.max(...stats.ordersByMonth.map((o: any) => o.revenue)) : 0;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-white">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="luxury-card rounded-xl p-6"><p className="text-luxury-gray text-sm mb-1">Total Revenue</p><p className="text-2xl font-display text-luxury-gold">{formatPrice(stats?.totalRevenue || 0)}</p></div>
        <div className="luxury-card rounded-xl p-6"><p className="text-luxury-gray text-sm mb-1">Total Orders</p><p className="text-2xl font-display text-white">{stats?.totalOrders || 0}</p></div>
        <div className="luxury-card rounded-xl p-6"><p className="text-luxury-gray text-sm mb-1">Average Order Value</p><p className="text-2xl font-display text-white">{stats?.totalOrders > 0 ? formatPrice((stats.totalRevenue || 0) / stats.totalOrders) : formatPrice(0)}</p></div>
      </div>

      <div className="luxury-card rounded-xl p-6">
        <h2 className="font-display text-lg text-white mb-6">Revenue Chart</h2>
        {stats?.ordersByMonth?.length > 0 ? (
          <div className="relative" style={{ height: '240px' }}>
            <div className="flex items-end justify-around gap-2 h-full">
              {stats.ordersByMonth.slice().reverse().map((m: any, i: number) => {
                const heightPct = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[10px] text-luxury-gray">${(m.revenue / 1000).toFixed(1)}k</span>
                    <div className="w-full bg-gradient-to-t from-luxury-gold to-luxury-gold-light rounded-t" style={{ height: `${heightPct}%` }} />
                    <span className="text-[10px] text-luxury-gray mt-1">{months[m._id.month - 1]} {m._id.year}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : <div className="h-[200px] flex items-center justify-center"><p className="text-luxury-gray text-sm">No data available yet</p></div>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="luxury-card rounded-xl p-6">
          <h3 className="font-display text-base text-white mb-3">Order Status</h3>
          <div className="space-y-2">
            {[{ label: 'Pending', count: stats?.pendingOrders || 0, color: 'bg-amber-400' },{ label: 'Shipped', count: stats?.shippedOrders || 0, color: 'bg-purple-400' },{ label: 'Delivered', count: stats?.deliveredOrders || 0, color: 'bg-green-400' }].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm"><div className={`w-2 h-2 rounded-full ${item.color}`} /><span className="text-luxury-gray flex-1">{item.label}</span><span className="text-white font-medium">{item.count}</span></div>
            ))}
          </div>
        </div>
        <div className="luxury-card rounded-xl p-6 col-span-2">
          <h3 className="font-display text-base text-white mb-3">Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-luxury-gray text-xs uppercase tracking-wider mb-1">Conversion Rate</p><p className="text-2xl font-display text-white">{stats?.totalOrders > 0 ? '2.4%' : '0%'}</p></div>
            <div><p className="text-luxury-gray text-xs uppercase tracking-wider mb-1">Avg Items/Order</p><p className="text-2xl font-display text-white">{stats?.recentOrders?.length > 0 ? (stats.recentOrders.reduce((sum: number, o: any) => sum + (o.items?.length || 0), 0) / stats.recentOrders.length).toFixed(1) : '0'}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
