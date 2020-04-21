const express = require('express');
const server = express();
const session = require('express-session');

// Import Routes
const usersRouter = require('../routes/users-route');
const authRouter = require('../auth/auth-router');

// Middleware
const authenticator = require('../auth/authenticator');

// Session
const sessionConfig = {
  name: 'whatever',
  secret: process.env.SESSION_SECRET || '123456hi',
  resave: false,
  saveUninitialized: process.env.SEND_COOKIES || true,
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: process.env.USE_SECURE_COOKIES || false,
    httpOnly: true,
  },
};

// Use
server.use(express.json());
server.use(session(sessionConfig));

// Use Routes
server.use('/api/users', authenticator, usersRouter);
server.use('/api/', authRouter);

// Test
server.get('/', (req, res) => {
  res.send(`<h1>SERVER IS WORKING</h1>`);
});

module.exports = server;
