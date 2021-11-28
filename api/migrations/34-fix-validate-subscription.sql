CREATE OR REPLACE FUNCTION ctfnote_private.validate_subscription (topic text)
  RETURNS text
  AS $$
DECLARE
  ctf_id int;
BEGIN
  IF ctfnote_private.is_guest () THEN
    RETURN gen_random_uuid ();
  END IF;
  RAISE EXCEPTION 'Please login first';
END;
$$
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote_private.validate_subscription TO user_anonymous;

