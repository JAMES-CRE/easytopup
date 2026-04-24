const express = require('express');
const router = express.Router();
const {
  getPendingStations,
  getAllStationsAdmin,
  approveStation,
  rejectStation,
  getAllReports,
} = require('../controllers/stationsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes are protected and admin only
router.use(protect);
router.use(adminOnly);

// Stations
router.get('/stations', getAllStationsAdmin);
router.get('/stations/pending', getPendingStations);
router.put('/stations/:id/approve', approveStation);
router.delete('/stations/:id', rejectStation);

// Reports
router.get('/reports', getAllReports);

module.exports = router;