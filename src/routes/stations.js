 const express = require('express');
const router = express.Router();
const {
  getAllStations, getStationById,
  addStation, updatePrice,
  updateStatus, approveStation,
} = require('../controllers/stationsController');
const { protect, operatorOnly, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllStations);
router.get('/:id', getStationById);
router.post('/', protect, operatorOnly, addStation);
router.put('/:id/price', protect, operatorOnly, updatePrice);
router.put('/:id/status', protect, operatorOnly, updateStatus);
router.put('/:id/approve', protect, adminOnly, approveStation);

module.exports = router;
