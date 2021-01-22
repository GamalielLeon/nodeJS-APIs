const mongoose = require('mongoose');
const { database } = require('./keys');

mongoose.connect(database.localURI, { useNewUrlParser: true })
    .then(db => console.log('database successful connection'))
    .catch(err => console.error('cannot connect to the database'));