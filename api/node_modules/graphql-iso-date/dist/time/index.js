'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _utils = require('../utils');

/**
 * An RFC 3339 compliant time scalar.
 *
 * Input:
 *    This scalar takes an RFC 3339 time string as input and
 *    parses it to a javascript Date (with a year-month-day relative
 *    to the current day).
 *
 * Output:
 *    This scalar serializes javascript Dates and
 *    RFC 3339 time strings to RFC 3339 UTC time strings.
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
  name: 'Time',
  description: 'A time string at UTC, such as 10:15:30Z, compliant with ' + 'the `full-time` format outlined in section 5.6 of the RFC 3339' + 'profile of the ISO 8601 standard for representation of dates and ' + 'times using the Gregorian calendar.',
  serialize: function serialize(value) {
    if (value instanceof Date) {
      if ((0, _utils.validateJSDate)(value)) {
        return (0, _utils.serializeTime)(value);
      }
      throw new TypeError('Time cannot represent an invalid Date instance');
    } else if (typeof value === 'string' || value instanceof String) {
      if ((0, _utils.validateTime)(value)) {
        return (0, _utils.serializeTimeString)(value);
      }
      throw new TypeError('Time cannot represent an invalid time-string ' + value + '.');
    } else {
      throw new TypeError('Time cannot be serialized from a non string, ' + 'or non Date type ' + JSON.stringify(value));
    }
  },
  parseValue: function parseValue(value) {
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new TypeError('Time cannot represent non string type ' + JSON.stringify(value));
    }

    if ((0, _utils.validateTime)(value)) {
      return (0, _utils.parseTime)(value);
    }
    throw new TypeError('Time cannot represent an invalid time-string ' + value + '.');
  },
  parseLiteral: function parseLiteral(ast) {
    if (ast.kind !== _graphql.Kind.STRING) {
      throw new TypeError('Time cannot represent non string type ' + String(ast.value != null ? ast.value : null));
    }
    var value = ast.value;
    if ((0, _utils.validateTime)(value)) {
      return (0, _utils.parseTime)(value);
    }
    throw new TypeError('Time cannot represent an invalid time-string ' + String(value) + '.');
  }
}; // eslint-disable-line
exports.default = new _graphql.GraphQLScalarType(config);