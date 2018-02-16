'use strict';

const shortid = require('shortid');
const Poll = require('../models/poll');
const User = require('../models/user');

// GET /api/polls
exports.all = (req, res, next) => {
    Poll.find().sort({_id: -1}).lean().exec((err, docs) => {
        if (err) throw err;
        req.allPolls = docs;
        next();
    });
}

// GET api/my-polls
exports.user = (req, res, next) => {
    Poll.find({ author: req.user._id }).sort({_id: -1}).lean().exec((err, docs) => {
        if (err) throw err;
        req.userPolls = docs;
        next();
    });
}

// POST /api/polls
// require github auth
/*
 * Verifies that at least two options are submitted.
 * Creates a new poll and points to author document in db.
 * Attaches link of newly created poll to request object.
 */
exports.create = (req, res) => {
    User.findOne({'github.id': req.user.github.id})
        .lean()
        .exec((err, author) => {
            const submittedQuestion = req.body['poll-question'];
            const submittedOptions = [].concat(req.body.option);
            // require a title
            if (!submittedQuestion
                    || submittedQuestion.trim().length === 0) res.json('Please enter a poll title.');

            // require at least 2 options
            if (submittedOptions.slice(0, 2).filter((val) => val.trim().length > 0).length < 2) res.json('Please enter at least 2 poll options.');

            const options = submittedOptions.map((option) => {
                return { name: option };
            });

            const poll = new Poll({
                question: submittedQuestion,
                options: options,
                author: author._id,
                link: shortid.generate()
            });

            poll.save((err, doc) => {
                if (err) throw err;
                // return newly created doc
                res.json(doc);
            });
        });
};


// GET /api/polls/:pollId
exports.results = (req, res, next) => {
    Poll.findOne({link: req.params.pollId})
        .lean()
        .exec((err, doc) => {
            if (err) throw err;
            req.foundPoll = doc;
            next();
        });
};

// DELETE /api/polls/:pollId
// require github auth
exports.remove = (req, res, next) => {
    Poll.findOneAndRemove({link: req.params.pollId})
        .exec((err, doc) => {
            if (err) throw err;
            req.removedPoll = doc;
            next();
        });
}

// POST /api/polls/:pollId/vote
// require github auth
/*
 * Creates a new option and votes for it.
 */
exports.add = (req, res) => {
    const newOption = { name: req.body['custom-option'], votes: 1 };

    Poll.findOneAndUpdate({ link: req.params.pollId }, { $push: { options: newOption }}, { new: true }, (err, doc) => {
        if (err) throw err;
        res.json(doc);
    });
};

// POST /api/polls/:pollId/vote
// TODO update sub-doc
/*
 * Defers to next middleware if custom-option is detected
 */
exports.vote = (req, res, next) => {

    if (req.body['custom-option']) return next();
    const choice = req.body.option;

    Poll.findOneAndUpdate({
        link: req.params.pollId, 'options.name': choice
    }, { $inc: {'options.$.votes': 1} }, { new: true })
        .exec((err, doc) => {
            if (err) throw err;
            res.json(doc);
        });
     
};
