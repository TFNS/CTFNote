import PersistentConfiguration from "./persitent";
import Rights from "./rights";

export default class Globals {
  static port = 31337;
  static version = "v1.0.0";
  static appName = "ctfnote-api";

  static env = process.env.NODE_ENV || "dev";

  static usernameMinLength = 1;
  static usernameMaxLength = 32;

  static defaultCookieExpirationTime = 10; // in days
  static cookieName = "ctfnote-auth";
  static userAgent = "CTFNote";

  static adminRights = [Rights.ADMIN_ALL];
  static defaultRights = [];

  static allowRegistration = true;
  static allowExternalRegistration = false;
  static allowExternalAuthentication = false;

  static mdCreateUrl = process.env.MD_CREATE_URL || "http://front/pad/new";
  static mdShowUrl = process.env.MD_SHOW_URL || "/pad";

  static externalAuthenticationModuleAuthorized = ['oauth2','keycloak'];

  static externalAuthenticationModules = (process.env.EXTERNAL_AUTHENTICATION_MODULES || "").split(',').filter(value => Globals.externalAuthenticationModuleAuthorized.includes(value));
  
  static externalAuthenticationOauth2ClientID = process.env.EXTERNAL_AUTHENTICATION_OAUTH2_CLIENT_ID || "";
  static externalAuthenticationOauth2ClientSecret = process.env.EXTERNAL_AUTHENTICATION_OAUTH2_CLIENT_SECRET || "";
  static externalAuthenticationOauth2AuthorizationUrl = process.env.EXTERNAL_AUTHENTICATION_OAUTH2_AUTHORIZATION_URL || "";
  static externalAuthenticationOauth2TokenServerUrl = process.env.EXTERNAL_AUTHENTICATION_OAUTH2_TOKEN_SERVER_URL || "";

  static externalAuthenticationKeycloakClientID = process.env.EXTERNAL_AUTHENTICATION_KEYCLOAK_CLIENT_ID || "";
  static externalAuthenticationKeycloakClientSecret = process.env.EXTERNAL_AUTHENTICATION_KEYCLOAK_CLIENT_SECRET || "";
  static externalAuthenticationKeycloakAuthUrl = process.env.EXTERNAL_AUTHENTICATION_KEYCLOAK_AUTH_URL || "";
  static externalAuthenticationKeycloakRealm = process.env.EXTERNAL_AUTHENTICATION_KEYCLOAK_REALM || "";

  static maxCtfPerPage = 20;

  static updatableFields = {
    ctf: ["ctfUrl", "start", "finish", "logo", "ctfTimeUrl", "format", "url", "description"],
  };

  static async init() {
    Globals.mdCreateUrl = await PersistentConfiguration.setIfNotSet("md-create-url", Globals.mdCreateUrl);
    Globals.mdShowUrl = await PersistentConfiguration.setIfNotSet("md-show-url", Globals.mdShowUrl);
    Globals.allowRegistration = await PersistentConfiguration.setIfNotSet(
      "allow-registration",
      Globals.allowRegistration
    );
    Globals.allowExternalRegistration = await PersistentConfiguration.setIfNotSet(
      "allow-external-registration",
      Globals.allowExternalRegistration
    );
    Globals.allowExternalAuthentication = await PersistentConfiguration.setIfNotSet(
      "allow-external-authentication",
      Globals.allowExternalAuthentication
    );
  }
}
