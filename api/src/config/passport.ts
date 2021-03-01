import passport from "passport";
var Oauth2Strategy = require('passport-oauth2').Strategy;
var KeyCloakStrategy = require('passport-keycloak-oauth2-oidc').Strategy;

import Globals from './globals';

import findOrCreateExternalUser from "../utils/externalAuth";

passport.serializeUser(async function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
}); 

if (Globals.externalAuthenticationModules.indexOf('keycloak') != -1){
  passport.use('keycloak',new KeyCloakStrategy({
      clientID: Globals.externalAuthenticationKeycloakClientID,
      clientSecret: Globals.externalAuthenticationKeycloakClientSecret,
      authServerURL: Globals.externalAuthenticationKeycloakAuthUrl,
      callbackURL: Globals.externalAuthenticationKeycloakCallbackUrl,
      realm: Globals.externalAuthenticationKeycloakRealm,
      publicClient: 'false',
      sslRequired: 'external',
    },
    function(accessToken, refreshToken, profile, done) {
  	  findOrCreateExternalUser(profile,done);
    })
  );
}

if (Globals.externalAuthenticationModules.indexOf('oauth2') != -1){
  passport.use('oauth2',new Oauth2Strategy({
  		clientID: Globals.externalAuthenticationOauth2ClientID,
  		clientSecret: Globals.externalAuthenticationOauth2ClientSecret,
  		authorizationURL: Globals.externalAuthenticationOauth2AuthorizationUrl,
  		tokenURL: Globals.externalAuthenticationOauth2TokenServerUrl,
  		callbackURL: Globals.externalAuthenticationOauth2CallbackUrl,
  	},
    	function(accessToken, refreshToken, profile, done) {
  		  findOrCreateExternalUser(profile,done); // Not sure about that because profile maybe empty :/
    	})
  );
}

export default passport;