const express = require('express');
const router = express.Router();
const { getFaqs, createFaq, updateFaq, deleteFaq } = require('../controllers/faqController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getFaqs)
  .post(protect, createFaq);

router.route('/:id')
  .put(protect, updateFaq)
  .delete(protect, deleteFaq);

module.exports = router;
