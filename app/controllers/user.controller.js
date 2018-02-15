/*
 * Endpoints:
 *     `api/:user` - GET retrieves user's created polls
 */
'use strict';

const User = require('../models/user.js');

exports.myPolls = (req, res) => {
    User.findById(req.user._id)
        .populate('polls')
        .exec((err, user) => {
            if (err) throw err;
            res.json(user.polls);
        });
};
