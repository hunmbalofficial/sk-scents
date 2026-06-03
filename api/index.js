const connectDB = require('../backend/config/db');
const { seedAdmin } = require('../backend/controllers/authController');
const { seedTestimonials } = require('../backend/controllers/testimonialController');

const app = require('../backend/server');

let initialized = false;

async function handler(req, res) {
  if (!initialized) {
    try {
      await connectDB();
      await seedAdmin();
      await seedTestimonials();
    } catch (e) {
      console.error('Init error:', e.message);
    }
    initialized = true;
  }
  return app(req, res);
}

module.exports = handler;
