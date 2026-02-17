const router = require('express').Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { AuthToken, User } = require('../models');
const { authenticate  ,generateToken} = require('../middlewares/auth.middleware');
const mailer = require('../service/mail.service');

/**
 * REGISTER
 */
router.post('/registration', async (req, res) => {
  try{
    const { name, email, password, confirm } = req.body;
  
    if (password !== confirm) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
  
    await User.create({ name, email, password });
    res.status(201).json({ message: 'Registered successfully' });

  }
  catch{
    res.status(500).json({ error: 'registration failed' });
  }
});

/**
 * LOGIN
 */
router.post('/login', async (req, res)=>{
    try {
    const { email, password } = req.body;

    const user = await User.scope('withPassword').findOne({
      where: { email }
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await user.update({ lastLoginAt: new Date() });

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    } catch {
      res.status(500).json({ error: 'Login failed' });
  }
})

/**
 * FORGOT PASSWORD
 */
router.post('/forgot-password', async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) return res.json({ message: 'Email sent if user exists' });

  const token = await AuthToken.create({
    userId: user.id,
    type: 'RESET_PASSWORD',
    token: crypto.randomUUID(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000)
  });

  await mailer.sendMail({
    to: user.email,
    subject: 'Reset password',
    html: `<a href="${process.env.FRONTEND_URL}/reset/${token.token}">Reset</a>`
  });

  res.json({ message: 'Email sent if user exists' });
});

/**
 * RESET PASSWORD
 */
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  const authToken = await AuthToken.findOne({
    where: { token, usedAt: null }
  });

  if (!authToken || authToken.expiresAt < new Date()) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  const user = await User.findByPk(authToken.userId);
  user.password = password;
  await user.save();

  authToken.usedAt = new Date();
  await authToken.save();

  res.json({ message: 'Password reset successful' });
});

/**
 * ME
 */
router.get('/me', authenticate, async (req, res) => {
  res.json(await User.findByPk(req.user.id));
});

module.exports = router;
