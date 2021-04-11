/*jshint node:true*/
/*global describe, it, beforeEach, afterEach, expect, jasmine, waitsFor, runs*/

'use strict';

var ffs = require('../index.js'),
    fs = require('fs');


describe('ffs', function () {

    var dir = __dirname + '/var';

    beforeEach(function () {
        fs.mkdirSync(dir);
        fs.mkdirSync(dir + '/test1');
        fs.mkdirSync(dir + '/test2');
        fs.writeFileSync(dir + '/test1/ttt.txt', 'TEST');
        fs.writeFileSync(dir + '/test1/ttt2.txt', 'TEST2');
        fs.writeFileSync(dir + '/test2/ttt3.txt', 'abc');
        fs.writeFileSync(dir + '/test2/ttt4.txt', 'abc2');
    });

    afterEach(function () {
        ffs.rmdirRecursiveSync(dir);
    });

    it('readdir', function () {
        var done = false,
            files;

        ffs.readdir(dir).then(function (result) {
            done = true;
            files = result;
        });

        waitsFor(function () {
            return done;
        }, 'readdir', 100);

        runs(function () {
            expect(files.indexOf('test1')).not.toBe(-1);
            expect(files.indexOf('test2')).not.toBe(-1);
        });
    });

    it('unlink', function () {
        var done = false;

        ffs.unlink(dir + '/test1/ttt.txt').then(function () {
            done = true;
        });

        waitsFor(function () {
            return done;
        }, 'unlink', 100);

        runs(function () {
            expect(fs.existsSync(dir + '/test1/ttt.txt')).toBeFalsy();
        });
    });

    it('rmdirRecursive', function () {
        var done = false;

        ffs.rmdirRecursive(dir).then(function () {
            done = true;
        }, function (err) {
            console.log(err);
            console.log(err.stack);
            console.log('WRONG!');
        });

        waitsFor(function () {
            return done;
        }, 'recursiveRmDir', 100);

        runs(function () {
            expect(fs.existsSync(dir)).toBeFalsy();
        });
    });

    it('dirInfo', function () {
        var dirInfo;

        ffs.dirInfo(__dirname + '/var').then(function (result) {
            dirInfo = result;
        });

        waitsFor(function () {
            return dirInfo !== undefined;
        }, 'dirInfo', 100);

        runs(function () {
            expect(dirInfo.length).toBe(2);
            expect(dirInfo[0].filePath).toBeDefined();
            expect(dirInfo[0].fileName).toBeDefined();
            expect(dirInfo[1].filePath).toBeDefined();
            expect(dirInfo[1].fileName).toBeDefined();
            expect(function () {
                dirInfo[0].isDirectory();
            }).not.toThrow();
            expect(dirInfo[1].isDirectory()).toBeTruthy();
        });
    });

    it('dirFiles', function () {
        var dir1 = __dirname + '/var',
            dir2 = __dirname + '/var/test1',
            dir1Files,
            dir2Files;

        ffs.dirFiles(dir1).then(function (files) {
            dir1Files = files;
        });

        ffs.dirFiles(dir2).then(function (files) {
            dir2Files = files;
        });

        waitsFor(function () {
            return dir1Files !== undefined && dir2Files !== undefined;
        }, 'dirFiles', 100);

        runs(function () {
            expect(dir1Files.length).toBe(0);
            expect(dir2Files.length).toBe(2);
            expect(dir2Files.indexOf('ttt.txt')).not.toBe(-1);
            expect(dir2Files.indexOf('ttt2.txt')).not.toBe(-1);
        });
    });


    it('stat', function () {
        var stat;

        ffs.stat(__dirname + '/var').then(function (result) {
            stat = result;
        });

        waitsFor(function () {
            return stat !== undefined;
        }, 'stat', 100);

        runs(function () {
            expect(stat.isDirectory()).toBeTruthy();
        });
    });

    it('rmdir', function () {
        var done = false;

        fs.mkdirSync(__dirname + '/var2');

        ffs.rmdir(__dirname + '/var2').then(function () {
            done = true;
        });

        waitsFor(function () {
            return done;
        }, 'rmdir', 100);

        runs(function () {
            expect(fs.existsSync(__dirname + '/var2')).not.toBeTruthy();
        });
    });

    it('unlink', function () {
        var done = false,
            filePath = __dirname + '/var/file.tmp';

        fs.writeFileSync(filePath, 'aaa');

        ffs.unlink(filePath).then(function () {
            done = true;
        });

        waitsFor(function () {
            return done;
        }, 'unlink', 100);

        runs(function () {
            expect(fs.existsSync(filePath)).not.toBeTruthy();
        });
    });

    it('readdir', function () {
        var content;

        ffs.readdir(__dirname + '/var').then(function (result) {
            content = result;
        });

        waitsFor(function () {
            return content !== undefined;
        }, 'readdir', 100);

        runs(function () {
            expect(content.indexOf('test1')).not.toBe(-1);
            expect(content.indexOf('test2')).not.toBe(-1);
        });
    });

    it('readJSON', function () {
        var obj = {
                foo: 'bar'
            },
            resultObject;

        ffs.writeFileSync(__dirname + '/var/foo.json', JSON.stringify(obj), {encoding: 'utf-8'});

        ffs.readJSON(__dirname + '/var/foo.json').then(function (result) {
            resultObject = result;
        });

        waitsFor(function () {
            return resultObject !== undefined;
        }, 'readJSON', 100);

        runs(function () {
            expect(resultObject.foo).toBe(obj.foo);
        });
    });

    it('copy', function () {
        var dir = __dirname + '/var',
            done = false;

        ffs.writeFileSync(dir + '/file.txt', 'test', {encoding: 'utf-8'});

        ffs.copy(dir + '/file.txt', dir + '/copy.txt')
            .then(function () {
                done = true;
            });

        waitsFor(function () {
            return done;
        });

        runs(function () {
            expect(ffs.readFileSync(dir + '/copy.txt', {encodign: 'utf-8'}).toString()).toBe('test');
        });

    });

    it('readdirRecursive with directories', function () {
        var items;

        ffs.readdirRecursive(dir)
            .then(function (result) {
                items = result;
            })
            .otherwise(function (err) {
                console.log(err.stack);
            });

        waitsFor(function () {
            return items !== undefined;
        }, 100);

        runs(function () {
            expect(items.length).toBe(7);
        })
    });

    it('readdirRecursive only files', function () {
        var items;

        ffs.readdirRecursive(dir, true)
            .then(function (result) {
                items = result;
            })
            .otherwise(function (err) {
                console.log(err.stack);
            });

        waitsFor(function () {
            return items !== undefined;
        }, 100);

        runs(function () {
            expect(items.length).toBe(4);
        })
    });

    it('readdirRecursiveSync', function () {
        var files = ffs.readdirRecursiveSync(dir);
        expect(files.length).toBe(6);
    });

    it('readdirRecursiveSync only files', function () {
        var files = ffs.readdirRecursiveSync(dir, true);
        expect(files.length).toBe(4);
    });

    it('statAllSync', function () {
        var files;
        var stats;
        expect(function () {
            files = ffs.readdirRecursiveSync(dir, true);
            stats = ffs.statAllSync(files, dir);
        }).not.toThrow();
        expect(stats.length).toBe(4);
        expect(stats[0] instanceof fs.Stats).toBeTruthy();
        expect(stats[0].filePath).toBe(dir + '/test1/ttt.txt');
        expect(stats[0].fileName).toBe('test1/ttt.txt');
    });

});
