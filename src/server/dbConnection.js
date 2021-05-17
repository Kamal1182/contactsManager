const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
require('dotenv').config();

var _db;

module.exports = {

    connectToServer : function ( callback ) {
      MongoClient.connect(process.env.DB_CONN, { useUnifiedTopology: true },  (err, cluster) => {
        if(err) {
          console.log('Database error: ' + err);
        } else {
            _db = cluster.db('contacts-app-vm');
            console.log('Successful database connection');
            return callback( err );
        }
      })
    },

    getDb : function () { 
      return _db;  
    }

};