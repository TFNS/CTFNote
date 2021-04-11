var tunnel = require('../');
var helper = require('./server');


/**
make sure you can connect to your own machine with the current user without password.
Example:  ssh $USER@127.0.0.1

Remember to add your privateKey to your ssh-agent (ssh-add)
**/

var config = {
    host: '127.0.0.1', username: process.env.USER, dstPort: 8000, localPort: 7000
};

var fakeServer = helper.createServer(config.dstPort, '127.0.0.1', function () {
    tunnel(config, function () {
        console.log('Tunnel open');
        helper.createClient(7000, '127.0.0.1', console.log);
        helper.createClient(7000, '127.0.0.1', console.log);
    }).on('error', function (e) {
        console.log('error', e);
    });
});

fakeServer.unref();
