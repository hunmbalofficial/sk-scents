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
    } catch (e) {
      console.error('Init error:', e.message);
    }
    ready = true;
  }
  return app(req, res);
}

module.exports = handler;
