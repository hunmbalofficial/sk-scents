const connectDB = require('../config/db');
const { seedAdmin } = require('../controllers/authController');
const { seedTestimonials } = require('../controllers/testimonialController');
const app = require('../server');

let ready = false;

async function handler(req, res) {
  if (!ready) {
    try {
      await connectDB();
      await seedAdmin();
      await seedTestimonials();
      ready = true;
    } catch (e) {
      console.error('Init error:', e.message);
      return res.status(500).json({ message: 'Init failed', error: e.message });
    }
  }
  return app(req, res);
}

module.exports = handler;
