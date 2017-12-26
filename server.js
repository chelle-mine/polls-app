'use strict';

const express = require('express')
    , routes = require('./app/routes')
    , mongoose = require('mongoose')
    , passport = require('passport')
    , session = require('express-session');

const app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ' + port + '...'));

