CREATE FUNCTION ctfnote.guests ()
  RETURNS SETOF ctfnote.profile
  AS $$
  SELECT
    (profile."id",
      profile."color",
      profile."username",
      profile."description")
  FROM
    ctfnote.profile
    INNER JOIN ctfnote_private.user ON profile.id = "user".id
  WHERE
    "user".role = 'user_guest'::ctfnote.role;

$$
LANGUAGE SQL
SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION ctfnote.guests TO user_guest;

