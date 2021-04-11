# DATABASE_URL parser for node.js

[![Build Status](https://travis-ci.org/pwnall/node-parse-database-url.svg)](https://travis-ci.org/pwnall/node-parse-database-url)
[![NPM Version](http://img.shields.io/npm/v/parse-database-url.svg)](https://www.npmjs.org/package/parse-database-url)

This is an [npm](https://npmjs.org/) package that parses database
configurations passed in as URLs. This is typically useful in Heroku
deployments, where the database configuration is given in the `DATABASE_URL`
environment variable.


## Supported Platforms

This library is tested against the following platforms.

* [node.js](http://nodejs.org/) 0.6
* [node.js](http://nodejs.org/) 0.8
* [node.js](http://nodejs.org/) 0.10

Keep in mind that the versions above are not hard requirements.


## Installation and Usage

The preferred installation method is to add the library to the `dependencies`
section in your `package.json`.

```json
{
  "dependencies": {
    "parse-database-url": "*"
  }
}
```

Alternatively, `npm` can be used to install the library directly.

```bash
npm install parse-database-url
```

Once the library is installed, `require`-ing it returns the function that
parses URLs.

```javascript
var parseDbUrl = require("parse-database-url");
```

And you can use that to parse URLs :)

```javascript
var dbConfig = parseDbUrl(process.env["DATABASE_URL"]);
```


## Development

The library comes with unit tests. Please make sure they pass before submitting
a pull request.

```bash
npm install
npm test
```

If you modify the parser, please add test cases showing your changes to
[test/parse_cases.json](test/parse_cases.json).


## Copyright and License

The library is Copyright (c) 2013 Victor Costan, and distributed under the MIT
License.
