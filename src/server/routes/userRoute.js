const express = require('express');
const router  = express.Router();
const { addUserValidationRules, validate } = require('../validation/addUserValidation');
const fs = require('fs');
const ObjectId = require('mongodb').ObjectID;
const jwt     = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//const db      = require('../dbConnection');
//database      = db.getDb();

module.exports = () => {
  router.get('/', (req, res) => {

    if( jwt.verify( req.headers.authorization.split(' ')[1], process.env.JWT_SECRET).admin == 'false' ) {
      return res.status(401).json({ error: 'Showing users is allowed for admins only!' });
    }
    const usersCollection = database.collection('users');
    
    usersCollection.find({}).toArray((err, docs) => {
      return res.status(200).json(docs);
    });
    
  });

  router.post('/', addUserValidationRules(),validate, (req, res, next) => {

    if( !jwt.verify( req.headers.authorization.split(' ')[1], process.env.JWT_SECRET).admin == 'false' ) {
      return res.status(401).json({ error: 'Adding new user is allowed for admins only!' });
    }

    const user = req.body;
    user.admin = req.body.admin ? true : false;
    user.password = bcrypt.hashSync(user.password, 10);
    
    const usersCollection = database.collection('users');

    usersCollection.findOne({ "username" : user.username }, (err, result) => {
      //if (err) throw err;
      if(result) {
        return res.status(409).json({ error: 'User already exists' });
      } else {
        usersCollection.insertOne(user, (err, r) => {
          if(err) {
            return res.status(500).json({ error: 'Error inserting new user' });
          }
    
          const newRecord = r.ops[0];
    
          return res.status(201).json(newRecord);
        });
      } 
    });
  })

  router.put('/:id', addUserValidationRules(),validate, (req, res, next) => {
    
    if( !jwt.verify( req.headers.authorization.split(' ')[1], process.env.JWT_SECRET).admin == 'false' ) {
      return res.status(401).json({ error: 'Editing a user is allowed for admins only!' });
    }
    const user = req.body;
    delete user._id;
    user.password = bcrypt.hashSync(user.password, 10);

    const usersCollection = database.collection('users');

    usersCollection.findOneAndUpdate({ "_id" : ObjectId(req.params.id) }, { $set: user }, { returnNewDocument: true })
      .then(updatedDocument => {
        if(updatedDocument) {
          console.log(`Successfully updated document: ${updatedDocument}.`);
          return res.status(201).json(updatedDocument);
        } else {
          console.log("No document matches the provided query.");
          return res.status(500).json({ error: 'Error updating new contact' });
        }
      })
  })

  router.delete('/:id', (req, res) => {

    if( !jwt.verify( req.headers.authorization.split(' ')[1], process.env.JWT_SECRET).admin == 'false' ) {
      return res.status(401).json({ error: 'Deleting a user is allowed for admins only!' });
    }

    const usersCollection = database.collection('users');
    usersCollection.findOneAndDelete({ "_id" : ObjectId(req.params.id) })
      .then(deletedUser => {
        if(deletedUser.value) {
          console.log(`Successfully deleted document that had the form: `);
          console.log(deletedUser);
          return res.status(201).json(deletedUser);
        } else if(deletedUser.value == null) {
          console.log("No document matches the provided query.");
          console.log(deletedUser);
          return res.status(204).json({ error: 'No data found!' });
        }
      })
      .catch(err => console.error(`Failed to find and delete document: ${err}`))
    /* find({}).toArray((err, docs) => {
      return res.json(docs);
    }); */
  });

  return router;
};
