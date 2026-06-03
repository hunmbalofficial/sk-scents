const express = require('express');
const router = express.Router();
const { getAllSettings, updateSettings, getMaintenanceMode } = require('../controllers/settingController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getAllSettings)
  .put(protect, updateSettings);

router.get('/maintenance', getMaintenanceMode);

module.exports = router;
