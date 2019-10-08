// MONGO CONNECTION = mongodb+srv://owiwi:<password>@cluster0-7cerh.mongodb.net/admin?retryWrites=true&w=majority
// USER (owi) PW = b4CG56I70A68QaoP

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Thing = require('./models/thing');

const app = express();

mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb+srv://owiwi:b4CG56I70A68QaoP@cluster0-7cerh.mongodb.net/uba?retryWrites=true&w=majority', { useNewUrlParser: true })
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

app.put('/api/stuff/:id', (req, res, next) => {
  const thing = new Thing({
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
  });
  Thing.updateOne({_id: req.params.id}, thing)
    .then(() => {
      res.status(201).json({
        message: 'Thing update successful!'
      });
    })
    .catch((error) => {
      res.status.json({
        error: error
      });
    });
});

app.delete('/api/stuff/:id', (req, res, next) => {
  Thing.deleteOne({_id: req.params.id})
    .then(() => {
      res.status(200).json({
        message: 'thing deleted!'
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error
      });
    });
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
  //     _id: '34343434',
  //     title: 'My third thing',
  //     description: 'All of the info about my third thing',
  //     imageUrl: '',
  //     price: 66900,
  //     userId: 'qsomihvqios',
  //   },
  // ];
  // res.status(200).json(stuff);
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