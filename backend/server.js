const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
const { seedAdmin } = require('./controllers/authController');
const { seedTestimonials } = require('./controllers/testimonialController');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const dashboardRoutes = require('./routes/dashboard');
const testimonialRoutes = require('./routes/testimonials');
const settingRoutes = require('./routes/settings');
const faqRoutes = require('./routes/faqs');
const complaintRoutes = require('./routes/complaints');
const maintenanceMode = require('./middleware/maintenance');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
if (process.env.VERCEL !== '1') app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/settings', settingRoutes);
app.use(maintenanceMode);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/complaints', complaintRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SK SCENTS API running' });
});

const isVercel = process.env.VERCEL === '1';

if (!isVercel) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    seedAdmin();
    seedTestimonials();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

module.exports = app;
