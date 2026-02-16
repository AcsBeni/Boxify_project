const jwt = require('jsonwebtoken');

function ensureSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET from environment');
  }
  return process.env.JWT_SECRET;
}

/**
 * Generate JWT
 * @param {{ id: string, email: string, role: string }} user
 */
function generateToken(user) {
  const secret = ensureSecret();

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    secret,
    {
      expiresIn: '2h'
    }
  );
}

function verifyToken(token) {
  const secret = ensureSecret();
  return jwt.verify(token, secret);
}

/**
 * Express middleware
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token!' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);

    // decoded === { id, email, role, iat, exp }
    req.user = decoded;

    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token!' });
  }
}

module.exports = {
  authenticate,
  verifyToken,
  generateToken
};
