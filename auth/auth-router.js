const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Users = require('../models/users-model');

router.post('/register', (req, res) => {
  const user = req.body;
  const rounds = process.env.HASH_ROUNDS || 12;
  const hash = bcrypt.hashSync(user.password, rounds);

  user.password = hash;

  Users.addUser(user)
    .then((response) => {
      res.status(200).json({ message: user });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.loggedIn = true;
        res.status(200).json({ message: 'Welcome!' });
      } else {
        res.status(401).json({ message: 'Invalid Username and Password' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
