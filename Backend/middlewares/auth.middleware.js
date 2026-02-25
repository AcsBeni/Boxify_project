const jwt = require('jsonwebtoken');

function ensureSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET missing');
  }
  return process.env.JWT_SECRET;
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    ensureSecret(),
    { expiresIn: '7d' }
  );
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = jwt.verify(token, ensureSecret());
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { generateToken, authenticate };
