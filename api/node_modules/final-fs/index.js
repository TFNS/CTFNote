/*jslint node:true*/
'use strict';

var fs = require('fs'),
    when = require('when'),
    sequence = require('when/sequence'),
    path = require('path'),
    resolve = path.resolve,
    nfs = require('node-fs'),
    ffs = exports;

// -----------------------------------------
// fs module
// -----------------------------------------

/**
 * @param {string|Array} oldPath
 * @param {string|Array} newPath
 * @returns {Promise}
 */
ffs.rename = function (oldPath, newPath) {
    var defer = when.defer();

    if (oldPath instanceof Array) {
        oldPath = resolve.apply(undefined, oldPath);
    }
    if (newPath instanceof Array) {
        newPath = resolve.apply(undefined, newPath);
    }

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} oldPath
 * @param {string|Array} newPath
 * @returns {undefined}
 */
ffs.renameSync = function (oldPath, newPath) {
    if (oldPath instanceof Array) {
        oldPath = resolve.apply(undefined, oldPath);
    }
    if (newPath instanceof Array) {
        newPath = resolve.apply(undefined, newPath);
    }

    return fs.renameSync(oldPath, newPath);
};

/**
 * @param {number} fd file descriptor
 * @param {number} len
 * @returns {Promise}
 */
ffs.ftruncate = function (fd, len) {
    var defer = when.defer();

    fs.ftruncate(fd, len, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};


/**
 * @tyep {function (number, number) : undefined }
 */
ffs.ftruncateSync = fs.ftruncateSync;

/**
 * @param {string|Array} path
 * @param {number} len
 * @returns {Promise}
 */
ffs.truncate = function (path, len) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.truncate(path, len, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @param {number} len
 * @returns {undefined}
 */
ffs.truncateSync = function (path, len) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.truncateSync(path, len);
};

/**
 * @param {string|Array} path
 * @param {number} uid
 * @param {number} gid
 * @returns {Promise}
 */
ffs.chown = function (path, uid, gid) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.chown(path, uid, gid, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @type {function (string, number, number) : void }
 */
ffs.chownSync = fs.chownSync;

/**
 * @param {string|Array} path
 * @param {number} uid
 * @param {number} gid
 * @returns {undefined}
 */
ffs.chownSync = function (path, uid, gid) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.chownSync(path, uid, gid);
};

/**
 * @param {number} fd file descriptor
 * @param {number} uid
 * @param {number} gid
 * @returns {Promise}
 */
ffs.fchown = function (fd, uid, gid) {
    var defer = when.defer();

    fs.fchown(fd, uid, gid, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @type {function (number, number, number) : void}
 */
ffs.fchownSync = fs.fchownSync;


/**
 * @param {string|Array} path
 * @param {number} uid
 * @param {number} gid
 * @returns {Promise}
 */
ffs.lchown = function (path, uid, gid) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.lchown(path, uid, gid, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @param {number} uid
 * @param {number} gid
 * @returns {undefined}
 */
ffs.lchownSync = function (path, uid, gid) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.lchownSync(path, uid, gid);
};

/**
 * @param {string|Array} path
 * @param {number} mode
 * @returns {Promise}
 */
ffs.chmod = function (path, mode) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.chmod(path, mode, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @param {number} mode
 * @returns {undefined}
 */
ffs.chmodSync = function (path, mode) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.chmodSync(path, mode);
};

/**
 * @param {number} fd file descriptor
 * @param {number} mode
 * @returns {Promise}
 */
ffs.fchmod = function (fd, mode) {
    var defer = when.defer();

    fs.fchmod(fd, mode, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @type {function (number, number) : void}
 */
ffs.fchmodSync = fs.fchmodSync;

/**
 * @param {string|Array} path
 * @param {number} mode
 * @returns {Promise}
 */
ffs.lchmod = function (path, mode) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.lchmod(path, mode, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @param {number} mode
 * @returns {undefined}
 */
ffs.lchmodSync = function (path, mode) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.lchmodSync(path, mode);
};

/**
 * @param {string|Array} path
 * @returns {Promise}
 */
ffs.stat = function (path) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.stat(path, function (err, status) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(status);
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @returns {Promise} resolved with fs.Stats object
 */
ffs.lstat = function (path) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.lstat(path, function (err, stats) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(stats);
        }
    });

    return defer.promise;
};

/**
 * @param {number} fd file descriptor
 * @returns {Promise} resolved with fs.Stats object
 */
ffs.fstat = function (fd) {
    var defer = when.defer();

    fs.fstat(fd, function (err, stats) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(stats);
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @returns {fs.Stats}
 */
ffs.statSync = function (path) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.statSync(path);
};

/**
 * @param {string|Array} path
 * @returns {fs.Stats}
 */
ffs.lstatSync = function (path) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.lstatSync(path);
};
/**
 * @type {function (string) : fs.Stats}
 */
ffs.fstatSync = fs.fstatSync;

/**
 * @param {string|Array} srcpath
 * @param {string|Array} dstpath
 * @returns {Promise}
 */
ffs.link = function (srcpath, dstpath) {
    var defer = when.defer();

    if (srcpath instanceof Array) {
        srcpath = resolve.apply(undefined, srcpath);
    }
    if (dstpath instanceof Array) {
        dstpath = resolve.apply(undefined, dstpath);
    }

    fs.link(srcpath, dstpath, function (err, stats) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(stats);
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} srcpath
 * @param {string|Array} dstpath
 * @returns {undefined}
 */
ffs.linkSync = function (srcpath, dstpath) {
    if (srcpath instanceof Array) {
        srcpath = resolve.apply(undefined, srcpath);
    }
    if (dstpath instanceof Array) {
        dstpath = resolve.apply(undefined, dstpath);
    }

    return fs.linkSync(srcpath, dstpath);
};

/**
 * @param {string|Array} srcpath
 * @param {string|Array} dstpath
 * @param {string} [type='file'] 'dir', 'file', or 'junction'
 * @returns {Promise}
 */
ffs.symlink = function (srcpath, dstpath, type) {
    var defer = when.defer();

    if (srcpath instanceof Array) {
        srcpath = resolve.apply(undefined, srcpath);
    }
    if (dstpath instanceof Array) {
        dstpath = resolve.apply(undefined, dstpath);
    }

    fs.symlink(srcpath, dstpath, type, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} srcpath
 * @param {string|Array} dstpath
 * @param {string} [type='file'] 'dir', 'file', or 'junction'
 * @returns {Promise}
 */
ffs.symlinkSync = function (srcpath, dstpath, type) {
    if (srcpath instanceof Array) {
        srcpath = resolve.apply(undefined, srcpath);
    }
    if (dstpath instanceof Array) {
        dstpath = resolve.apply(undefined, dstpath);
    }

    return fs.symlinkSync(srcpath, dstpath, type);
};

/**
 * @param {string|Array} path
 * @returns {Promise}
 */
ffs.readlink = function (path) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.readlink(path, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @returns {string}
 */
ffs.readlinkSync = function (path) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.readlinkSync(path);
};

/**
 * @param {string|Array} path
 * @param {Object} [cache] is an object literal of mapped paths that can be used to force a specific path resolution or avoid additional fs.stat calls for known real paths. (node docs)
 * @returns {Promise}
 */
ffs.realpath = function (path, cache) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.realpath(path, cache, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @param {Object} [cache] cache is an object literal of mapped paths that can be used to force a specific path resolution or avoid additional fs.stat calls for known real paths. (node docs)
 * @returns {string} the resolved path
 */
ffs.realpathSync = function (path, cache) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.realpathSync(path, cache);
};

/**
 * @param {string|Array} path
 * @returns {Promise}
 */
ffs.unlink = function (path) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.unlink(path, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @returns {undefined}
 */
ffs.unlinkSync = function (path) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.unlinkSync(path);
};

/**
 * @param {string|Array} path
 * @returns {Promise}
 */
ffs.rmdir = function (path) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.rmdir(path, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @returns {undefined}
 */
ffs.rmdirSync = function (path) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.rmdirSync(path);
};

/**
 * @param {string|Array} path
 * @param {number} [mode=0777]
 * @returns {Promise}
 */
ffs.mkdir = function (path, mode) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.mkdir(path, mode, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @param {number} [mode=0777]
 * @returns {undefined}
 */
ffs.mkdirSync = function (path, mode) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.mkdirSync(path, mode);
};

/**
 * @param {string|Array} path
 * @returns {Promise} that is resolved with array of file names excluding "." and ".."
 */
ffs.readdir = function (path) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.readdir(path, function (err, files) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(files);
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @returns {string[]}
 */
ffs.readdirSync = function (path) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.readdirSync(path);
};

/**
 * @param {number} fd file descriptor
 * @returns {Promise}
 */
ffs.close = function (fd) {
    var defer = when.defer();

    fs.close(fd, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @type {function (number) : undefined}
 */
ffs.closeSync = fs.closeSync;

/**
 * @param {string|Array} path
 * @param {string} flags
 * @param {number} [mode=0666]
 * @returns {Promise}
 */
ffs.open = function (path, flags, mode) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.open(path, flags, mode, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @param {string} flags
 * @param {number} [mode=0666]
 * @returns {undefined}
 */
ffs.openSync = function (path, flags, mode) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.openSync(path, flags, mode);
};

/**
 * @param {string|Array} path
 * @param {number} atime
 * @param {number} mtime
 * @returns {Promise}
 */
ffs.utimes = function (path, atime, mtime) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.utimes(path, atime, mtime, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @param {number} atime
 * @param {number} mtime
 * @returns {undefined}
 */
ffs.utimesSync = function (path, atime, mtime) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.utimesSync(path, atime, mtime);
};

/**
 * @param {number} fd file descriptor
 * @param {number} atime
 * @param {number} mtime
 * @returns {Promise}
 */
ffs.futimes = function (fd, atime, mtime) {
    var defer = when.defer();

    fs.futimes(fd, atime, mtime, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @type {function (number, number, number) : void}
 */
ffs.futimesSync = fs.futimesSync;

/**
 * @param {number} fd file descriptor
 * @returns {Promise}
 */
ffs.fsync = function (fd) {
    var defer = when.defer();

    fs.fsync(fd, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @type {function (number) : void}
 */
ffs.fsyncSync = fs.fsyncSync;

/**
 * @param {number} fd file descriptor
 * @param {Buffer} buffer
 * @param {number} offset
 * @param {number} length
 * @param {number} position
 * @returns {Promise}
 */
ffs.write = function (fd, buffer, offset, length, position) {
    var defer = when.defer();

    fs.write(fd, buffer, offset, length, position, function (err, written, buffer) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve({written: written, buffer: buffer});
        }
    });

    return defer.promise;
};

/**
 * @type {function (number, Buffer, number, number, nbumber) : number}
 */
ffs.writeSync = fs.writeSync;

/**
 * @param {number} fd file descriptor
 * @param {number} buffer
 * @param {number} offset
 * @param {number} length
 * @param {number} position
 * @returns {Promise} resolved with object: {bytesRead, buffer}
 */
ffs.read = function (fd, buffer, offset, length, position) {
    var defer = when.defer();

    fs.read(fd, buffer, offset, length, position, function (err, bytesRead, buffer) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve({bytesRead: bytesRead, buffer: buffer});
        }
    });

    return defer.promise;
};

/**
 * @type {function (number, Buffer, number, number, number) : number}
 */
ffs.readSync = fs.readSync;

/**
 * @param {string|Array} path
 * @param {object} [options={}]
 * @param {string} [options.encoding=null]
 * @param {string} [options.flag='r']
 * @returns {Promise} resolved with read data
 */
ffs.readFile = function (path, options) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.readFile(path, options, function (err, data) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(data);
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @param {object} [options={}]
 * @param {string} [options.encoding=null]
 * @param {string} [options.flag='r']
 * @returns {string|Buffer}
 */
ffs.readFileSync = function (path, options) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.readFileSync(path, options);
};

/**
 * @param {string|Array} path
 * @param {string|Buffer} data
 * @param {Object} [options]
 * @param {string|null} [options.encoding='utf-8']
 * @param {number} [options.mode=0666]
 * @param {string} [options.flag='w']
 * @returns {Promise}
 */
ffs.writeFile = function (path, data, options) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.writeFile(path, data, options, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @param {string|Buffer} data
 * @param {Object} [options]
 * @param {string|null} [options.encoding='utf-8']
 * @param {number} [options.mode=0666]
 * @param {string} [options.flag='w']
 * @returns {undefined}
 */
ffs.writeFileSync = function (path, data, options) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.writeFileSync(path, data, options);
};

/**
 * @param {string|Array} path
 * @param {string|Buffer} data
 * @param {Object} [options]
 * @param {string|null} [options.encoding='utf-8']
 * @param {number} [options.mode=0666]
 * @param {string} [options.flag='a']
 * @returns {Promise}
 */
ffs.appendFile = function (path, data, options) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.appendFile(path, data, options, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @param {string|Buffer} data
 * @param {Object} [options]
 * @param {string|null} [options.encoding='utf-8']
 * @param {number} [options.mode=0666]
 * @param {string} [options.flag='a']
 * @returns {undefined}
 */
ffs.appendFileSync = function (path, data, options) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.appendFileSync(path, data, options);
};

/**
 * @param {string|Array} path
 * @param {Object} [options]
 * @param {boolean} [options.persistent=true]
 * @param {number} [options.interval=5007]
 * @param {function(fs.Stats, fs.Stats)} listener
 * @returns {undefined}
 */
ffs.watchFile = function (path, options, listener) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.watchFile(path, options, listener);
};

/**
 * @param {string|Array} path
 * @param {function(fs.Stats, fs.Stats)} listener
 * @returns {undefined}
 */
ffs.unwatchFile = function (path, listener) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.unwatchFile(path, listener);
};

/**
 * @param {string|Array} path
 * @param {Object} [options]
 * @param {boolean} [options.persistent=true]
 * @param {function(fs.Stats, fs.Stats)} listener
 * @returns {undefined}
 */
ffs.watch = function (path, options, listener) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.watch(path, options, listener);
};

/**
 * @param {string|Array} path
 * @returns {Promise} resolved with boolean
 */
ffs.exists = function (path) {
    var defer = when.defer();

    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    fs.exists(path, function (exists) {
        defer.resolve(exists);
    });

    return defer.promise;
};

/**
 * @param {string|Array} path
 * @returns {boolean}
 */
ffs.existsSync = function (path) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.existsSync(path);
};

/**
 * @param {string|Array} path
 * @param {Object} [options]
 * @param {string} [options.flags='r']
 * @param {string|null} [options.encoding=null]
 * @param {number|null} [options.fd=null]
 * @param {number} [options.bufferSize=66020]
 * @param {boolean} [options.autoClose=true]
 * @returns {ReadStream}
 */
ffs.createReadStream = function (path, options) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.createReadStream(path, options);
};

/**
 * @param {string|Array} path
 * @param {Object} [options]
 * @param {string} [options.flags='r']
 * @param {string|null} [options.encoding=null]
 * @param {number} [options.mode=0666]
 * @returns {WriteStream}
 */
ffs.createWriteStream = function (path, options) {
    if (path instanceof Array) {
        path = resolve.apply(undefined, path);
    }

    return fs.createWriteStream(path, options);
};

// -----------------------------------------
// node-fs module
// -----------------------------------------

/**
 * @param {string|Array} dirPath
 * @param {number} mode
 * @returns {Promise}
 */
ffs.mkdirRecursive = function (dirPath, mode) {
    var defer = when.defer();

    if (dirPath instanceof Array) {
        dirPath = resolve.apply(undefined, dirPath);
    }

    mode = mode || 0x1ff; //0777

    nfs.mkdir(dirPath, mode, true, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });

    return defer.promise;
};

/**
 * @param {string|Array} dirPath
 * @param {number} mode
 * @returns {undefined}
 */
ffs.mkdirRecursiveSync = function (dirPath, mode) {
    if (dirPath instanceof Array) {
        dirPath = resolve.apply(undefined, dirPath);
    }

    return nfs.mkdirSync(dirPath, mode, true);
};

// -----------------------------------------
// final-fs functions
// -----------------------------------------

/**
 * @param {string|Array} fromPath
 * @param {string|Array} toPath
 * @returns {Promise}
 */
ffs.copy = function (fromPath, toPath) {
    var writeStream, readStream, defer;

    defer = when.defer();

    try {
        if (fromPath instanceof Array) {
            fromPath = resolve.apply(undefined, fromPath);
        }

        if (toPath instanceof Array) {
            toPath = resolve.apply(undefined, toPath);
        }

        readStream = ffs.createReadStream(fromPath);
        writeStream = ffs.createWriteStream(toPath);

        readStream.on('error', function (err) {
            defer.reject(err);
        });

        writeStream.on('error', function (err) {
            defer.reject(err);
        });

        writeStream.on('close', function () {
            defer.resolve();
        });

        readStream.pipe(writeStream);
    } catch (e) {
        defer.reject(e);
    }

    return defer.promise;
};

/**
 * Recusrise remove all directory contents
 *
 * @param {string|Array} dirPath
 */
ffs.rmdirRecursiveSync = function (dirPath) {
    var files;

    if (dirPath instanceof Array) {
        dirPath = resolve.apply(undefined, dirPath);
    }

    try {
        files = fs.readdirSync(dirPath);
    }
    catch (e) {
        return;
    }
    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (ffs.statSync(filePath).isFile()) {
                ffs.unlinkSync(filePath);
            } else {
                ffs.rmdirRecursiveSync(filePath);
            }
        }
    }
    ffs.rmdirSync(dirPath);
};

/**
 * Removes directory with its contents. Async style.
 *
 * @param {string|Array} dirPath
 * @returns {Promise}
 */
ffs.rmdirRecursive = function (dirPath) {
    if (dirPath instanceof Array) {
        dirPath = resolve.apply(undefined, dirPath);
    }

    return ffs.readdir(dirPath).then(function (files) {
        return when.map(files,
            function removeOrProceed(file) {
                var filePath = resolve(dirPath, file);

                return ffs.stat(filePath).then(function (stat) {
                    if (stat.isFile()) {
                        return ffs.unlink(filePath);
                    } else if (stat.isDirectory()) {
                        return ffs.rmdirRecursive(filePath);
                    } else {
                        throw new Error('Wrong file type ' + filePath);
                    }
                });
            })
            .then(function () {
                return ffs.rmdir(dirPath); //remove self
            });
    });
};

/**
 * Convert obj into json string and write it to the file in the filePath
 *
 * @param {string|Array} filePath
 * @param {Object} obj
 * @returns {Promise}
 */
ffs.writeJSON = function (filePath, obj) {
    if (filePath instanceof Array) {
        filePath = resolve.apply(undefined, filePath);
    }

    return ffs.writeFile(filePath, JSON.stringify(obj, null, '    '), {encoding: 'utf-8'});
};

/**
 * @param {string|Array} filePath
 * @param {*} obj
 * @returns {undefined}
 */
ffs.writeJSONSync = function (filePath, obj) {
    if (filePath instanceof Array) {
        filePath = resolve.apply(undefined, filePath);
    }

    return ffs.writeFileSync(filePath, JSON.stringify(obj, null, '    '), {encoding: 'utf-8'});
};

/**
 * Read file content and turn it into js object
 *
 * @param {string|Array} filePath
 * @returns {Promise}
 */
ffs.readJSON = function (filePath) {
    if (filePath instanceof Array) {
        filePath = resolve.apply(undefined, filePath);
    }

    return ffs.readFile(filePath, {encoding: 'utf-8'}).then(function (result) {
        return JSON.parse(result);
    });
};

/**
 * @param {string|Array} filePath
 * @returns {*}
 */
ffs.readJSONSync = function (filePath) {
    if (filePath instanceof Array) {
        filePath = resolve.apply(undefined, filePath);
    }

    return JSON.parse(ffs.readFileSync(filePath, {encoding: 'utf-8'}));
};

/**
 * Returns an array of fs.Stat objects with additional filePath and fileName properties
 *
 * @param {string|Array} directoryPath
 * @returns {fs.Stat[]}
 */
ffs.dirInfo = function (directoryPath) {
    if (directoryPath instanceof Array) {
        directoryPath = resolve.apply(undefined, directoryPath);
    }

    return ffs.readdir(directoryPath).then(function (files) {
        var functions = [];
        files.forEach(function (file) {
            var filePath = resolve(directoryPath, file);
            functions.push(function () {
                return ffs.stat(filePath).then(function (stat) {
                    stat.filePath = filePath;
                    stat.fileName = file;
                    return stat;
                });
            });
        });

        return sequence(functions);
    });
};

ffs.statAllSync = function (files, rootPath) {
    rootPath = rootPath || '';

    return files.map(function (file) {
        var fPath = path.join(rootPath, file);
        var s = ffs.statSync(fPath);
        s.filePath = fPath;
        s.fileName = file;
        return s;
    });
};

/**
 * Returns all the files from the directory.
 *
 * @param {string|Array} directoryPath
 * @returns {Promise}
 */
ffs.dirFiles = function (directoryPath) {
    if (directoryPath instanceof Array) {
        directoryPath = resolve.apply(undefined, directoryPath);
    }

    return ffs.dirInfo(directoryPath).then(function (files) {
        return files
            .filter(function (file) {
                return file.isFile();
            })
            .map(function (file) {
                return file.fileName;
            });
    });
};

/**
 * Recursively reads directory
 *
 * @param {string|Array} directoryPath
 * @param {boolean} [onlyFiles=false] include directories in output?
 * @param {string} [rootPath=''] prefix for every output file
 * @returns {Promise}
 */
ffs.readdirRecursive = function (directoryPath, onlyFiles, rootPath) {
    var merged;

    if (directoryPath instanceof Array) {
        directoryPath = resolve.apply(undefined, directoryPath);
    }

    rootPath = rootPath || '';
    merged = onlyFiles ? [] : [rootPath];

    return ffs.dirInfo(directoryPath)
        .then(function (items) {
            var functions = [];
            items.forEach(function (item) {
                var newRootPath = rootPath ? rootPath + '/' + item.fileName : item.fileName;
                functions.push(function () {
                    if (item.isDirectory()) {
                        return ffs.readdirRecursive([directoryPath, item.fileName], onlyFiles, newRootPath);
                    }
                    return newRootPath;
                });
            });

            return sequence(functions);
        })
        .then(function (result) {
            merged = merged.concat.apply(merged, result);
            return merged;
        })
};

/**
 * Recursively reads directory
 *
 * @param {string|Array} directoryPath
 * @param {boolean} [onlyFiles=false] include directories in output?
 * @param {string} [rootPath=''] prefix for every output file
 * @returns {Promise}
 */
ffs.readdirRecursiveSync = function (directoryPath, onlyFiles, rootPath) {
    var files = [];
    rootPath = rootPath || '';

    if (directoryPath instanceof Array) {
        directoryPath = resolve.apply(undefined, directoryPath);
    }

    ffs.readdirSync(directoryPath).forEach(function (file) {
        var fileFullPath = path.resolve(directoryPath, file);
        var stat = ffs.statSync(fileFullPath);


        if (stat.isDirectory()) {
            var result = ffs.readdirRecursiveSync(fileFullPath, onlyFiles, path.join(rootPath, file));
            files = files.concat(result);
        }

        if (stat.isFile() || !onlyFiles) {
            files.push(path.join(rootPath, file));
        }
    });

    return files;
};




ffs.fileNameFilterStripRegExp = /[^\w\s-]/g;
ffs.fileNameFilterHyphenateRegExp = /[-\s]+/g;

function filePartFiler(text) {
    return text
        .replace(ffs.fileNameFilterStripRegExp, '')
        .trim()
        .toLowerCase()
        .replace(ffs.fileNameFilterHyphenateRegExp, '-');
}

/**
 * Returns provided `text` as a file name valid string
 *
 * @param {string} text
 * @returns {string}
 */
ffs.fileNameFilter = function slugify(text) {
    var extension = path.extname(text),
        baseName = path.basename(text, extension),
        filteredName;

    filteredName = filePartFiler(baseName);
    extension = filePartFiler(extension);

    if (extension) {
        filteredName += '.' + extension;
    }

    return filteredName;
};


