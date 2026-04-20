 const express = require('express');
const router = express.Router();
const { submitReport, getStationReports } = require('../controllers/reportsController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitReport);
router.get('/:stationId', getStationReports);

module.exports = router;
