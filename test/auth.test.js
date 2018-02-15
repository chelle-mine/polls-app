const expect = require('chai').expect
    , request = require('request')
    , Poll = require('../app/models/poll');

const dbURL = 'mongodb://localhost:27017'
    , host = 'http://localhost:3000';

describe('Prevent unauthenticated requests', () => {
    it('Redirects unauthenticated POST requests', (done) => {
        request.post({
            url: host + '/api/polls',
            followRedirect: false
        }, (err, response, body) => {
            expect(response.statusCode).to.equal(302);
            done();
        });
    });

    it('Redirects unauthenticated DELETE requests', (done) => {
        request.delete({
            url: host + '/api/polls/:pollId',
            followRedirect: false
        }, (err, response, body) => {
            expect(response.statusCode).to.equal(302);
            done();
        });
    });
});
