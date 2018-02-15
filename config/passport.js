'use strict';

const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../app/models/user');
const githubAuth = require('./auth').githubAuth;

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
            // check for existing user
            User.findOne({
                'github.id': profile.id
            }, (err, user) => {
                if (err) return done(err);

                if (user) return done(null, user);
                else {
                    // create document for new user
                    const user = new User({
                        github: {
                            id: profile.id,
                            displayName: profile.displayName,
                            username: profile.username
                        },
                        polls: []
                    });

                    user.save((err) => {
                        if (err) return done(err);

                        return done(null, user);
                    });
                }
            });
        });
    }));
};
