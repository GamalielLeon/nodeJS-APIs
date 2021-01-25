const morgan = require('morgan');
const express = require('express');
const routes = require('../routes/index');
const database = require('./database');

module.exports = app => {
    app.set('port', process.env.PORT || 5000);
    app.set('json spaces', 2);
    // Middleware
    app.use(express.json());
    app.use(morgan('dev'));
    // Routes
    routes(app);
    database(app);

    return app;
};