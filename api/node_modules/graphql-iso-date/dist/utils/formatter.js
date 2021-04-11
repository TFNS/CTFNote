'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// Parses an RFC 3339 compliant time-string into a Date.
// It does this by combining the current date with the time-string
// to create a new Date instance.
//
// Example:
// Suppose the current date is 2016-01-01, then
// parseTime('11:00:12Z') parses to a Date corresponding to
// 2016-01-01T11:00:12Z.
var parseTime = exports.parseTime = function parseTime(time) {
  var currentDateString = new Date().toISOString();
  return new Date(currentDateString.substr(0, currentDateString.indexOf('T') + 1) + time);
};

// Serializes a Date into an RFC 3339 compliant time-string in the
// format hh:mm:ss.sssZ.
var serializeTime = exports.serializeTime = function serializeTime(date) {
  var dateTimeString = date.toISOString();
  return dateTimeString.substr(dateTimeString.indexOf('T') + 1);
};

// Serializes an RFC 3339 compliant time-string by shifting
// it to UTC.
var serializeTimeString = exports.serializeTimeString = function serializeTimeString(time) {
  // If already formatted to UTC then return the time string
  if (time.indexOf('Z') !== -1) {
    return time;
  } else {
    // These are time-strings with timezone information,
    // these need to be shifted to UTC.

    // Convert to UTC time string in
    // format hh:mm:ss.sssZ.
    var date = parseTime(time);
    var timeUTC = serializeTime(date);

    // Regex to look for fractional second part in time string
    // such as 00:00:00.345+01:00
    var regexFracSec = /\.\d{1,}/;

    // Retrieve the fractional second part of the time
    // string if it exists.
    var fractionalPart = time.match(regexFracSec);
    if (fractionalPart == null) {
      // These are time-strings without the fractional
      // seconds. So we remove them from the UTC time-string.
      timeUTC = timeUTC.replace(regexFracSec, '');
      return timeUTC;
    } else {
      // These are time-string with fractional seconds.
      // Make sure that we inject the fractional
      // second part back in. The `timeUTC` variable
      // has millisecond precision, we may want more or less
      // depending on the string that was passed.
      timeUTC = timeUTC.replace(regexFracSec, fractionalPart[0]);
      return timeUTC;
    }
  }
};

// Parses an RFC 3339 compliant date-string into a Date.
//
// Example:
// parseDate('2016-01-01') parses to a Date corresponding to
// 2016-01-01T00:00:00.000Z.
var parseDate = exports.parseDate = function parseDate(date) {
  return new Date(date);
};

// Serializes a Date into a RFC 3339 compliant date-string
// in the format YYYY-MM-DD.
var serializeDate = exports.serializeDate = function serializeDate(date) {
  return date.toISOString().split('T')[0];
};

// Parses an RFC 3339 compliant date-time-string into a Date.
var parseDateTime = exports.parseDateTime = function parseDateTime(dateTime) {
  return new Date(dateTime);
};

// Serializes a Date into an RFC 3339 compliant date-time-string
// in the format YYYY-MM-DDThh:mm:ss.sssZ.
var serializeDateTime = exports.serializeDateTime = function serializeDateTime(dateTime) {
  return dateTime.toISOString();
};

// Serializes an RFC 3339 compliant date-time-string by shifting
// it to UTC.
var serializeDateTimeString = exports.serializeDateTimeString = function serializeDateTimeString(dateTime) {
  // If already formatted to UTC then return the time string
  if (dateTime.indexOf('Z') !== -1) {
    return dateTime;
  } else {
    // These are time-strings with timezone information,
    // these need to be shifted to UTC.

    // Convert to UTC time string in
    // format YYYY-MM-DDThh:mm:ss.sssZ.
    var dateTimeUTC = new Date(dateTime).toISOString();

    // Regex to look for fractional second part in date-time string
    var regexFracSec = /\.\d{1,}/;

    // Retrieve the fractional second part of the time
    // string if it exists.
    var fractionalPart = dateTime.match(regexFracSec);
    if (fractionalPart == null) {
      // The date-time-string has no fractional part,
      // so we remove it from the dateTimeUTC variable.
      dateTimeUTC = dateTimeUTC.replace(regexFracSec, '');
      return dateTimeUTC;
    } else {
      // These are datetime-string with fractional seconds.
      // Make sure that we inject the fractional
      // second part back in. The `dateTimeUTC` variable
      // has millisecond precision, we may want more or less
      // depending on the string that was passed.
      dateTimeUTC = dateTimeUTC.replace(regexFracSec, fractionalPart[0]);
      return dateTimeUTC;
    }
  }
};

// Serializes a Unix timestamp to an RFC 3339 compliant date-time-string
// in the format YYYY-MM-DDThh:mm:ss.sssZ
var serializeUnixTimestamp = exports.serializeUnixTimestamp = function serializeUnixTimestamp(timestamp) {
  return new Date(timestamp * 1000).toISOString();
};