const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, updateComplaint, deleteComplaint } = require('../controllers/complaintController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(createComplaint)
  .get(protect, getComplaints);

router.route('/:id')
  .put(protect, updateComplaint)
  .delete(protect, deleteComplaint);

module.exports = router;
