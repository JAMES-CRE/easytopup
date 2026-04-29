/*const cloudinary = require('cloudinary').v2;
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

module.exports = { cloudinary, upload };*/

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Log config for debugging
console.log('Cloudinary config check:');
console.log('- Cloud name:', process.env.CLOUDINARY_CLOUD_NAME ? '✅' : '❌');
console.log('- API Key:', process.env.CLOUDINARY_API_KEY ? '✅' : '❌');
console.log('- API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅' : '❌');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Simple storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'report_photos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { cloudinary, upload };