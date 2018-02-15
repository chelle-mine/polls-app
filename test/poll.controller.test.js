const expect = require('chai').expect
    , request = require('request')
    , User = require('../app/models/user')
    , Poll = require('../app/models/poll')
    , app = require('../app')
    , mockProfile = require('./data/mock-profile');

const dbURL = 'mongodb://localhost:27017'
    , host = 'http://localhost:3000';

let pollLinks = [];
let server;
// clear all users from db
before((done) => {
    server = app.listen(3000, () => console.log('Testing on port 3000...'));
    
    Poll.remove({}, (err) => {
        if (err) throw err;

        User.remove({}, (err) => {
            if (err) throw err;
            User.create(mockProfile, (err, profile) => {
                if (err) throw err;
                done();
            });
        });
    })
});

after((done) => {
    User.remove({}, (err) => {
        if (err) throw err;
        server.close();
        done();
    });
});

describe('Authenticated Requests', () => {
    before((done) => {
        app.request.isAuthenticated = () => true;
        app.request.user = mockProfile;
        done();
    });

    it('POST api/polls: Successfully creates a new poll', (done) => {

        const newPoll = {
            question: "Testing",
            options: ["yes", "no"]
        };

        request.post({
            url: host + '/api/polls',
            formData: {
                'poll-question': newPoll.question,
                'option': newPoll.options
            }
        }, (err, response, body) => {
            if (err) throw err;
            const parsed = JSON.parse(body);
            // returned json should rep mongodb document of `newPoll`
            expect(parsed.question).to.equal(newPoll.question);
            expect(parsed.options.length).to.equal(2);
            expect(parsed.author).to.equal(mockProfile._id.toString());
            // save for further testing
            pollLinks.push(parsed.link);
            done();
        });
    });

    it('GET api/my-polls Fetches user\'s polls', (done) => {
        request.get(host + '/api/my-polls', (err, response, body) => {
            const parsed = JSON.parse(body);
            expect(parsed.length).to.equal(1);
            done();
        });
    });

    it('POST api/polls/:pollId/vote: Creates a new option and votes for it', (done) => {
        const newOpt = 'maybe?';
        request.post({
            url: host + '/api/polls/' + pollLinks[0] + '/vote',
            formData: {
                'custom-option': newOpt
            }
        }, (err, response, body) => {
            // doc should have three options
            request.get(host + '/api/polls/' + pollLinks[0], (err1, response1, body1) => {
                const parsed = JSON.parse(body1);
                expect(parsed.options.length).to.equal(3);
                done();
            });
        });
    });

    it('DELETE api/polls/:pollId: Removes a selected poll from db', (done) => {
        // insert dummy doc to remove
        const dummy = {
            question: "Testing1",
            options: ["yes1", "no1"]
        };

        request.post({
            url: host + '/api/polls',
            formData: {
                'poll-question': dummy.question,
                'option': dummy.options
            }
        }, (err, response, body) => {
            // push dummy link for ref
            pollLinks.push(JSON.parse(body).link);
            // remove dummy doc
            request.delete(host + '/api/polls/' + pollLinks[1], (err1, response1, body1) => {
                expect(JSON.parse(body1)).to.include({ link: pollLinks[1] });
                done();
            });

        });
    });

    after((done) => {
        app.request.isAuthenticated = () => false;
        app.request.user = undefined;
        done();
    });
});

describe('Unauthenticated Requests', () => {

    it('GET: Retrieves full list of polls', (done) => {
        request.get(host + '/api/polls', (err, response, body) => {
            // should return 2 docs
            expect(JSON.parse(body).length).to.equal(1);
            done();
        });
    });

    it('POST: Registers a vote', (done) => {
        request.post({
            url: host + '/api/polls/' + pollLinks[0] + '/vote',
            formData: { 'option': 'yes' }
        }, (err, response, body) => {
            request.get(host + '/api/polls/' + pollLinks[0], (err1, response1, body1) => {
                console.log(body1);
                const parsed = JSON.parse(body1);
                expect(parsed.options[0].votes).to.equal(1);
                done();
            });
        });
    });

    it('GET: Retrieves document of selected poll', (done) => {
        request.get(host + '/api/polls/' + pollLinks[0], (err, response, body) => {
            const parsed = JSON.parse(body);
            expect(parsed.options.length).to.equal(3);
            done();
        });
    });
});


