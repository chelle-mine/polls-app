'use strict';

const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/user');
const { githubAuth } = require('./auth');

module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use(new GitHubStrategy({
        clientID: githubAuth.clientID,
        clientSecret: githubAuth.clientSecret,
        callbackURL: githubAuth.callbackURL
    }, (token, refreshToken, profile, done) => {
        process.nextTick(() => {
            User.findOne({
                'github.id': profile.id
            }, (err, user) => {
                if (err) return done(err);

                if (user) return done(null, user);
                else {
                    // create document for new user
                    const user = new User();

                    user.github.id = profile.id;
                    user.github.displayName = profile.displayName;
                    user.github.username = profile.username;
                    user.github.publicRepos = profile._json.public_repos;
                    user.nbrClicks.clicks = 0;

                    user.save((err) => {
                        if (err) throw err;

                        return done(null, user);
                    });

                }

            });
        });
    }));
};
