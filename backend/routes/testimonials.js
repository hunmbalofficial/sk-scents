const express = require('express');
const router = express.Router();
const { getTestimonials, getTestimonialById, createTestimonial, updateTestimonial, deleteTestimonial, bulkDeleteTestimonials, bulkUpdateTestimonials, reorderTestimonials } = require('../controllers/testimonialController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getTestimonials)
  .post(protect, createTestimonial);

router.post('/bulk-delete', protect, bulkDeleteTestimonials);
router.post('/bulk-update', protect, bulkUpdateTestimonials);
router.post('/reorder', protect, reorderTestimonials);

router.route('/:id')
  .get(getTestimonialById)
  .put(protect, updateTestimonial)
  .delete(protect, deleteTestimonial);

module.exports = router;
