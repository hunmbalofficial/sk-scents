const SiteSetting = require('../models/SiteSetting');

const maintenanceMode = async (req, res, next) => {
  if (req.path.startsWith('/api/auth') || req.path.startsWith('/api/settings/maintenance')) {
    return next();
  }

  const setting = await SiteSetting.findOne({ key: 'maintenanceMode' });
  if (setting && setting.value === true) {
    return res.status(503).json({ message: 'Site is under maintenance. Please check back later.' });
  }
  next();
};

module.exports = maintenanceMode;
