const db = require('./dbConnection');
const port = process.env.PORT || 3000;
const createExpressApp = require('./create-express-app');

require('dotenv').config();

database = db.connectToServer( ( err ) => {
    if (err) console.log(err);
    
    database = db.getDb();

    createExpressApp(database)
      .listen(port, () => {
        console.log(`listening on http://localhost:${port}`)
      });
  }  
);

//database = db.getDb();


  
/* const www = process.env.WWW || './';

app.use(express.static(www));
console.log(`serving ${www}`);
app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
}); */