const events = require('events');
const sshClient = require('ssh2');
const net = require('net');
const debug = require('debug')('tunnel-ssh');
const createConfig = require('./lib/config');

class Tunnel extends events.EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        // Expose sshClient for external event-bindings
        // @TODO exclude into separate util function
        this.sshClient = sshClient();
        this.sshClient.promise = new Promise((resolve, reject) => {
            this.sshClient
                .on('ready', () => resolve(this.sshClient))
                .on('error', error => reject(error))
                .connect(config);
        });
    }

    /**
     * Creates a dublex stream
     * @returns {Promise.<Stream>}
     */
    getStream(srcHost, srcPort, dstHost, dstPort) {
        // @todo implement old behavior "create a new client for every connection"
        return this.sshClient.promise.then(client => {
            return new Promise((resolve, reject) => {
                return client.forwardOut(
                    srcHost,
                    srcPort,
                    dstHost,
                    dstPort, (error, sshConnection) => {
                        if (error) {
                            this.emit('error', error);
                            return reject(error);
                        }
                        return resolve(sshConnection);
                    });
            });
        });
    }

    /**
     * Creates a tcp server as entry point for the ssh tunnel,
     * every incoming tcp connection is piped to the tunnel.
     * @returns {Promise.<net.Server>}
     */
    listen(port, addr, srcHost, srcPort, dstHost, dstPort) {
        let server = net.createServer();
        server.promise = new Promise((resolve, reject) => {
            server.on('listening', () => resolve(server));
            server.on('error', error => reject(error));
        });

        server.promise.catch(e => {
            this.emit('error', e);
        });

        server.on('connection', tcpConnection => {
            this.getStream(srcHost, srcPort, dstHost, dstPort).then(sshConnection => {
                debug('sshConnection:create');
                this.emit('sshConnection', sshConnection);
                if (this.config.exitOnLastConnectionEnd === true) {
                    tcpConnection.on('close', () => server.getConnections((error, count) => {
                        if (error) {
                            this.emit('error', error);
                        }
                        debug('ConnectionCount => ' + count);
                        if (count === 0) {
                            server.close();
                        }
                    }));
                }
                tcpConnection.pipe(sshConnection).pipe(tcpConnection);
                sshConnection.on('end', () => console.log('ssh-connection end'));
                sshConnection.on('close', () => console.log('ssh-connection close'));
            }).catch(error => this.emit('error', error));
        });

        server.on('close', () => {
            debug('server::close');
            this.sshClient.end();
        });

        return this.sshClient.promise.then(() => {
            server.listen(port, addr);
            return server;
        }).catch(error => this.emit('error', error));
    }
}

function tunnel(rawConfig) {
    let config = createConfig(rawConfig);

    let tnl = new Tunnel(config);
    tnl.listen(
        config.bindPort,
        config.bindAddr,
        config.srcHost,
        config.srcPort,
        config.dstHost,
        config.dstPort
    ).then(server => {
        server.on('listening', function () {
            console.log('listening');
        });
    }).catch(error => this.emit('error', error));

    Promise.all(config.ports.map(port => {
        return tnl.listen(
            port,
            config.bindAddr,
            config.srcHost,
            config.srcPort,
            config.dstHost,
            port
        );
    })).then(() => console.log('done')).catch(error => console.log(error))

    return tnl;
}
/*
 var http = require('http');
 var s = http.createServer(function (req, res) {
 res.setHeader('Content-Type', 'text/html');
 res.setHeader('X-Foo', 'bar');
 res.writeHead(200, {'Content-Type': 'text/plain'});
 res.write('foo');
 res.end('ok');
 });
 s.listen(7000);
 s.unref();
 */
tunnel({
    host: 'pi', user: 'pi', passphrase: '*gold12', dstPort: 8080, bindPort: 8082, ports: [8081]
}).on('error', error => console.log(error));
