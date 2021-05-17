const express  = require('express');
const checkJwt = require('express-jwt');
const router   = express.Router();
const contactsRoute = require('./contactsRoute');
const userRoute = require('./userRoute');
const authenticateRoute = require('./authenticateRoute');
//const db       = require('../dbConnection');
//database = db.getDb();

module.exports = () => {

  router.use(
    checkJwt({ secret: process.env.JWT_SECRET, algorithms: ['RS256'] }).unless({ path: '/api/authenticate' })
  );

  router.use((err, req, res, next) => {
    if(err.name === 'UnauthorizedError') {
      res.status(401).send({ error : err.message});
    }
  })

  router.use('/contacts', contactsRoute());

  router.use('/users', userRoute());

  router.use('/authenticate', authenticateRoute());

  return router;
}
