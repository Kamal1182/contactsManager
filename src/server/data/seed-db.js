require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

const users = require('./users');
const contacts = require('./contacts');
require('dotenv').config();



function seedCollection(collectionName, initialRecords) {

  MongoClient.connect(process.env.DB_CONN, { useUnifiedTopology: true }, (err, cluster) => {
    
    if(err) {
      console.log('Database error: ' + err);
    } else {
      const db = cluster.db('contacts-app-vm');
      
      const collection = db.collection(collectionName);
      
      console.log('Successful database connection...');
      
      collection.deleteMany({});  

      initialRecords.forEach((item) => {
        if (item.password) {
          item.password = bcrypt.hashSync(item.password, 10);
        }
      });

      console.log('inserting records...');

      collection.insertMany(initialRecords, (err, result) => {
        console.log(`${result.insertedCount} records inserted.`);
        console.log('closing connection...');
        cluster.close();
        console.log('done.');
      });
    }
  });
}


seedCollection('users', users);
seedCollection('contacts', contacts);
