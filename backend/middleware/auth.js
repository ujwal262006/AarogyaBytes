const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // 1. Check header
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // 2. Extract token
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  const token = parts[1];

  // 3. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach to request
    req.clinicId = decoded.clinicId;
    req.doctorId = decoded.doctorId;
    req.email = decoded.email;

    console.log('🔐 Authenticated:', {
      clinicId: req.clinicId,
      doctorId: req.doctorId,
    });

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
