'use strict';

const pollAPI = require('../controllers/poll.controller')
    , multer = require('multer');

const upload = multer();

module.exports = (app, passport) => {

    // middleware to check for authentication
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) return next();
        else {
            // save page to redirect to after successful auth
            req.session.sendTo = req.path;
            res.redirect('/login');
        }
    }

    // return username for pug template
    app.get('*', (req, res, next) => {
        res.locals.user = req.user ? req.user.github : null;
        next();
    });

    app.get('/new', isLoggedIn, (req, res) => {
        res.render('poll-form');
    });

    app.get('/', (req, res) => {
        res.redirect('/polls');
    });
        
    app.get('/login', (req, res) => {
        res.redirect('/auth/github');
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
    
    // passport authentication routes
    app.get('/auth/github', passport.authenticate('github'));

    app.get('/auth/github/callback',
            passport.authenticate('github', { failureRedirect: '/',
                                              failureFlash: 'Failed to authenticate using github credentials.'  }),
            (req, res) => {
                const redirectTo = req.session.sendTo || '/';
                res.redirect(redirectTo);
            });

    app.route('/polls')
        .get(pollAPI.all, (req, res) => {
            res.render('index', { polls: req.allPolls });
        })
        .post(isLoggedIn, upload.fields([]), pollAPI.create);

    app.route('/my-polls')
        .get(isLoggedIn, pollAPI.user, (req, res) => {
            res.render('my-polls', { polls: req.userPolls });
        });

    app.route('/polls/:pollId')
        .get(pollAPI.results, (req, res) => {
            res.render('poll-info', { poll: req.foundPoll });
        })
        .delete(isLoggedIn, pollAPI.remove, (req, res) => {
            res.json(req.removedPoll);
        });

    app.post('/polls/:pollId/vote', upload.fields([]), pollAPI.vote, isLoggedIn, pollAPI.add);


    /*
     *
     * API endpoints for testing
     * 
     */
    app.route('/api/polls')
        .get(pollAPI.all, (req, res) => {
            res.json(req.allPolls);
        })
        .post(isLoggedIn, upload.fields([]), pollAPI.create);

    app.route('/api/my-polls')
        .get(isLoggedIn, pollAPI.user, (req, res) => {
            res.json(req.userPolls);
        });

    app.route('/api/polls/:pollId')
        .get(pollAPI.results, (req, res) => {
            res.json(req.foundPoll);
        })
        .delete(isLoggedIn, pollAPI.remove, (req, res) => {
            res.json(req.removedPoll);
        });

    app.route('/api/polls/:pollId/vote')
        .post(upload.fields([]), (req, res, next) => {
            // submit vote when no custom option is specified
            if (req.body['custom-option']) return next();
            // pass on the same req and res objs to vote
            return pollAPI.vote(req, res);
        }, isLoggedIn, pollAPI.add);

};
