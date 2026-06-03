import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, LogOut, Menu, X, MessageSquare, FlaskRound, HelpCircle } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const admin = localStorage.getItem('adminInfo');
    if (!admin) navigate('/admin/login');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const links = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/admin/testimonials', icon: MessageSquare, label: 'Testimonials' },
    { href: '/admin/testers', icon: FlaskRound, label: 'Testers' },
    { href: '/admin/faq', icon: HelpCircle, label: 'Help / FAQ' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-luxury-black flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-luxury-card border-r border-luxury-gold/10 transform transition-transform duration-300 lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-luxury-gold/10">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-display text-xl text-luxury-gold">SK</span>
              <span className="font-display text-sm text-white/60 ml-1">Admin</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-luxury-gray"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/admin'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20'
                      : 'text-luxury-gray hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-luxury-gold/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-luxury-gray hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-luxury-black/80 backdrop-blur-xl border-b border-luxury-gold/10 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-luxury-gray">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <a href="/" className="text-xs text-luxury-gray hover:text-luxury-gold transition-colors">View Store</a>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
