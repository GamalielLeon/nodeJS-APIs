const mongoose = require('mongoose');
const { database } = require('../constants/keys');
const mongooseOptions = {
    useNewUrlParser: true,
    autoIndex: true,
    useCreateIndex: true,
    useUnifiedTopology: true
};
module.exports = app => {
    mongoose.connect(database.localURI, mongooseOptions)
        .then(db => app.listen(app.get('port'), () => console.log('Server on port', app.get('port'))))
        .catch(err => console.error('cannot connect to the database'));
};