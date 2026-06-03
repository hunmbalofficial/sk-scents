const Order = require('../models/Order');
const Product = require('../models/Product');

const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const shippedOrders = await Order.countDocuments({ status: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const ordersByMonth = await Order.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          count: { $sum: 1 },
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 },
    ]);

    res.json({
      totalOrders,
      totalRevenue,
      totalProducts,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      recentOrders,
      ordersByMonth,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDashboardStats };
