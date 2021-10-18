/* View incoming_ctf */
CREATE FUNCTION ctfnote.incoming_ctf ()
  RETURNS SETOF ctfnote.ctf
  AS $$
  SELECT
    *
  FROM
    ctfnote.ctf
  WHERE
    end_time >= NOW()
  ORDER BY
    start_time ASC;

$$
LANGUAGE SQL
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote.incoming_ctf TO user_guest;


/* View past_ctf */
CREATE FUNCTION ctfnote.past_ctf ()
  RETURNS SETOF ctfnote.ctf
  AS $$
  SELECT
    *
  FROM
    ctfnote.ctf
  WHERE
    end_time < NOW()
  ORDER BY
    end_time DESC;

$$
LANGUAGE SQL
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote.past_ctf TO user_guest;

