'use strict';

module.exports = {
    'githubAuth': {
        'clientID': process.env.GITHUB_KEY,
        'clientSecret': process.env.GITHUB_SECRET,
        'callbackURL': process.env.NODE_ENV ==='production'
                       ? process.env.APP_URL + 'auth/github/callback' 
                       : 'http://127.0.0.1:3000/' + 'auth/github/callback'
    }
};
