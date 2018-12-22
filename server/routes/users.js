const express = require('express');

const {User} = require('../models/user');
const {authenticate} = require('../middleware/authenticate');

const router = express.Router();

router.post('/register', async (req, res) => {
  const {email, password} = req.body;

  const user = new User({email, password});

  try {
    await user.save();
    const token = await user.generateAuthToken();
    const {_id} = user;
    res.header('x-auth', token).send({_id, email});
  } catch (e) {
    res.status(400).send({error: e.message});
  }
});

router.post('/login', async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    const {_id} = user;
    res.header('x-auth', token).send({_id, email});
  } catch (e) {
    res.status(400).send({error: e.message});
  }
});

router.get('/me', authenticate, (req, res) => {
  const {_id, email, tokens} = req.user;
  res.send({_id, email, tokens});
});

module.exports = router;