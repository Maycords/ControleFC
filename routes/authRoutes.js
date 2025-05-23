const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const router = express.Router();
const config = require('../config/config');
const validate = require('../middleware/validate');

const users = [];

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Acesso negado');
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Token inválido');
  }
};

router.post('/login',
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  validate,
  (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(400).send('Credenciais inválidas');
    const token = jwt.sign({ email }, config.JWT_SECRET);
    res.json({ token });
});

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  validate,
  (req, res) => {
    const { email, password } = req.body;
    users.push({ email, password });
    res.status(201).send('Usuário registrado');
});

router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
