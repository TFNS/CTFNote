var chai = require('chai');
var expect = chai.expect;
var createConfig = require('../lib/config');

describe('config', function () {
    it('use dstPort as localPort', function () {
        var config = {
            host: 'test.host', dstPort: 8000
        };
        expect(createConfig(config).localPort).to.be.equal(8000);
    });

    it('should emit an error', function () {
        var config = {
            host: 'remoteHost'
        };
        expect(createConfig.bind(null, config)).to.throw('dstPort not set');
    });

    it('throws an error if host is missing', function () {
        var config = {
            dstPort: 8000
        };
        expect(createConfig.bind(null, config)).to.throw('host not set');
    });
});

/*
 // Keep alive
 var configA = {
 host: '127.0.0.1',
 username: process.env.USER,
 dstPort: 8000,
 localPort: 7000,
 // Use keepAlive:true to keep the tunnel open.
 keepAlive: true
 };
 var tunnelKeepAlive = tunnel(configA, function() {
 console.log('Tunnel open');
 helper.createClient(7000, '127.0.0.1', console.log).on('close', function() {
 helper.createClient(7000, '127.0.0.1', console.log).on('close', function() {
 helper.createClient(7000, '127.0.0.1', console.log).on('close', function() {
 setTimeout(function() {
 // Call tunnel.close() to shutdown the server.
 console.log('TRYING TO CLOSE');
 tunnelKeepAlive.close();
 }, 2000);
 });
 });
 });
 }).on('error', function(e) {
 console.log('error', e);
 });
 });

 */
