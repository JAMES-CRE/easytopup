const express = require('express');
const router = express.Router();
const { protect, operatorOnly } = require('../middleware/authMiddleware');
const { cloudinary, upload } = require('../config/cloudinary');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Upload route is working!' });
});




// POST /api/upload - Upload station photos or report photos
// ✅ Changed: Any authenticated user can upload (for reports)
router.post('/', protect, upload.array('photos', 4), async (req, res) => {
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



// POST /api/upload/profile - Upload profile photo
router.post('/profile', protect, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a photo',
      });
    }

    const photoUrl = req.file.path;
    
    res.status(200).json({
      success: true,
      data: photoUrl,
    });
  } catch (error) {
    console.error('Profile upload error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile photo',
    });
  }
});




// DELETE /api/upload - Delete a photo from Cloudinary
router.delete('/', protect, async (req, res) => {
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