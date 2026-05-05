const pool = require('../config/db');

//GET ALL STATIONS
/*const getAllStations = async (req, res) => {
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
      photos: row.photos || [],
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
};*/

/*const getAllStations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM stations
       WHERE verified = true
       ORDER BY name ASC`
    );

    const stations = result.rows.map(row => {

 let lpgTypeArray = null;
      if (row.lpg_type) {
        if (typeof row.lpg_type === 'string') {
          // Remove curly braces: {Autogas,"Cylinder Refill"} -> Autogas,"Cylinder Refill"
          const cleaned = row.lpg_type.slice(1, -1);
          if (cleaned) {
            // Split by comma and clean quotes
            lpgTypeArray = cleaned.split(',').map(item => 
              item.replace(/^"(.*)"$/, '$1').trim()
            );
          }
        } else if (Array.isArray(row.lpg_type)) {
          lpgTypeArray = row.lpg_type;
        }
      }

      // Calculate LPG cylinder prices if applicable
      let cylinderPrices = null;
      if (row.type === 'LPG' && row.lpg_price_per_kg) {
        const pricePerKg = parseFloat(row.lpg_price_per_kg);
        cylinderPrices = {
          '3kg': `GH₵ ${(pricePerKg * 3).toFixed(2)}`,
          '6kg': `GH₵ ${(pricePerKg * 6).toFixed(2)}`,
          '11kg': `GH₵ ${(pricePerKg * 11).toFixed(2)}`,
          '14.5kg': `GH₵ ${(pricePerKg * 14.5).toFixed(2)}`,
          '15kg': `GH₵ ${(pricePerKg * 15).toFixed(2)}`,
          '50kg': `GH₵ ${(pricePerKg * 50).toFixed(2)}`,
        };
      }

      return {
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
        lpg_type: lpgTypeArray,
        photos: row.photos || [],
        // LPG specific fields
        lpg_price_per_kg: row.lpg_price_per_kg,
        delivery_available: row.delivery_available,
        cylinder_prices: cylinderPrices,
      };
    });

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
};*/

const getAllStations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM stations
       WHERE verified = true
       ORDER BY name ASC`
    );

    const stations = result.rows.map(row => {
      // Parse PostgreSQL array to JavaScript array for lpg_type
      let lpgTypeArray = null;
      if (row.lpg_type) {
        if (typeof row.lpg_type === 'string') {
          // Remove curly braces: {Autogas,"Cylinder Refill"} -> Autogas,"Cylinder Refill"
          const cleaned = row.lpg_type.slice(1, -1);
          if (cleaned) {
            // Split by comma and clean quotes
            lpgTypeArray = cleaned.split(',').map(item =>
              item.replace(/^"(.*)"$/, '$1').trim()
            );
          }
        } else if (Array.isArray(row.lpg_type)) {
          lpgTypeArray = row.lpg_type;
        }
      }

      // Calculate LPG cylinder prices if applicable
      /*let cylinderPrices = null;
      if (row.type === 'LPG' && row.lpg_price_per_kg) {
        const pricePerKg = parseFloat(row.lpg_price_per_kg);
        cylinderPrices = {
          '3kg': `GH₵ ${(pricePerKg * 3).toFixed(2)}`,
          '6kg': `GH₵ ${(pricePerKg * 6).toFixed(2)}`,
          '11kg': `GH₵ ${(pricePerKg * 11).toFixed(2)}`,
          '14.5kg': `GH₵ ${(pricePerKg * 14.5).toFixed(2)}`,
          '15kg': `GH₵ ${(pricePerKg * 15).toFixed(2)}`,
          '50kg': `GH₵ ${(pricePerKg * 50).toFixed(2)}`,
        };
      }*/
      // In getAllStations, inside the stations.map loop
      let cylinderPrices = null;
      if (row.type === 'LPG' && row.price) {
        // Extract numeric value from price string like "GH₵ 12.70/kg"
        const priceMatch = row.price.match(/[\d.]+/);
        if (priceMatch) {
          const pricePerKg = parseFloat(priceMatch[0]);
          cylinderPrices = {
            '3kg': `GH₵ ${(pricePerKg * 3).toFixed(2)}`,
            '6kg': `GH₵ ${(pricePerKg * 6).toFixed(2)}`,
            '11kg': `GH₵ ${(pricePerKg * 11).toFixed(2)}`,
            '14.5kg': `GH₵ ${(pricePerKg * 14.5).toFixed(2)}`,
            '15kg': `GH₵ ${(pricePerKg * 15).toFixed(2)}`,
            '50kg': `GH₵ ${(pricePerKg * 50).toFixed(2)}`,
          };
        }
      }


      return {
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
        lpg_type: lpgTypeArray,  // ← Use parsed array
        photos: row.photos || [],
        lpg_price_per_kg: row.lpg_price_per_kg,
        delivery_available: row.delivery_available,
        cylinder_prices: cylinderPrices,
        has_backup_generator: row.has_backup_generator === true,
      };
    });

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
/*const getStationById = async (req, res) => {
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
        photos: row.photos || [],
      },
    });

  } catch (error) {
    console.error('Get station error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch station',
    });
  }
};*/


/*const getStationById = async (req, res) => {
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

    // Calculate LPG cylinder prices if applicable
    let cylinderPrices = null;
    if (row.type === 'LPG' && row.lpg_price_per_kg) {
      const pricePerKg = parseFloat(row.lpg_price_per_kg);
      cylinderPrices = {
        '3kg': `GH₵ ${(pricePerKg * 3).toFixed(2)}`,
        '6kg': `GH₵ ${(pricePerKg * 6).toFixed(2)}`,
        '11kg': `GH₵ ${(pricePerKg * 11).toFixed(2)}`,
        '14.5kg': `GH₵ ${(pricePerKg * 14.5).toFixed(2)}`,
        '15kg': `GH₵ ${(pricePerKg * 15).toFixed(2)}`,
        '50kg': `GH₵ ${(pricePerKg * 50).toFixed(2)}`,
      };
    }

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
        photos: row.photos || [],
        // LPG specific fields
        lpg_price_per_kg: row.lpg_price_per_kg,
        delivery_available: row.delivery_available,
        cylinder_prices: cylinderPrices,
      },
    });

  } catch (error) {
    console.error('Get station error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch station',
    });
  }
};*/

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

    // Parse PostgreSQL array to JavaScript array for lpg_type
    let lpgTypeArray = null;
    if (row.lpg_type) {
      if (typeof row.lpg_type === 'string') {
        const cleaned = row.lpg_type.slice(1, -1);
        if (cleaned) {
          lpgTypeArray = cleaned.split(',').map(item =>
            item.replace(/^"(.*)"$/, '$1').trim()
          );
        }
      } else if (Array.isArray(row.lpg_type)) {
        lpgTypeArray = row.lpg_type;
      }
    }

    // Calculate LPG cylinder prices if applicable
    let cylinderPrices = null;
    if (row.type === 'LPG' && row.lpg_price_per_kg) {
      const pricePerKg = parseFloat(row.lpg_price_per_kg);
      cylinderPrices = {
        '3kg': `GH₵ ${(pricePerKg * 3).toFixed(2)}`,
        '6kg': `GH₵ ${(pricePerKg * 6).toFixed(2)}`,
        '11kg': `GH₵ ${(pricePerKg * 11).toFixed(2)}`,
        '14.5kg': `GH₵ ${(pricePerKg * 14.5).toFixed(2)}`,
        '15kg': `GH₵ ${(pricePerKg * 15).toFixed(2)}`,
        '50kg': `GH₵ ${(pricePerKg * 50).toFixed(2)}`,
      };
    }

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
        lpg_type: lpgTypeArray,  // ← Use parsed array
        photos: row.photos || [],
        lpg_price_per_kg: row.lpg_price_per_kg,
        delivery_available: row.delivery_available,
        has_backup_generator: row.has_backup_generator === true,
        cylinder_prices: cylinderPrices,
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
/*const addStation = async (req, res) => {
  try {
    const {
      id, name, type, lat, lng,
      price, phone, whatsapp,
      octane, connector, power_output, lpg_type,
      photos,
    } = req.body;

    if (!name || !type || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, type, lat and lng',
      });
    }

    // ✅ CORRECT: Count the placeholders - there should be 14 total
    // ($1 to $14) - 14 placeholders = 14 values
    await pool.query(
      `INSERT INTO stations
        (id, name, type, lat, lng, price, phone, whatsapp,
         octane, connector, power_output, lpg_type, photos,
         operator_id, verified, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,false,'Open')`,
      [
        id || `station_${Date.now()}`,  // $1
        name,                            // $2
        type,                            // $3
        lat,                             // $4
        lng,                             // $5
        price,                           // $6
        phone,                           // $7
        whatsapp,                        // $8
        octane,                          // $9
        connector,                       // $10
        power_output,                    // $11
        lpg_type ? JSON.stringify(lpg_type) : null,  // $12
        photos || [],                    // $13
        req.user.id,                     // $14
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
      message: error.message || 'Station addition failed',
    });
  }
};*/
/*const addStation = async (req, res) => {
  try {
    const {
      id, name, type, lat, lng,
      price, phone, whatsapp,
      octane, connector, power_output, lpg_type,
      photos,
      lpg_price_per_kg,      // ← NEW
      delivery_available,     // ← NEW
    } = req.body;

    if (!name || !type || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, type, lat and lng',
      });
    }

    await pool.query(
      `INSERT INTO stations
        (id, name, type, lat, lng, price, phone, whatsapp,
         octane, connector, power_output, lpg_type, photos,
         lpg_price_per_kg, delivery_available,
         operator_id, verified, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,false,'Open')`,
      [
        id || `station_${Date.now()}`,
        name, type, lat, lng,
        price, phone, whatsapp,
        octane, connector, power_output,
        lpg_type ? JSON.stringify(lpg_type) : null,
        photos || [],
        lpg_price_per_kg || null,
        delivery_available || false,
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
};*/

const addStation = async (req, res) => {
  try {
    const {
      id, name, type, lat, lng,
      price, phone, whatsapp,
      octane, connector, power_output, lpg_type,
      photos,
      lpg_price_per_kg,
      delivery_available,
      has_backup_generator,
    } = req.body;

    console.log('=== ADD STATION DEBUG ===');
    console.log('Type:', type);
    console.log('LPG Type (raw):', lpg_type);
    console.log('LPG Price per kg:', lpg_price_per_kg);

    if (!name || !type || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, type, lat and lng',
      });
    }

    // Convert lpg_type array to PostgreSQL array format if it's an array
    let pgLpgType = null;
    if (lpg_type && Array.isArray(lpg_type) && lpg_type.length > 0) {
      // Convert ['Autogas', 'Cylinder Refill'] to '{Autogas,"Cylinder Refill"}'
      const formatted = lpg_type.map(item => {
        // Wrap items with spaces or special characters in quotes
        if (item.includes(' ') || item.includes('-')) {
          return `"${item}"`;
        }
        return item;
      }).join(',');
      pgLpgType = `{${formatted}}`;
    }

    console.log('Formatted LPG Type:', pgLpgType);

    // Always include all columns - LPG fields will be NULL for non-LPG stations
    await pool.query(
      `INSERT INTO stations
        (id, name, type, lat, lng, price, phone, whatsapp,
         octane, connector, power_output, lpg_type, photos,
         lpg_price_per_kg, delivery_available,
         operator_id, verified, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,false,'Open')`,
      [
        id || `station_${Date.now()}`,
        name, type, lat, lng,
        price, phone, whatsapp,
        octane, connector, power_output,
        pgLpgType,  // ← Use the formatted PostgreSQL array
        photos || [],
        lpg_price_per_kg || null,
        delivery_available === true ? true : false,
        has_backup_generator === true ? true : false,
        req.user.id,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Station submitted for approval',
    });

  } catch (error) {
    console.error('Add station error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Station addition failed',
    });
  }
};




// ── UPDATE STATION (operator) ──
// PUT /api/stations/:id
/*const updateStation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      phone,
      whatsapp,
      lat,
      lng,
      octane,
      connector,
      power_output,
      lpg_type,
      photos,
    } = req.body;

    // Check if station exists
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

    // Check authorization (operator owns this station or admin)
    if (
      req.user.role !== 'admin' &&
      station.rows[0].operator_id !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this station',
      });
    }

    // Build dynamic update query based on provided fields
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramCount++}`);
      values.push(phone);
    }
    if (whatsapp !== undefined) {
      updates.push(`whatsapp = $${paramCount++}`);
      values.push(whatsapp);
    }
    if (lat !== undefined) {
      updates.push(`lat = $${paramCount++}`);
      values.push(lat);
    }
    if (lng !== undefined) {
      updates.push(`lng = $${paramCount++}`);
      values.push(lng);
    }
    if (octane !== undefined) {
      updates.push(`octane = $${paramCount++}`);
      values.push(octane);
    }
    if (connector !== undefined) {
      updates.push(`connector = $${paramCount++}`);
      values.push(connector);
    }
    if (power_output !== undefined) {
      updates.push(`power_output = $${paramCount++}`);
      values.push(power_output);
    }
    if (lpg_type !== undefined) {
      updates.push(`lpg_type = $${paramCount++}`);
      values.push(JSON.stringify(lpg_type));
    }
    if (photos !== undefined) {
      updates.push(`photos = $${paramCount++}`);
      values.push(photos);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
      });
    }

    // Add id as the last parameter
    values.push(id);
    
    const query = `
      UPDATE stations 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    const updatedStation = result.rows[0];

    res.status(200).json({
      success: true,
      message: 'Station updated successfully',
      data: {
        id: updatedStation.id,
        name: updatedStation.name,
        type: updatedStation.type,
        lat: parseFloat(updatedStation.lat),
        lng: parseFloat(updatedStation.lng),
        status: updatedStation.status,
        price: updatedStation.price,
        phone: updatedStation.phone,
        whatsapp: updatedStation.whatsapp,
        octane: updatedStation.octane,
        connector: updatedStation.connector,
        power_output: updatedStation.power_output,
        lpg_type: updatedStation.lpg_type,
        photos: updatedStation.photos || [],
        verified: updatedStation.verified,
      },
    });

  } catch (error) {
    console.error('Update station error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update station',
    });
  }
};*/

// UPDATE STATION (operator)
const updateStation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      phone,
      whatsapp,
      lat,
      lng,
      octane,
      connector,
      power_output,
      lpg_type,
      photos,
      lpg_price_per_kg,      // ← NEW
      delivery_available,     // ← NEW
      has_backup_generator,
    } = req.body;

    // Check if station exists
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

    // Check authorization
    if (
      req.user.role !== 'admin' &&
      station.rows[0].operator_id !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this station',
      });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramCount++}`);
      values.push(phone);
    }
    if (whatsapp !== undefined) {
      updates.push(`whatsapp = $${paramCount++}`);
      values.push(whatsapp);
    }
    if (lat !== undefined) {
      updates.push(`lat = $${paramCount++}`);
      values.push(lat);
    }
    if (lng !== undefined) {
      updates.push(`lng = $${paramCount++}`);
      values.push(lng);
    }
    if (octane !== undefined) {
      updates.push(`octane = $${paramCount++}`);
      values.push(octane);
    }
    if (connector !== undefined) {
      updates.push(`connector = $${paramCount++}`);
      values.push(connector);
    }
    if (power_output !== undefined) {
      updates.push(`power_output = $${paramCount++}`);
      values.push(power_output);
    }
    /*if (lpg_type !== undefined) {
      updates.push(`lpg_type = $${paramCount++}`);
      values.push(JSON.stringify(lpg_type));
    }*/

    if (lpg_type !== undefined) {
      // Convert to PostgreSQL array format
      let pgLpgType = null;
      if (Array.isArray(lpg_type) && lpg_type.length > 0) {
        const formatted = lpg_type.map(item => {
          if (item.includes(' ') || item.includes('-')) {
            return `"${item}"`;
          }
          return item;
        }).join(',');
        pgLpgType = `{${formatted}}`;
      }
      updates.push(`lpg_type = $${paramCount++}`);
      values.push(pgLpgType);
    }

    if (photos !== undefined) {
      updates.push(`photos = $${paramCount++}`);
      values.push(photos);
    }
    if (lpg_price_per_kg !== undefined) {
      updates.push(`lpg_price_per_kg = $${paramCount++}`);
      values.push(lpg_price_per_kg);
    }
    if (delivery_available !== undefined) {
      updates.push(`delivery_available = $${paramCount++}`);
      values.push(delivery_available);
    }


    if (has_backup_generator !== undefined) {
      updates.push(`has_backup_generator = $${paramCount++}`);
      values.push(has_backup_generator);
    }


    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
      });
    }

    values.push(id);

    const query = `
      UPDATE stations 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    const updatedStation = result.rows[0];

    res.status(200).json({
      success: true,
      message: 'Station updated successfully',
      data: {
        id: updatedStation.id,
        name: updatedStation.name,
        type: updatedStation.type,
        lat: parseFloat(updatedStation.lat),
        lng: parseFloat(updatedStation.lng),
        status: updatedStation.status,
        price: updatedStation.price,
        phone: updatedStation.phone,
        whatsapp: updatedStation.whatsapp,
        octane: updatedStation.octane,
        connector: updatedStation.connector,
        power_output: updatedStation.power_output,
        lpg_type: updatedStation.lpg_type,
        photos: updatedStation.photos || [],
        lpg_price_per_kg: updatedStation.lpg_price_per_kg,
        delivery_available: updatedStation.delivery_available,
      },
    });

  } catch (error) {
    console.error('Update station error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update station',
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
/*const getPendingStations = async (req, res) => {
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
};*/


/*const getPendingStations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.name as operator_name, u.email as operator_email
       FROM stations s
       LEFT JOIN users u ON s.operator_id = u.id
       WHERE s.verified = false
       ORDER BY s.created_at DESC`
    );

    const stations = result.rows.map(row => {
      // Calculate LPG cylinder prices if applicable
      let cylinderPrices = null;
      if (row.type === 'LPG' && row.lpg_price_per_kg) {
        const pricePerKg = parseFloat(row.lpg_price_per_kg);
        cylinderPrices = {
          '3kg': `GH₵ ${(pricePerKg * 3).toFixed(2)}`,
          '6kg': `GH₵ ${(pricePerKg * 6).toFixed(2)}`,
          '11kg': `GH₵ ${(pricePerKg * 11).toFixed(2)}`,
          '14.5kg': `GH₵ ${(pricePerKg * 14.5).toFixed(2)}`,
          '15kg': `GH₵ ${(pricePerKg * 15).toFixed(2)}`,
          '50kg': `GH₵ ${(pricePerKg * 50).toFixed(2)}`,
        };
      }

      return {
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
        photos: row.photos || [],
        operator_name: row.operator_name,
        operator_email: row.operator_email,
        verified: row.verified,
        created_at: row.created_at,
        // LPG specific fields
        lpg_price_per_kg: row.lpg_price_per_kg,
        delivery_available: row.delivery_available,
        cylinder_prices: cylinderPrices,
      };
    });

    res.status(200).json({
      success: true,
      count: stations.length,
      data: stations,
    });

  } catch (error) {
    console.error('Get pending stations error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending stations',
    });
  }
};*/

const getPendingStations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.name as operator_name, u.email as operator_email
       FROM stations s
       LEFT JOIN users u ON s.operator_id = u.id
       WHERE s.verified = false
       ORDER BY s.created_at DESC`
    );

    const stations = result.rows.map(row => {
      // Parse PostgreSQL array to JavaScript array for lpg_type
      let lpgTypeArray = null;
      if (row.lpg_type) {
        if (typeof row.lpg_type === 'string') {
          const cleaned = row.lpg_type.slice(1, -1);
          if (cleaned) {
            lpgTypeArray = cleaned.split(',').map(item =>
              item.replace(/^"(.*)"$/, '$1').trim()
            );
          }
        } else if (Array.isArray(row.lpg_type)) {
          lpgTypeArray = row.lpg_type;
        }
      }

      // Calculate LPG cylinder prices if applicable
      let cylinderPrices = null;
      if (row.type === 'LPG' && row.lpg_price_per_kg) {
        const pricePerKg = parseFloat(row.lpg_price_per_kg);
        cylinderPrices = {
          '3kg': `GH₵ ${(pricePerKg * 3).toFixed(2)}`,
          '6kg': `GH₵ ${(pricePerKg * 6).toFixed(2)}`,
          '11kg': `GH₵ ${(pricePerKg * 11).toFixed(2)}`,
          '14.5kg': `GH₵ ${(pricePerKg * 14.5).toFixed(2)}`,
          '15kg': `GH₵ ${(pricePerKg * 15).toFixed(2)}`,
          '50kg': `GH₵ ${(pricePerKg * 50).toFixed(2)}`,
        };
      }

      return {
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
        lpg_type: lpgTypeArray,  // ← Use parsed array
        photos: row.photos || [],
        operator_name: row.operator_name,
        operator_email: row.operator_email,
        verified: row.verified,
        created_at: row.created_at,
        lpg_price_per_kg: row.lpg_price_per_kg,
        delivery_available: row.delivery_available,
        has_backup_generator: row.has_backup_generator === true,
        cylinder_prices: cylinderPrices,
      };
    });

    res.status(200).json({
      success: true,
      count: stations.length,
      data: stations,
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
/*const getAllStationsAdmin = async (req, res) => {
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
};*/

const getAllStationsAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.name as operator_name
       FROM stations s
       LEFT JOIN users u ON s.operator_id = u.id
       ORDER BY s.created_at DESC`
    );

    const stations = result.rows.map(row => {
      // Parse PostgreSQL array to JavaScript array for lpg_type
      let lpgTypeArray = null;
      if (row.lpg_type) {
        if (typeof row.lpg_type === 'string') {
          const cleaned = row.lpg_type.slice(1, -1);
          if (cleaned) {
            lpgTypeArray = cleaned.split(',').map(item =>
              item.replace(/^"(.*)"$/, '$1').trim()
            );
          }
        } else if (Array.isArray(row.lpg_type)) {
          lpgTypeArray = row.lpg_type;
        }
      }

      // Calculate LPG cylinder prices if applicable
      let cylinderPrices = null;
      if (row.type === 'LPG' && row.lpg_price_per_kg) {
        const pricePerKg = parseFloat(row.lpg_price_per_kg);
        cylinderPrices = {
          '3kg': `GH₵ ${(pricePerKg * 3).toFixed(2)}`,
          '6kg': `GH₵ ${(pricePerKg * 6).toFixed(2)}`,
          '11kg': `GH₵ ${(pricePerKg * 11).toFixed(2)}`,
          '14.5kg': `GH₵ ${(pricePerKg * 14.5).toFixed(2)}`,
          '15kg': `GH₵ ${(pricePerKg * 15).toFixed(2)}`,
          '50kg': `GH₵ ${(pricePerKg * 50).toFixed(2)}`,
        };
      }

      return {
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
        lpg_type: lpgTypeArray,  // ← Use parsed array
        photos: row.photos || [],
        operator_name: row.operator_name,
        verified: row.verified,
        created_at: row.created_at,
        lpg_price_per_kg: row.lpg_price_per_kg,
        delivery_available: row.delivery_available,
        cylinder_prices: cylinderPrices,
        has_backup_generator: row.has_backup_generator === true,
      };
    });

    res.status(200).json({
      success: true,
      count: stations.length,
      data: stations,
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

/*// ── GET OPERATOR'S OWN STATION ──
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
        photos: row.photos || [],
        
      },
    });

  } catch (error) {
    console.error('Get my station error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch station',
    });
  }
};*/



// ── GET OPERATOR'S OWN STATIONS ──
// GET /api/operator/my-station
/*const getMyStation = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM stations 
       WHERE operator_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0] || null,
    });

  } catch (error) {
    console.error('Get my station error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your station',
    });
  }
};*/



// ── GET OPERATOR'S OWN STATION (single, for backward compatibility) ──
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

    // Parse PostgreSQL array to JavaScript array for lpg_type
    let lpgTypeArray = null;
    if (row.lpg_type) {
      if (typeof row.lpg_type === 'string') {
        const cleaned = row.lpg_type.slice(1, -1);
        if (cleaned) {
          lpgTypeArray = cleaned.split(',').map(item =>
            item.replace(/^"(.*)"$/, '$1').trim()
          );
        }
      } else if (Array.isArray(row.lpg_type)) {
        lpgTypeArray = row.lpg_type;
      }
    }

    // Calculate LPG cylinder prices if applicable
    let cylinderPrices = null;
    if (row.type === 'LPG' && row.lpg_price_per_kg) {
      const pricePerKg = parseFloat(row.lpg_price_per_kg);
      cylinderPrices = {
        '3kg': `GH₵ ${(pricePerKg * 3).toFixed(2)}`,
        '6kg': `GH₵ ${(pricePerKg * 6).toFixed(2)}`,
        '11kg': `GH₵ ${(pricePerKg * 11).toFixed(2)}`,
        '14.5kg': `GH₵ ${(pricePerKg * 14.5).toFixed(2)}`,
        '15kg': `GH₵ ${(pricePerKg * 15).toFixed(2)}`,
        '50kg': `GH₵ ${(pricePerKg * 50).toFixed(2)}`,
      };
    }

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
        lpg_type: lpgTypeArray,  // ← Use parsed array
        photos: row.photos || [],
        verified: row.verified,
        pending: row.verified === false,
        lpg_price_per_kg: row.lpg_price_per_kg,
        delivery_available: row.delivery_available,
        has_backup_generator: row.has_backup_generator === true,
        cylinder_prices: cylinderPrices,
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




// ── GET OPERATOR'S ALL STATIONS ──
// GET /api/stations/my-stations
/*const getMyStations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, 
              CASE WHEN s.verified = true THEN false ELSE true END as pending
       FROM stations s
       WHERE s.operator_id = $1
       ORDER BY s.created_at DESC`,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error) {
    console.error('Get my stations error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stations',
    });
  }
};*/

const getMyStations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, 
              CASE WHEN s.verified = true THEN false ELSE true END as pending
       FROM stations s
       WHERE s.operator_id = $1
       ORDER BY s.created_at DESC`,
      [req.user.id]
    );

    const stations = result.rows.map(row => {
      // Parse PostgreSQL array to JavaScript array for lpg_type
      let lpgTypeArray = null;
      if (row.lpg_type) {
        if (typeof row.lpg_type === 'string') {
          const cleaned = row.lpg_type.slice(1, -1);
          if (cleaned) {
            lpgTypeArray = cleaned.split(',').map(item =>
              item.replace(/^"(.*)"$/, '$1').trim()
            );
          }
        } else if (Array.isArray(row.lpg_type)) {
          lpgTypeArray = row.lpg_type;
        }
      }

      // Calculate LPG cylinder prices if applicable
      let cylinderPrices = null;
      if (row.type === 'LPG' && row.lpg_price_per_kg) {
        const pricePerKg = parseFloat(row.lpg_price_per_kg);
        cylinderPrices = {
          '3kg': `GH₵ ${(pricePerKg * 3).toFixed(2)}`,
          '6kg': `GH₵ ${(pricePerKg * 6).toFixed(2)}`,
          '11kg': `GH₵ ${(pricePerKg * 11).toFixed(2)}`,
          '14.5kg': `GH₵ ${(pricePerKg * 14.5).toFixed(2)}`,
          '15kg': `GH₵ ${(pricePerKg * 15).toFixed(2)}`,
          '50kg': `GH₵ ${(pricePerKg * 50).toFixed(2)}`,
        };
      }

      return {
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
        lpg_type: lpgTypeArray,  // ← Use parsed array
        photos: row.photos || [],
        verified: row.verified,
        pending: row.verified === false,
        lpg_price_per_kg: row.lpg_price_per_kg,
        delivery_available: row.delivery_available,
        has_backup_generator: row.has_backup_generator === true,
        cylinder_prices: cylinderPrices,
      };
    });

    res.status(200).json({
      success: true,
      count: stations.length,
      data: stations,
    });

  } catch (error) {
    console.error('Get my stations error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stations',
    });
  }
};



module.exports = {
  getAllStations,
  getStationById,
  addStation,
  updateStation,
  updatePrice,
  updateStatus,
  updatePowerOutput,
  approveStation,
  getPendingStations,      // ← ADD THIS
  getAllStationsAdmin,     // ← ADD THIS
  rejectStation,           // ← ADD THIS
  getAllReports,
  getMyStation,
  getMyStations,            // ← ADD THIS
};



