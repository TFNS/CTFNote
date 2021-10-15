/* eslint-env node */
// See https://www.apollographql.com/docs/devtools/apollo-config/
module.exports = {
  client: {
    service: {
      name: 'ctf-note',
      url: 'http://localhost:3000/graphql',
    },
    // Files processed by the extension
    includes: [],
    excludes: ['src/**/*.vue', 'src/**/*.js', 'src/**/*.ts'],
  },
};
