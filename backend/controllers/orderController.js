const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  try {
    const { items, guestInfo, paymentMethod, cardInfo, mobilePaymentInfo, paymentScreenshot } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    if (!paymentMethod || !['cod', 'card', 'easypaisa', 'jazzcash'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const populatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      const price = product.discountPrice || product.price;
      populatedItems.push({
        product: product._id,
        name: product.name,
        price,
        quantity: item.quantity,
        image: product.images[0] || '',
      });
      subtotal += price * item.quantity;
    }

    const paidMethods = ['card', 'easypaisa', 'jazzcash'];
    const paymentStatus = paidMethods.includes(paymentMethod) ? 'Paid' : 'Pending';

    const order = await Order.create({
      items: populatedItems,
      guestInfo,
      paymentMethod,
      paymentStatus,
      cardInfo: paymentMethod === 'card' ? cardInfo : undefined,
      mobilePaymentInfo: ['easypaisa', 'jazzcash'].includes(paymentMethod) ? mobilePaymentInfo : undefined,
      paymentScreenshot: ['easypaisa', 'jazzcash'].includes(paymentMethod) ? (paymentScreenshot || '') : undefined,
      subtotal,
      total: subtotal,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
