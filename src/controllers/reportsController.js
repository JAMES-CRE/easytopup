const pool = require('../config/db');

// SUBMIT REPORT
const submitReport = async (req, res) => {
  try {
    const { station_id, issue_type, extra_data, notes } = req.body;
    const user_id = req.user.id;

    if (!station_id || !issue_type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide station_id and issue_type',
      });
    }

    await pool.query(
      `INSERT INTO reports
        (station_id, user_id, issue_type, extra_data, notes, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [
        station_id,
        user_id,
        issue_type,
        JSON.stringify(extra_data || {}),
        notes || '',
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
    });

  } catch (error) {
    console.error('Submit report error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to submit report',
    });
  }
};

//GET REPORTS FOR A STATION 
const getStationReports = async (req, res) => {
  try {
    const { stationId } = req.params;

    const result = await pool.query(
      `SELECT r.*, u.name as user_name
       FROM reports r
       JOIN users u ON r.user_id = u.id
       WHERE r.station_id = $1
       ORDER BY r.created_at DESC
       LIMIT 1`,
      [stationId]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error('Get reports error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
    });
  }
};

module.exports = { submitReport, getStationReports }; 
