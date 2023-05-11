ALTER TABLE ctfnote.profile
ADD COLUMN "lastactive" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP;

--- Security
DROP POLICY select_profile ON ctfnote.profile;
CREATE POLICY select_profile_admin ON ctfnote.profile
  FOR SELECT TO user_admin
    USING (TRUE);
  
CREATE POLICY select_profile ON ctfnote.profile
  FOR SELECT TO user_guest
    USING (id = ctfnote_private.user_id ());

CREATE OR REPLACE VIEW ctfnote.public_profile AS 
SELECT 
  "ctfnote"."profile"."id" as id,
  "ctfnote"."profile"."description",
  "ctfnote"."profile"."color",
  "ctfnote"."profile"."username",
  "ctfnote_private"."user"."role",
  CONCAT('profile-', "ctfnote"."profile"."id") as node_id
FROM ctfnote.profile
INNER JOIN "ctfnote_private"."user" ON "ctfnote_private"."user"."id" = "ctfnote"."profile"."id"
ORDER BY id;

GRANT SELECT on ctfnote.public_profile TO user_guest;

CREATE OR REPLACE FUNCTION ctfnote_private.notify_profile_edit ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP
  WHEN 'INSERT' THEN
    PERFORM
      ctfnote_private.notify ('created', 'profiles', NEW.id); RETURN NEW;
  WHEN 'UPDATE' THEN
    PERFORM
      ctfnote_private.notify ('update', 'public_profiles', NEW.id); RETURN NEW;
  WHEN 'DELETE' THEN
    PERFORM
      ctfnote_private.notify ('deleted', 'profiles', OLD.id); RETURN OLD;
  END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;

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


CREATE OR REPLACE FUNCTION ctfnote.me ()  
  RETURNS ctfnote.profile
  AS $$
  SELECT ctfnote.update_last_active();
  SELECT
    *
  FROM
    ctfnote.profile
  WHERE
    id = ctfnote_private.user_id ()
  LIMIT 1;

$$
LANGUAGE SQL
STRICT STABLE;
