const express = require('express');
const router  = express.Router();
const { addContactValidationRules, validate } = require('../validation/addUserValidation');
const fs = require('fs');
const ObjectId = require('mongodb').ObjectID;
const jwt     = require('jsonwebtoken');

//const db      = require('../dbConnection');
//database      = db.getDb();

module.exports = () => {
  router.get('/', (req, res) => {
      const contactsCollection = database.collection('contacts');
      contactsCollection.find({}).toArray((err, docs) => {
        return res.status(200).json(docs);
      });
    });

  router.post('/', addContactValidationRules(),validate, (req, res, next) => {

    if( !jwt.verify( req.headers.authorization.split(' ')[1], process.env.JWT_SECRET).admin == 'false' ) {
      return res.status(401).json({ error: 'Adding new contact is allowed for admins only!' });
    }

    const user = req.body;

    // Write the image to profiles folder
    var buffer = new Buffer(req.body.photoUrl.data, 'base64');
    const photoName = `${req.body.firstName}-${req.body.lastName}.${req.body.photoUrl.extension}`;
    fs.writeFile(process.cwd()+`/src/server/profiles/`+photoName,
                  buffer, function (err,data) {
        if (err) {
          return console.log(err);
        }
    });
      /* if(req.files) {
        console.log(req.files);
        req.files.photoUrl.mv('profiles');
      } */

    const contactsCollection = database.collection('contacts');

    req.body.photoUrl.data = 'data:image/jpeg;base64,' + req.body.photoUrl.data;
    contactsCollection.insertOne(user, (err, r) => {
      if(err) {
        return res.status(500).json({ error: 'Error inserting new contact' });
      }

      const newRecord = r.ops[0];

      return res.status(201).json(newRecord);
    });
  })

  router.put('/:id', addContactValidationRules(),validate, (req, res, next) => {

    if( !jwt.verify( req.headers.authorization.split(' ')[1], process.env.JWT_SECRET).admin == 'false' ) {
      return res.status(401).json({ error: 'Editing a user is allowed for admins only!' });
    }

    const user = req.body;
    delete user._id;
    //console.log(req.body);
    // Write the image to profiles folder
    var buffer = new Buffer(req.body.photoUrl.data, 'base64');
    fs.writeFile(process.cwd()+`/src/server/profiles/${req.body.firstName}-${req.body.lastName}.${req.body.photoUrl.extension}`,
                  buffer, function (err,data) {
        if (err) {
          return console.log(err);
        }
    });
      /* if(req.files) {
        console.log(req.files);
        req.files.photoUrl.mv('profiles');
      } */

    const contactsCollection = database.collection('contacts');

    req.body.photoUrl.data = 'data:image/jpeg;base64,' + req.body.photoUrl.data;
    /* contactsCollection.findOneAndUpdate({ "_id" : ObjectId(req.params.id) }, { $set: user }, { returnNewDocument: true }, (err, r) => {
      if(err) {
        return res.status(500).json({ error: 'Error updating new contact' });
      }

      const updatedRecord = r.ops[0];
      console.log(r);

      return res.status(201).json(updatedRecord);
    }); */

    contactsCollection.findOneAndUpdate({ "_id" : ObjectId(req.params.id) }, { $set: user }, { returnNewDocument: true })
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

    const contactsCollection = database.collection('contacts');
    contactsCollection.findOneAndDelete({ "_id" : ObjectId(req.params.id) })
      .then(deletedContact => {
        if(deletedContact.value) {
          console.log(`Successfully deleted document that had the form: `);
          console.log(deletedContact);
          return res.status(201).json(deletedContact);
        } else if(deletedContact.value == null) {
          console.log("No document matches the provided query.");
          console.log(deletedContact);
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
