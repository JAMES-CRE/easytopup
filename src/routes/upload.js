const express = require('express');
const router = express.Router();
const { protect, operatorOnly } = require('../middleware/authMiddleware');
const { upload, cloudinary } = require('../config/cloudinary');

// POST /api/upload - Upload station photos (max 4)
router.post('/', protect, operatorOnly, upload.array('photos', 4), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one photo',
      });
    }

    const photoUrls = req.files.map(file => file.path);
    
    res.status(200).json({
      success: true,
      data: photoUrls,
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to upload photos',
    });
  }
});

// DELETE /api/upload - Delete a photo from Cloudinary
router.delete('/', protect, operatorOnly, async (req, res) => {
  try {
    const { publicId } = req.body;
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide public_id',
      });
    }
    
    await cloudinary.uploader.destroy(publicId);
    
    res.status(200).json({
      success: true,
      message: 'Photo deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete photo',
    });
  }
});

module.exports = router;