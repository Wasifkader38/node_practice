const jwt = require('jsonwebtoken');

const requireRole = role => (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) return res.status(401).send('Access denied');

  try {
    const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
    if (decoded.role !== role) return res.status(403).send('Access denied');

    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};
