const morgan = require('morgan');
const express = require('express');
const routes = require('../routes/index');

module.exports = app => {
    app.set('port', process.env.PORT || 5000);
    app.set('json spaces', 2);
    // Middleware
    app.use(express.json());
    app.use(morgan('dev'));
    // Routes
    routes(app);

    return app;
};