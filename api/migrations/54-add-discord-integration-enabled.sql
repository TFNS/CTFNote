ALTER TABLE ctfnote.settings
  ADD COLUMN "discord_integration_enabled" boolean DEFAULT FALSE;

GRANT SELECT ("discord_integration_enabled") ON ctfnote.settings TO user_guest;
REVOKE UPDATE ("discord_integration_enabled") ON ctfnote.settings FROM user_admin;
GRANT UPDATE ("discord_integration_enabled") ON ctfnote.settings TO user_postgraphile;

