'use strict';

const express = require('express')
    , mongoose = require('mongoose')
    , passport = require('passport')
    , routes = require('./app/routes')
    , session = require('express-session')
    , flash = require('express-flash')
    , pug = require('pug')
    , path = require('path');

const app = express();

require('dotenv').config();
require('./config/passport')(passport);
const dbURI = process.env.NODE_ENV ==='production'
            ? process.env.MONGO_URI
            : 'mongodb://localhost:27017/pollsdbtest';

mongoose.Promise = global.Promise;
mongoose.connect(dbURI, { useMongoClient: true });

app.set('views', './app/views');
app.set('view engine', 'pug');
app.use('/common', express.static(path.join(__dirname, 'app/common')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'birthday cat',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

// extract any flash messages
app.use((req, res, next) => {
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

module.exports = app;
