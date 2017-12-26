'use strict';

const User = require('../models/user');

function ClickHandler() {}

// GET request
ClickHandler.prototype.getClicks = (req, res) => {

    User.findOne({
        'github.id': req.user.github.id
    }, {'_id': 0})
        .exec((err, user) => {
            if (err) throw err;

            res.json(user.nbrClicks);
        });
};

// POST request
// increment clicks by 1
ClickHandler.prototype.addClick = (req, res) => {

    User.findOneAndUpdate({
        'github.id': req.user.github.id
    }, { $inc: {'nbrClicks.clicks': 1} }, { new: true })
          .exec((err, user) => {
              if (err) throw err;
              res.json(user.nbrClicks);
          });

};

// DELETE request
// reset clicks to 0
ClickHandler.prototype.resetClicks = function(req, res) {

    User.findOneAndUpdate({
        'github.id': req.user.github.id
    }, { 'nbrClicks.clicks': 0 }, { new: true })
          .exec((err, user) => {
              if (err) throw err;
              res.json(user.nbrClicks);
          });

};

module.exports = ClickHandler;
