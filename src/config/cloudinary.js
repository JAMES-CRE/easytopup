const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Log config (for debugging)
console.log('Cloudinary config check:');
console.log('- Cloud name:', process.env.CLOUDINARY_CLOUD_NAME ? '✅' : '❌');
console.log('- API Key:', process.env.CLOUDINARY_API_KEY ? '✅' : '❌');
console.log('- API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅' : '❌');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Simple multer config (without CloudinaryStorage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { cloudinary, upload };