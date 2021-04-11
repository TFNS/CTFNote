var tunnel = require('../');
var helper = require('./server');

// Keep alive example
// this example demonstrates the keepAlive option.
// keepAlive will reuse the connections
// note the "tunnelKeepAlive.close();" at the end.
// this step is required to finish execution nicely

var configA = {
    host: '127.0.0.1',
    username: process.env.USER,
    dstPort: 8000,
    localPort: 7000, // Use keepAlive:true to keep the tunnel open.
    keepAlive: true
};
var tunnelKeepAlive = tunnel(configA, function () {
    console.log('Tunnel open');
    helper.createClient(7000, '127.0.0.1', console.log);
    helper.createClient(7000, '127.0.0.1', console.log);
    helper.createClient(7000, '127.0.0.1', console.log).on('close', function () {
        helper.createClient(7000, '127.0.0.1', console.log).on('close', function () {
            helper.createClient(7000, '127.0.0.1', console.log).on('close', function () {
                setTimeout(function () {
                    // Call tunnel.close() to shutdown the server.
                    console.log('TRYING TO CLOSE');
                    tunnelKeepAlive.close();
                }, 2000);
            });
        });
    });
}).on('error', function (e) {
    console.log('error', e);
});

