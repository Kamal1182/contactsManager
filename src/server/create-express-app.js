const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const apiRouter = require('./routes/api-router');
const fileUpload = require('express-fileupload');

function createExpressApp(database) {
  const app = express();

  app.use(bodyParser.json({limit: '50mb'}));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/profiles', express.static(path.join(__dirname, 'profiles')));

  app.use('/api', apiRouter());

  app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public/index.html'));
  });

  return app;
}

module.exports = createExpressApp;