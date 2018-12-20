const express = require('express');

const {User} = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
  const userData = {email, password} = req.body;
  const user = new User(userData);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    console.error('Unable to create user.', e);
    res.status(400).send(e);
  }
});

module.exports = router;