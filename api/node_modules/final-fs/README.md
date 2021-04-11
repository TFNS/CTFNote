# Final-FS

**MIT License** (see LICENSE.txt)

Final-FS is an utility library for file system operations.
It wrapps nodejs "fs" module and provides it's functions in promise pattern.
Also it has few additional useful set of functions.
Every aynchrouns function in final-fs module uses [when](https://github.com/cujojs/when) Promises.

For example, checking file existance can be done with this code:

```js
var ffs = requtheire('final-fs');

ffs.exists('somefile.txt').then(function (exists) {
    if (exists) {
        console.log('The file really exists');
    } else {
        console.log('File somefile.txt does not exists');
    }
});
```

## Installation

    npm install final-fs

## Paths

All paths can be specified using array notation. If an array is given as an argument the path.resolved is called.

For example: `ffs.exists(path.resolve(__dirname, 'var', 'test'))` is same as `ffs.exists([__dirname, 'var', 'test'])`.

## Chaining

Final-FS uses [when](https://github.com/cujojs/when) library for async calls so there is no worry about the callback hell.

For example reading a file as a json, altering json object and saving it again would look like this:

```js
var ffs = require('final-fs'),
    path = require('path'),
    filePath = path.resolve(__dirname, 'data.json');

ffs.exists(filePath)
    .then(function (exists) {
        if (exists) {
            return ffs.readJSON(filePath);
        }
        return {};
    })
    .then(function (obj) {
        obj.hello = 'World!';
        return ffs.writeJSON(filePath, obj);
    })
    .then(function () {
        // file data.json is saved now
    })
    .otherwise(function (err) {
        // If something on this call chain went wrong then this function will catch it
    });
```

You can even return the result and chain further in another function. Look at the source code of rmdirRecursive function
to see how easy it is to work aysnchronous with files using Final-FS and [when](https://github.com/cujojs/when) library.

## Additional functions provided with final-fs

### rmdirRecursiveSync(dirPath:string) : void

Recusrise remove all directory contents. Synchronous version

###### Example: Remove ./tmp folder with it's contents.

```js
var ffs = require('final-fs'),
    path = require('path');

ffs.rmdirRecursiveSync(path.resolve(__dirname, 'tmp'));
// directory ./tmp is removed now
```

### rmdirRecursive(dirPath:string) : Promise

Recursively remove directory. Asynchronous version

###### Example: Remove ./tmp folder with it's contents

```js
var ffs = require('final-fs')
    path = require('path');

ffs.rmdirRecursive(path.resolve(__dirname, 'tmp'))
    .then(function () {
        // directory ./tmp is removed now
    })
    .otherwise(function (err) {
        // something went wrong
    });;
```

### writeJSON(filePath:string, obj:Object) : Promise

Convert obj into json string and write it to the file in the filePath

###### Example: Insert object into ./data.json file

```js
var ffs = require('final-fs')
    path = require('path'),
    obj = {foo: 'bar'}
    filePath = path.resolve(__dirname, 'data.json');

ffs.writeJSON(filePath, obj)
    .then(function () {
        // file data.json is written now
    })
    .otherwise(function(err) {
        // something went wrong. See err for details
    });
```

### readJSON(filePath:string) : Promise

Read file content and turn it into js object

###### Example: read file ./data.json and convert it into a js object.

```js
var ffs = require('final-fs'),
    path = require('path'),
    filePath = path.resolve(__dirname, 'data.json');

ffs.readJSON(filePath)
    .then(function (obj) {
        // obj is now an object build from data.json file content
    })
    .otherwise(function (err) {
        // something went wrong. See err for details
    });
```

### dirInfo(dirPath:string) : Promise

Returns an array of fs.Stat objects with additional filePath and fileName properties

###### Example

```js
var ffs = require('final-fs'),
    path = require('path'),
    dirPath = path.resolve(__dirname, 'var');

ffs.dirInfo(dirPath)
    .then(function (stats) {
        // stats is an array of fs.Stats objects with fileName and filePath properties
    })
    .otherwise(function (err) {
        // error
    });
```

### statAllSync(files:string[], rootPath?:string) : fs.Stats[]

returns a stat of every file provided in the list of files variable. 
If you provide rootPath then this rootPath will be merged with every file path in files var.

### dirFiles(dirPath:string) : Promise

Returns all the files from the directory.

###### Example

```js
var ffs = require('final-fs'),
    path = require('path'),
    dirPath = path.resolve(__dirname, 'var');

ffs.dirFiles(dirPath)
    .then(function (filesOnly) {
        // filesOnly is an array of directory files names
    })
    .otherwise(function (err) {
        // error
    });
```

### fileNameFilter(text:string) : string

Returns provided `text` as a file name valid string.

###### Example

```js
var ffs = require('final-fs');

var fileName = ffs.fileNameFilter('an Inv@lid t$xt');
// fileName is now: "an-invlid-txt"
```

## Node-fs module port

Final-FS uses [nodefs](https://github.com/bpedro/node-fs) module.
This module provides 2 functions:

- mkdir
- mkdirSync

Final-FS uses these 2 functions and wrappes mkdir asynchrouns function with a promise. It also changes their names:

- mkdir becomes `mkdirRecursive`
- mkdirSync becomes `mkdirRecursiveSync`

### mkdirRecursiveSync(path:string, ?mode:number=0777) : void

Synchronously creates a directory recursively.

###### Exmaple. Create directory ./var/tmp/tmp2, when directory ./var does not exists

```js
var ffs = require('final-fs'),
    path = require('path'),
    dirPath = path.resolve(__dirname, 'var', 'tmp', 'tmp2');

ffs.mkdirRecursiveSync(dirPath);
// now ./var/tmp/tmp2 directory is created
```

### mkdirRecursive(path:string, ?mode:number=0777) : Promise

Asynchronously creates a directory recursively.

###### Exmaple. Create directory ./var/tmp/tmp2, when directory ./var does not exists

```js
var ffs = require('final-fs'),
    path = require('path'),
    dirPath = path.resolve(__dirname, 'var', 'tmp', 'tmp2');

ffs.mkdirRecursiveSync(dirPath)
    .then(function () {
        // now ./var/tmp/tmp2 directory is created
    })
    .otherwise(function (err) {
        // something went wrong
    });
```

### readdirRecursive(directoryPath:string|Array, ?onlyFiles:boolean=false, ?rootPath='')

Read dir recursively.

You can set onlyFiles flag to true and no directory will be included as a Promise result

```js
var ffs = require('final-fs'),
    path = require('path'),
    dirPath = path.resolve(__dirname, 'var', 'tmp', 'tmp2');

ffs.readdirRecursive(dirPath, true, 'my/initial/path')
    .then(function (files) {
        // in files variable you got all the files
    })
    .otherwise(function (err) {
        // something went wrong
    });
```

### readdirRecursiveSync(directoryPath:string|Array, ?onlyFiles:boolean=false, ?rootPath='') : string[]

Synchronous version of `readdirRecursive`. Returns list of files

## Nodejs fs module functions

These functions work exatcly the same as in nodejs fs module However asynchrouns functions doesn't take any callbacks.
  Instead a Promise is returned.

The rule is simple:

- If callback tooked 2 arguments then error argument would be available in `otherwise` function and
the secound argument will be available in `then` function.
- If only one argument is provided and it's an error then `otherwise` function would have this argument as it's own.
- If only one argument is provided for the callback and it's not an error (for example the result of fs.exists function)
then this argument would be an argument for `then` function.

Ported functions are:

    rename(string, string) : Promise
    renameSync(string, string) : void
    ftruncate(number, number) : Promise
    ftruncateSync(number, number) : void
    truncate(string, number) : Promise
    truncateSync(string, number) : void
    chown(string, number, number) : Promise
    chownSync(string, number, number) : void
    fchown(number, number, number) : Promise
    fchownSync(number, number, number) : void
    lchown(string, number, number) : Promise
    lchownSync(string, number, number) : void
    chmod(string, number) : Promise
    chmodSync(string, number) : Promise
    fchmod(number, number) : Promise
    fchmodSync(number, number) : void
    lchmod(string, number) : Promise
    lchmodSync(string, number) : void
    stat(string) : Promise
    lstat(string) : Promise
    fstat(string) : Promise
    statSync(string) : fs.Stats
    lstatSync(string) : fs.Stats
    fstatSync(string) : fs.Stats
    link(string, string) : Promise
    linkSync(string, string) : void
    symlink(string, string, ?'dir'|'file'|'junction'='file') : Promise
    symlinkSync(string, string, ?'dir'|'file'|'junction'='file') : void
    readlink(string) : Promise
    readlinkSync(string) : string
    realpath(string, ?object=) : Promise
    realpathSync(string, ?object=) : string
    unlink(string) : Promise
    unlinkSync(string) : void
    rmdir(string) : Promise
    rmdirSync(string) : void
    mkdir(string, ?number=0777) : Promise
    mkdirSync(string, ?number=0777) : void
    readdir(string) : Promise
    readdirSync(string) : string[]
    close(number) : Promise
    closeSync(number) : void
    open(string, string, ?number=0666) : Promise
    openSync(string, string, ?number=0666) : void
    utimes(string, number, number) : Promise
    utimesSync(string, number, number) : void
    futimes(number, number, number) : Promise
    futimesSync(number, number, number) : void
    fsync(number) : Promise
    fsyncSync(number) : void
    write(number, Buffer, number, number, nbumber) : Promise
    writeSync(number, Buffer, number, number, nbumber) : number
    read(number, Buffer, number, number, number) : Promise
    readSync(number, Buffer, number, number, number) : number
    readFile(string, ?{?encoding:string=null, ?flag:string=r}=) : Promise
    readFileSync(string, ?{?encoding:string, ?flag:string}=) : Buffer|string
    writeFile(string, string|Buffer, ?{?encoding:string, ?mode:number, ?flag:string}=) : Promise
    writeFileSync(string, string|Buffer, ?{?encoding:string, ?mode:number, ?flag:string}=) : void
    appendFile(string, string|Buffer, ?{?encoding:string, ?mode:number, ?flag:string}=) : Promise
    appendFileSync(string, string|Buffer, ?{?encoding:string, ?mode:number, ?flag:string}=) : void
    watchFile(string, ?{persistent:boolean, interval:number}=, ?function(fs.Stats, fs.Stats)=) : void
    unwatchFile(string, function(fs.Stats, fs.Stats)) : void
    watch(string, ?{persistent:boolean, interval:number}=, ?function (string, string)) : fs.FSWatcher
    exists(string) : Promise
    existsSync(string) : boolean
    createReadStream(string, ?{flags:'r', encoding: null, fd: null, mode: 0666, bufferSize: 66020, autoClose: true}) : ReadStream
    createWriteStream(string, ?{flags: 'w', encoding: null, mode: 0666}=) : WriteStream
