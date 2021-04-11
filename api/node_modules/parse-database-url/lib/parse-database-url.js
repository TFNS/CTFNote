var url = require("url");
var querystring = require("querystring");

var mongodbUri = require("mongodb-uri");

/**
 * This is the exported function that parses database URLs.
 *
 * @param {String} databaseUrl the URL to be parsed
 * @return {Object<String, String>} the database configuration; this will
 *     always have the "driver" key pointing to a database driver, and may
 *     have some of the following keys: "host", "port", "user", "password",
 *     "database", "filename"
 */
module.exports = function (databaseUrl) {
  var parsedUrl = url.parse(databaseUrl, false, true);

  // Query parameters end up directly in the configuration.
  var config = querystring.parse(parsedUrl.query);

  config.driver = (parsedUrl.protocol || "sqlite3:")
      // The protocol coming from url.parse() has a trailing :
      .replace(/\:$/, "");

  // Cloud Foundry will sometimes set a 'mysql2' scheme instead of 'mysql'.
  if (config.driver == "mysql2")
    config.driver = "mysql";

  // url.parse() produces an "auth" that looks like "user:password". No
  // individual fields, unfortunately.
  if (parsedUrl.auth) {
    var userPassword = parsedUrl.auth.split(":", 2);
    config.user = userPassword[0];
    if (userPassword.length > 1) {
      config.password = userPassword[1];
    }
  }

  if (config.driver === "sqlite3") {
    if (parsedUrl.hostname) {
      if (parsedUrl.pathname) {
        // Relative path.
        config.filename = parsedUrl.hostname + parsedUrl.pathname;
      } else {
        // Just a filename.
        config.filename = parsedUrl.hostname;
      }
    } else {
      // Absolute path.
      config.filename = parsedUrl.pathname;
    }
  } else {
    if (config.driver === "mongodb") {
      // MongoDB URLs can have multiple comma-separated host:port pairs. This
      // trips up the standard URL parser.
      var mongoParsedUrl = mongodbUri.parse(databaseUrl);
      parsedUrl = {};
      if (mongoParsedUrl.hosts) {
        config.hosts = mongoParsedUrl.hosts;
        for (var i = 0; i < config.hosts.length; i += 1) {
          if (config.hosts[i].port)
            config.hosts[i].port = config.hosts[i].port.toString();
        }
        if (config.hosts.length === 1) {
          if (config.hosts[0].host)
            config.host = config.hosts[0].host;
          if (config.hosts[0].port)
            config.port = config.hosts[0].port.toString();
        }
      }
      if (mongoParsedUrl.database)
        config.database = mongoParsedUrl.database;
    } else {
      // Some drivers (e.g., redis) don't have database names.
      if (parsedUrl.pathname) {
        config.database =
            parsedUrl.pathname.replace(/^\//, "").replace(/\/$/, "");
      }
    }

    if (parsedUrl.hostname) config.host = parsedUrl.hostname;
    if (parsedUrl.port) config.port = parsedUrl.port;
  }

  return config;
};
