/*
const expect = require('chai').expect
    , request = require('request')
    , Poll = require('../app/models/poll')
    , User = require('../app/models.user')
    , server = require('../test-server');

const dbURL = 'mongodb://localhost:27017'
    , host = 'http://localhost:3000';

const mockProfile = {
    _id: 'testing_id',
    github: {
        id: 'abc123',
        username: 'testUsername',
        displayName: 'testDisplayName'
    }
};

before((done) => {
    User.remove({}, (err) => {
        if (err) throw err;

        server.request.isAuthenticated = () => true;
        server.request.user = mockProfile;
        done();
    });
});

after((done) => {
    server.request.isAuthentcated = undefined;
    server.request.github = undefined;
    done();
});

describe('Managing user\'s polls', () => {
    it('Saves poll ref to user', (done) => {
        request.post({
            url: host + '/api/polls',
            form: {
                'poll-question': 'Testing1',
                'option': ['yes1', 'no2']
            }
        }, (err, response, body) => {
            if (err) throw err;
            const created = JSON.parse(body);

        });
    });
});
*/
