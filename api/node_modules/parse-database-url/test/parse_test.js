var fs = require("fs");
var path = require("path");

describe("parseDatabaseUrl", function() {
  var data = fs.readFileSync(path.join(__dirname, "parse_cases.json"), "utf8");
  var parseCases = JSON.parse(data);
  var _length = parseCases.length;
  for (var i = 0; i < _length; ++i) {
    var _parseCase = parseCases[i];

    (function(parseCase) {
      it("parses a " + parseCase.desc, function() {
        expect(parseDatabaseUrl(parseCase.url)).to.deep.
            equal(parseCase.config);
      });
    })(_parseCase);
  }
});
