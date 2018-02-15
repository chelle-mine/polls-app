const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    github: {
        id: String,
        displayName: String,
        username: String
    },
    polls: [{ type: Schema.Types.ObjectId, ref: 'Poll' }] 
});

module.exports = mongoose.model('User', userSchema);
