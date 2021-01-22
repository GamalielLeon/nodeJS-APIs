const { Status } = require('../models/index');
const characters = require('./characters');
const episodes = require('./episodes');

module.exports = app => {
    // Set all the headers to send to the client
    app.use((req, res, next) => {
        res.append('Access-Control-Allow-Origin', '*');
        res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.append('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
        res.append('Content-Type', 'application/json');
        res.append('Cache-Control', 'no-cache');
        next();
    });
    // Endpoints.
    app.use(require('./characters'));
    app.use(require('./episodes'));
    // If no endpoint is found.
    app.use((req, res) => res.status(404).json(Status[404]));
};