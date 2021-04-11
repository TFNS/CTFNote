Tunnel-SSH
==========

One to connect them all !

![Tunnel-SSH Logo](http://i.imgur.com/I5PRnDD.jpg)

Tunnel-ssh is based on the fantastic [ssh2](https://github.com/mscdex/ssh2) library by Brian White.
Trouble ? Please study the ssh2 configuration.

### Latest Relese 4.1.3

## Release notes
* Closing sshconnections correctly thx @actionshrimp
* Improved readme
* Updated modules

Special thanks to
@vweevers and @dickeyxxx


### Related projects
* [If you don't want to wrap a tunnel around your code: inject-tunnel-ssh](https://github.com/agebrock/inject-tunnel-ssh)
* [If you need it the other way around: reverse-tunnel-ssh](https://github.com/agebrock/reverse-tunnel-ssh)

### Integration
By default tunnel-ssh will close the tunnel after a client disconnects, so your cli tools should work in the same way, they do if you connect directly.
If you need the tunnel to stay open, use the "keepAlive:true" option within
the configuration.


```js

    var config = {
      ...
      keepAlive:true
    };

    var tnl = tunnel(config, function(error, tnl){
          yourClient.connect();
          yourClient.disconnect();
          setTimeout(function(){
            // you only need to close the tunnel by yourself if you set the
            // keepAlive:true option in the configuration !
            tnl.close();
          },2000);
      });

    // you can also close the tunnel from here...
    setTimeout(function(){
      tnl.close();
    },2000);

```


## Understanding the configuration

1. A local server listening for connections to forward via ssh
Description: This is where you bind your interface.
Properties:
** localHost (default is '127.0.0.1')
** localPort (default is dstPort)


2. The ssh configuration
Description: The host you want to use as ssh-tunnel server.
Properties:
** host
** port (22)
** username
** ...


3. The destination host configuration (based on the ssh host)
Imagine you just connected to The host you want to connect to. (via host:port)
now that server connects requires a target to tunnel to.
Properties:
** dstHost (localhost)
** dstPort


### Config example

```js

    var config = {
      username:'root',
      Password:'secret',
      host:sshServer,
      port:22,
      dstHost:destinationServer,
      dstPort:27017,
      localHost:'127.0.0.1',
      localPort: 27000
    };

    var tunnel = require('tunnel-ssh');
    tunnel(config, function (error, server) {
      //....
    });
```
#### Sugar configuration

tunnel-ssh assumes that you want to map the same port on a remote machine to your localhost using the ssh-server on the remote machine.


```js

    var config = {
      username:'root',
      dstHost:'remotehost.with.sshserver.com',
      dstPort:27017,
      privateKey:require(fs).readFileSync('/path/to/key'),
      passphrase:'secret'
    };

```

#### More configuration options
tunnel-ssh pipes the configuration direct into the ssh2 library so every config option provided by ssh2 still works.
[ssh2 configuration](https://github.com/mscdex/ssh2#client-methods)


#### catching errors:
```js
    var tunnel = require('tunnel-ssh');
    //map port from remote 3306 to localhost 3306
    var server = tunnel({host: '172.16.0.8', dstPort: 3306}, function (error, server) {
       if(error){
        //catch configuration and startup errors here.
       }
    });

    // Use a listener to handle errors outside the callback
    server.on('error', function(err){
        console.error('Something bad happened:', err);
    });
```
