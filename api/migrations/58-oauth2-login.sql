ALTER TABLE ctfnote.settings
  ADD COLUMN "oauth2_enabled" boolean NOT NULL DEFAULT FALSE;

GRANT SELECT ("oauth2_enabled") ON ctfnote.settings TO user_anonymous;
GRANT UPDATE ("oauth2_enabled") ON ctfnote.settings TO user_postgraphile;
