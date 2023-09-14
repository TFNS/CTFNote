ALTER TABLE ctfnote_private.user
ADD COLUMN "token" TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex');

ALTER TABLE ctfnote.profile
ADD COLUMN "discord_id" TEXT UNIQUE DEFAULT NULL;

CREATE OR REPLACE FUNCTION ctfnote.reset_profile_token()
    RETURNS TEXT
    AS $$
    UPDATE ctfnote_private.user SET token = encode(gen_random_bytes(16), 'hex') WHERE id = ctfnote_private.user_id();
    SELECT token FROM ctfnote_private.user WHERE id = ctfnote_private.user_id();
$$
LANGUAGE SQL
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.reset_profile_token () TO user_anonymous;

CREATE OR REPLACE FUNCTION ctfnote.reset_discord_id()
    RETURNS TEXT
    AS $$
    UPDATE ctfnote.profile SET discord_id = NULL WHERE id = ctfnote_private.user_id();
    SELECT discord_id FROM ctfnote.profile WHERE id = ctfnote_private.user_id();
$$
LANGUAGE SQL
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.reset_discord_id () TO user_anonymous;

CREATE OR REPLACE FUNCTION ctfnote.profile_token ()
  RETURNS TEXT
  AS $$
  SELECT token FROM ctfnote_private.user WHERE id = ctfnote_private.user_id();
$$ STRICT STABLE
LANGUAGE SQL
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.profile_token () TO user_anonymous;

