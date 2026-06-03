import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import api from '../services/api';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Wishlist from '../pages/Wishlist';
import Checkout from '../pages/Checkout';
import OrderSuccess from '../pages/OrderSuccess';
import Testers from '../pages/Testers';
import Help from '../pages/Help';
import Maintenance from '../pages/Maintenance';

const PublicLayout = () => {
  const [maintenance, setMaintenance] = useState(false);
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) { setChecking(false); return; }
    api.get('/settings/maintenance')
      .then((res) => setMaintenance(res.data.maintenanceMode))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [location.pathname]);

  if (checking) return null;
  if (maintenance) return <Maintenance />;

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/testers" element={<Testers />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
