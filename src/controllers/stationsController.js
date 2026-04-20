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

module.exports = {
  getAllStations,
  getStationById,
  addStation,
  updatePrice,
  updateStatus,
  approveStation,
};
