'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _utils = require('../utils');

/**
 * An RFC 3339 compliant date-time scalar.
 *
 * Input:
 *    This scalar takes an RFC 3339 date-time string as input and
 *    parses it to a javascript Date.
 *
 * Output:
 *    This scalar serializes javascript Dates,
 *    RFC 3339 date-time strings and unix timestamps
 *    to RFC 3339 UTC date-time strings.
 */

/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

var config = {
  name: 'DateTime',
  description: 'A date-time string at UTC, such as 2007-12-03T10:15:30Z, ' + 'compliant with the `date-time` format outlined in section 5.6 of ' + 'the RFC 3339 profile of the ISO 8601 standard for representation ' + 'of dates and times using the Gregorian calendar.',
  serialize: function serialize(value) {
    if (value instanceof Date) {
      if ((0, _utils.validateJSDate)(value)) {
        return (0, _utils.serializeDateTime)(value);
      }
      throw new TypeError('DateTime cannot represent an invalid Date instance');
    } else if (typeof value === 'string' || value instanceof String) {
      if ((0, _utils.validateDateTime)(value)) {
        return (0, _utils.serializeDateTimeString)(value);
      }
      throw new TypeError('DateTime cannot represent an invalid date-time-string ' + value + '.');
    } else if (typeof value === 'number' || value instanceof Number) {
      if ((0, _utils.validateUnixTimestamp)(value)) {
        return (0, _utils.serializeUnixTimestamp)(value);
      }
      throw new TypeError('DateTime cannot represent an invalid Unix timestamp ' + value);
    } else {
      throw new TypeError('DateTime cannot be serialized from a non string, ' + 'non numeric or non Date type ' + JSON.stringify(value));
    }
  },
  parseValue: function parseValue(value) {
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new TypeError('DateTime cannot represent non string type ' + JSON.stringify(value));
    }

    if ((0, _utils.validateDateTime)(value)) {
      return (0, _utils.parseDateTime)(value);
    }
    throw new TypeError('DateTime cannot represent an invalid date-time-string ' + value + '.');
  },
  parseLiteral: function parseLiteral(ast) {
    if (ast.kind !== _graphql.Kind.STRING) {
      throw new TypeError('DateTime cannot represent non string type ' + String(ast.value != null ? ast.value : null));
    }
    var value = ast.value;

    if ((0, _utils.validateDateTime)(value)) {
      return (0, _utils.parseDateTime)(value);
    }
    throw new TypeError('DateTime cannot represent an invalid date-time-string ' + String(value) + '.');
  }
}; // eslint-disable-line
exports.default = new _graphql.GraphQLScalarType(config);