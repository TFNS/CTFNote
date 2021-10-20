DROP FUNCTION me;

CREATE OR REPLACE FUNCTION ctfnote.me ()
  RETURNS ctfnote.profile
  AS $$
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

GRANT EXECUTE ON FUNCTION ctfnote.me () TO user_anonymous;


CREATE OR REPLACE FUNCTION ctfnote.new_token ()
  RETURNS ctfnote.jwt
  AS $$
DECLARE
  user_id int := ctfnote_private.user_id ();
BEGIN
  IF user_id IS NOT NULL THEN
    RETURN ctfnote_private.new_token (user_id);
  ELSE
    RETURN NULL;
  END IF;
END;
$$ STRICT STABLE
LANGUAGE plpgsql
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.new_token () TO user_anonymous;

