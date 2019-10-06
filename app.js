// MONGO CONNECTION = mongodb+srv://owi:<password>@cluster0-7cerh.mongodb.net/admin?retryWrites=true&w=majority
// USER (owi) PW = KW1vE2szoTp0EeGY

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Thing = require('./models/thing');

const app = express();

mongoose.connect('mongodb+srv://owi:KW1vE2szoTp0EeGY@cluster0-7cerh.mongodb.net/admin?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch(error => {
    console.log(`${error}:  Failed to connect to MongoDB`);
  });

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.post('/api/stuff', (req, res, next) => {
  // console.log(req.body);
  // res.status(201).json({
  //   message: 'Thing created successfully!'
  // });
  const thing = new Thing({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
  });

  thing.save()
    .then(() => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error
      });
    });
});

app.get('/api/stuff/:id', (req, res, next) => {
  Thing.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
});

app.use('/api/stuff', (req, res, next) => {
  // const stuff = [
  //   {
  //     _id: 'oeihfzeoi',
  //     title: 'My first thing',
  //     description: 'All of the info about my first thing',
  //     imageUrl: '',
  //     price: 4900,
  //     userId: 'qsomihvqios',
  //   },
  //   {
  //     _id: 'oeihfzeomoihi',
  //     title: 'My second thing',
  //     description: 'All of the info about my second thing',
  //     imageUrl: '',
  //     price: 2900,
  //     userId: 'qsomihvqios',
  //   },
  // ];
  Thing.find()
    .then((things) => {
      res.status(201).json(things);
    })
    .catch((error) => {
      res.status(400).json({
        error: error
      });
    });
});

module.exports = app;