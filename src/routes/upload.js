const express = require('express');
const router = express.Router();
const { protect, operatorOnly } = require('../middleware/authMiddleware');
const { cloudinary, upload } = require('../config/cloudinary');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Upload route is working!' });
});

// POST upload - upload to Cloudinary from memory
router.post('/', protect, operatorOnly, upload.array('photos', 4), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Files count:', req.files?.length || 0);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one photo',
      });
    }

    const uploadPromises = req.files.map(async (file) => {
      // Upload to Cloudinary from memory buffer
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'station_photos',
            transformation: [{ width: 800, height: 600, crop: 'limit' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const photoUrls = await Promise.all(uploadPromises);
    
    console.log('Upload successful:', photoUrls.length, 'photos');
    
    res.status(200).json({
      success: true,
      data: photoUrls,
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload photos',
    });
  }
});

module.exports = router;