ALTER TABLE ctfnote.profile
ADD COLUMN "lastactive" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP;


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