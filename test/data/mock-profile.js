const mongoose = require('mongoose');
module.exports = {
    _id: new mongoose.Types.ObjectId,
    github: {
        id: 'test123',
        displayName: 'testName',
        username: 'testusername'
    },
    polls: []
};
