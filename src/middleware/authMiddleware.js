 const jwt = require('jsonwebtoken');

//PROTECT MIDDLEWARE 
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Token must be sent as: Authorization: Bearer <token>
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Please log in.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user to request
    // Controllers can access req.user.id and req.user.role
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Please log in again.',
    });
  }
};

// OPERATOR MIDDLEWARE 
const operatorOnly = (req, res, next) => {
  if (req.user.role !== 'operator' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Operators only.',
    });
  }
  next();
};

//ADMIN MIDDLEWARE
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admins only.',
    });
  }
  next();
};

module.exports = { protect, operatorOnly, adminOnly };
