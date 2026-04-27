const pool = require('../config/db');

//GET ALL STATIONS
const getAllStations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM stations
       WHERE verified = true
       ORDER BY name ASC`
    );

    const stations = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type,
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
      status: row.status,
      price: row.price,
      phone: row.phone,
      whatsapp: row.whatsapp,
      octane: row.octane,
      connector: row.connector,
      power_output: row.power_output,
      lpg_type: row.lpg_type,
    }));

    res.status(200).json({
      success: true,
      count: stations.length,
      data: stations,
    });

  } catch (error) {
    console.error('Get stations error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stations',
    });
  }
};

//GET SINGLE STATION 
const getStationById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM stations WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Station not found',
      });
    }

    const row = result.rows[0];
    res.status(200).json({
      success: true,
      data: {
        id: row.id,
        name: row.name,
        type: row.type,
        lat: parseFloat(row.lat),
        lng: parseFloat(row.lng),
        status: row.status,
        price: row.price,
        phone: row.phone,
        whatsapp: row.whatsapp,
        octane: row.octane,
        connector: row.connector,
        power_output: row.power_output,
        lpg_type: row.lpg_type,
      },
    });

  } catch (error) {
    console.error('Get station error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch station',
    });
  }
};

//  Add station which is performed by operators
const addStation = async (req, res) => {
  try {
    const {
      id, name, type, lat, lng,
      price, phone, whatsapp,
      octane, connector, power_output, lpg_type,
    } = req.body;

    if (!name || !type || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, type, lat and lng',
      });
    }

    // verification, we the admin must approve
    await pool.query(
      `INSERT INTO stations
        (id, name, type, lat, lng, price, phone, whatsapp,
         octane, connector, power_output, lpg_type,
         operator_id, verified, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,false,'Open')`,
      [
        id || `station_${Date.now()}`,
        name, type, lat, lng,
        price, phone, whatsapp,
        octane, connector, power_output,
        lpg_type ? JSON.stringify(lpg_type) : null,
        req.user.id,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Station submitted for approval',
    });

  } catch (error) {
    console.error('Add station error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Station addition failed',
    });
  }
};

//UPDATE PRICE (operator)
const updatePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    if (!price) {
      return res.status(400).json({
        success: false,
        message: 'Please input new price',
      });
    }

    // Make sure operator owns this station
    const station = await pool.query(
      'SELECT * FROM stations WHERE id = $1',
      [id]
    );

    if (station.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Station not found',
      });
    }

    // Admin can update any station
    // Operator can only update their own
    if (
      req.user.role !== 'admin' &&
      station.rows[0].operator_id !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this station',
      });
    }

    // Save old price to history
    await pool.query(
      `INSERT INTO price_history
        (station_id, operator_id, old_price, new_price)
       VALUES ($1, $2, $3, $4)`,
      [id, req.user.id, station.rows[0].price, price]
    );

    // Update price
    await pool.query(
      'UPDATE stations SET price = $1 WHERE id = $2',
      [price, id]
    );

    res.status(200).json({
      success: true,
      message: 'Price updated',
    });

  } catch (error) {
    console.error('Update price error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Could not update price',
    });
  }
};

//UPDATE STATUS (operator)
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status',
      });
    }

    const station = await pool.query(
      'SELECT * FROM stations WHERE id = $1',
      [id]
    );

    if (station.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Station not found',
      });
    }

    if (
      req.user.role !== 'admin' &&
      station.rows[0].operator_id !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this station',
      });
    }

    await pool.query(
      'UPDATE stations SET status = $1 WHERE id = $2',
      [status, id]
    );

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
    });

  } catch (error) {
    console.error('Update status error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
    });
  }
};

// APPROVE STATION (admin only)
const approveStation = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'UPDATE stations SET verified = true WHERE id = $1',
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Station Approved',
    });

  } catch (error) {
    console.error('Approve station error:', error.message);
    res.status(500).json({
      success: false,
      message: 'We did not approve station',
    });
  }
};


/// ── UPDATE POWER OUTPUT (operator) ──
// PUT /api/stations/:id/power
const updatePowerOutput = async (req, res) => {
  try {
    const { id } = req.params;
    const { power_output } = req.body;

    if (!power_output) {
      return res.status(400).json({
        success: false,
        message: 'Please provide power_output',
      });
    }

    const station = await pool.query(
      'SELECT * FROM stations WHERE id = $1',
      [id]
    );

    if (station.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Station not found',
      });
    }

    if (
      req.user.role !== 'admin' &&
      station.rows[0].operator_id !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this station',
      });
    }

    await pool.query(
      'UPDATE stations SET power_output = $1 WHERE id = $2',
      [power_output, id]
    );

    res.status(200).json({
      success: true,
      message: 'Power output updated successfully',
    });

  } catch (error) {
    console.error('Update power output error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update power output',
    });
  }
};



// ── GET ALL PENDING STATIONS (admin) ──
// GET /api/admin/stations/pending
const getPendingStations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.name as operator_name, u.email as operator_email
       FROM stations s
       LEFT JOIN users u ON s.operator_id = u.id
       WHERE s.verified = false
       ORDER BY s.created_at DESC`
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error) {
    console.error('Get pending stations error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending stations',
    });
  }
};

// ── GET ALL STATIONS (admin) ──
// GET /api/admin/stations
const getAllStationsAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.name as operator_name
       FROM stations s
       LEFT JOIN users u ON s.operator_id = u.id
       ORDER BY s.created_at DESC`
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error) {
    console.error('Get all stations error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stations',
    });
  }
};

// ── REJECT/DELETE STATION (admin) ──
// DELETE /api/admin/stations/:id
const rejectStation = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM stations WHERE id = $1', [id]);

    res.status(200).json({
      success: true,
      message: 'Station rejected and removed',
    });

  } catch (error) {
    console.error('Reject station error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to reject station',
    });
  }
};

// ── GET ALL REPORTS (admin) ──
// GET /api/admin/reports
const getAllReports = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, 
              u.name as user_name,
              s.name as station_name,
              s.type as station_type
       FROM reports r
       JOIN users u ON r.user_id = u.id
       JOIN stations s ON r.station_id = s.id
       ORDER BY r.created_at DESC`
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error) {
    console.error('Get all reports error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
    });
  }
};

// ── GET OPERATOR'S OWN STATION ──
const getMyStation = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT s.*, 
              CASE WHEN s.verified = true THEN false ELSE true END as pending
       FROM stations s
       WHERE s.operator_id = $1
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [req.user.id]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No station found for this operator',
      });
    }

    const row = result.rows[0];
    res.status(200).json({
      success: true,
      data: {
        id: row.id,
        name: row.name,
        type: row.type,
        lat: parseFloat(row.lat),
        lng: parseFloat(row.lng),
        status: row.status,
        price: row.price,
        phone: row.phone,
        whatsapp: row.whatsapp,
        octane: row.octane,
        connector: row.connector,
        power_output: row.power_output,
        lpg_type: row.lpg_type,
        verified: row.verified,
        pending: row.verified === false,
        
      },
    });

  } catch (error) {
    console.error('Get my station error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch station',
    });
  }
};



module.exports = {
  getAllStations,
  getStationById,
  addStation,
  updatePrice,
  updateStatus,
  updatePowerOutput,
  approveStation,
  getPendingStations,      // ← ADD THIS
  getAllStationsAdmin,     // ← ADD THIS
  rejectStation,           // ← ADD THIS
  getAllReports,
  getMyStation,              // ← ADD THIS
};



