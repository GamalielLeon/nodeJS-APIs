const express = require('express');
require('./database');
const config = require('./server/config');
const app = config(express());

app.listen(app.get('port'), () => console.log('Server on port ', app.get('port')));