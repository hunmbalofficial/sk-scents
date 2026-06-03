const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const seedAdmin = async () => {
  try {
    const existing = await Admin.findOne({ email: 'admin@sk-scents.com' });
    if (!existing) {
      await Admin.create({
        name: 'Admin',
        email: 'admin@sk-scents.com',
        password: 'admin123',
      });
      console.log('Default admin created: admin@sk-scents.com / admin123');
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

module.exports = { loginAdmin, seedAdmin };
