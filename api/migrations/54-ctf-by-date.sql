CREATE FUNCTION ctfnote.ctfs_by_date(year int, month int)
  RETURNS SETOF ctfnote.ctf
  AS $$
  SELECT
    ctf.*
  FROM
    ctfnote.ctf
  WHERE(start_time <= make_date(year, month, 1) + interval '1 month'
    AND end_time >= make_date(year, month, 1))
  ORDER BY start_time;
$$
LANGUAGE SQL
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote.ctfs_by_date(int, int) TO user_guest;

