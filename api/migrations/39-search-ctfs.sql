CREATE OR REPLACE FUNCTION ctfnote.search_ctfs (search text)
  RETURNS SETOF ctfnote.ctf
  AS $$
  SELECT
    *
  FROM
    ctfnote.ctf
  AS 
    ctf
  WHERE 
    ctf.title ilike ('%' || search || '%')
  OR
    ctf.description ilike ('%' || search || '%') ;
$$
LANGUAGE SQL
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote.search_ctfs TO user_guest;
