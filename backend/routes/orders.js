const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(createOrder)
  .get(protect, getOrders);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/status')
  .put(protect, updateOrderStatus);

module.exports = router;
