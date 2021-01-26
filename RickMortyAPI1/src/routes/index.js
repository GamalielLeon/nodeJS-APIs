const Status = require('../constants/Status');
const episodeRoutes = require('./episodes');
const characterRoutes = require('./characters');
const { basePath, character, episode } = require('./pathNames');

module.exports = app => {
    // Set all the headers to send to the client
    app.use((req, res, next) => {
        res.append('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
        res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.append('Access-Control-Allow-Origin', '*');
        res.append('Content-Type', 'application/json');
        res.append('Cache-Control', 'no-cache');
        next();
    });
    // Endpoints.
    app.use(`/${basePath}/${character}`, characterRoutes);
    app.use(`/${basePath}/${episode}`, episodeRoutes);
    // If no endpoint is found.
    app.use((req, res) => res.status(404).json(Status[404]));
};