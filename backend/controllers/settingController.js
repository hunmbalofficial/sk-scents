const SiteSetting = require('../models/SiteSetting');

const defaultSettings = {
  siteName: 'SK SCENTS',
  siteDescription: 'Luxury fragrances crafted for confidence, elegance and timeless identity.',
  adminEmail: 'admin@sk-scents.com',
  currency: 'PKR',
  taxRate: 0,
  shippingFee: 0,
  freeShippingThreshold: 200,
  enableNewsletter: true,
  maintenanceMode: false,
  easypaisaEnabled: true,
  jazzcashEnabled: true,
  cardEnabled: true,
  codEnabled: true,
  easypaisaNumber: '',
  jazzcashNumber: '',
  contactEmail: 'hello@sk-scents.com',
  contactEmail2: 'support@sk-scents.com',
  contactPhone: '+1 (555) 123-4567',
  contactPhone2: '+1 (555) 987-6543',
  contactAddress: 'SK SCENTS Headquarters, New York, NY 10001, USA',
  socialFacebook: '',
  socialInstagram: '',
  socialTwitter: '',
  socialYouTube: '',
  socialTikTok: '',
  socialLinkedin: '',
};

const getAllSettings = async (req, res) => {
  try {
    const settings = await SiteSetting.find();
    const result = { ...defaultSettings };
    settings.forEach((s) => { result[s.key] = s.value; });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    const results = await Promise.allSettled(
      Object.entries(updates).map(([key, value]) =>
        SiteSetting.findOneAndUpdate(
          { key },
          { $set: { key, value } },
          { upsert: true, new: true, runValidators: false }
        )
      )
    );
    const failed = results.filter((r) => r.status === 'rejected');
    if (failed.length > 0) {
      return res.status(500).json({ message: `Failed to save ${failed.length} setting(s)`, errors: failed.map((f) => f.reason?.message) });
    }
    res.json({ message: 'Settings saved', ...updates });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unexpected error' });
  }
};

const getMaintenanceMode = async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: 'maintenanceMode' });
    res.json({ maintenanceMode: setting ? setting.value : false });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllSettings, updateSettings, getMaintenanceMode };
