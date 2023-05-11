ALTER TABLE ctfnote.profile
ADD COLUMN "lastactive" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP;

--- Security - Column wise
GRANT SELECT (id, color, username, description) on ctfnote.profile TO user_guest;
GRANT SELECT (id, color, username, description, lastactive) on ctfnote.profile TO user_admin;

/* UpdateLastActive */
CREATE FUNCTION ctfnote.update_last_active ()
  RETURNS void
  AS $$
  BEGIN
    UPDATE ctfnote.profile
      SET lastactive = now()
      WHERE id = ctfnote_private.user_id ();
  END;
$$
LANGUAGE plpgsql VOLATILE
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.update_last_active () TO user_guest;

--- Update me() function to not include lastactive but still return a ctfnote.profile
DROP FUNCTION ctfnote.me();
CREATE OR REPLACE FUNCTION ctfnote.me ()  
  RETURNS ctfnote.profile
  AS $$
  SELECT ctfnote.update_last_active();
  SELECT
    id, color, username, description, COALESCE(lastactive, NULL)
  FROM
    ctfnote.profile
  WHERE
    id = ctfnote_private.user_id ()
  LIMIT 1;

$$
LANGUAGE SQL
STRICT STABLE;

GRANT EXECUTE ON FUNCTION ctfnote.me () TO user_anonymous;

--- Update triggers
DROP TRIGGER _500_gql_update_profile ON ctfnote.profile;

CREATE TRIGGER _500_gql_update_profile
  AFTER INSERT OR DELETE ON ctfnote.profile
  FOR EACH ROW
  EXECUTE PROCEDURE ctfnote_private.notify_profile_edit ();

--- Exclude lastactive updates for update trigger
CREATE TRIGGER _500_gql_update_profile_update
  AFTER UPDATE ON ctfnote.profile
  FOR EACH ROW
  WHEN (OLD.lastactive = NEW.lastactive)
  EXECUTE PROCEDURE ctfnote_private.notify_profile_edit ();