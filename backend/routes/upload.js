const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadToCloudinary } = require('../config/cloudinary');

router.post('/image', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const folder = req.body.folder || 'sk-scents';
    const url = await uploadToCloudinary(req.file.buffer, folder);
    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;
