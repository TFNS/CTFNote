"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable no-console
let postgraphileRCFile = null;
try {
    postgraphileRCFile = require.resolve(process.cwd() + '/.postgraphilerc');
}
catch (e) {
    // No postgraphileRC; carry on
}
const config = postgraphileRCFile ? require(postgraphileRCFile) : {}; // tslint:disable-line no-var-requires
if (postgraphileRCFile && !Object.prototype.hasOwnProperty.call(config, 'options')) {
    console.warn('WARNING: Your configuration file does not export any options');
}
exports.default = config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGdyYXBoaWxlcmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcG9zdGdyYXBoaWxlL3Bvc3RncmFwaGlsZXJjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEJBQTRCO0FBQzVCLElBQUksa0JBQWtCLEdBQWtCLElBQUksQ0FBQztBQUM3QyxJQUFJO0lBQ0Ysa0JBQWtCLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsa0JBQWtCLENBQUMsQ0FBQztDQUMxRTtBQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ1YsOEJBQThCO0NBQy9CO0FBRUQsTUFBTSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxzQ0FBc0M7QUFDNUcsSUFBSSxrQkFBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLEVBQUU7SUFDbEYsT0FBTyxDQUFDLElBQUksQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO0NBQzlFO0FBRUQsa0JBQWUsTUFBTSxDQUFDIn0=