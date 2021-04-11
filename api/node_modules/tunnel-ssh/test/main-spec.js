var tunnel = require('../');
var helper = require('./server');
var chai = require('chai');
var expect = chai.expect;

describe('tunnel-ssh', function () {
    it('should emit an error', function (done) {
        var config = {
            host: '127.0.0.1', username: process.env.USER, dstPort: 8000, localPort: 7000
        };

        tunnel(config, function () {
            helper.createClient(7000, '127.0.0.1', done);
        }).on('error', function (e) {
            expect(e).to.be.instanceOf(Error);
            done(null);
        });
    });

    it('brokenConfig, should callback an error', function (done) {
        var brokenConfig = {};

        tunnel(brokenConfig, function (e) {
            expect(e).to.be.instanceOf(Error);
            done();
        });
    });

    it('brokenConfig, should emit an error', function (done) {
        var brokenConfig = {};

        tunnel(brokenConfig).on('error', function (e) {
            expect(e).to.be.instanceOf(Error);
            done(null);
        });
    });
});
