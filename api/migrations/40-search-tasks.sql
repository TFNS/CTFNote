CREATE OR REPLACE FUNCTION ctfnote.search_tasks (search text)
  RETURNS SETOF ctfnote.task
  AS $$
  SELECT
    *
  FROM
    ctfnote.task
  AS 
    task
  WHERE 
    task.title ilike ('%' || search || '%');
$$
LANGUAGE SQL
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote.search_tasks TO user_guest;
