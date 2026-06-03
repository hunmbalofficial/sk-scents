import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from './components/ui/Toaster';
import { WishlistProvider } from './context/WishlistContext';

import PublicLayout from './components/PublicLayout';

import AdminLogin from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import AdminProducts from './admin/Products';
import AdminOrders from './admin/Orders';
import AdminAnalytics from './admin/Analytics';
import AdminSettings from './admin/Settings';
import AdminTestimonials from './admin/Testimonials';
import AdminTesters from './admin/Testers';
import AdminHelp from './admin/Help';

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Toaster>
      <WishlistProvider>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="testers" element={<AdminTesters />} />
          <Route path="faq" element={<AdminHelp />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
      </WishlistProvider>
    </Toaster>
  );
}

export default App;
