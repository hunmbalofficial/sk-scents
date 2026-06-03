const express = require('express');
const router = express.Router();
const { getTestimonials, getTestimonialById, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getTestimonials)
  .post(protect, createTestimonial);

router.route('/:id')
  .get(getTestimonialById)
  .put(protect, updateTestimonial)
  .delete(protect, deleteTestimonial);

module.exports = router;
