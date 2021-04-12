CREATE FUNCTION ctfnote_private.notify_ctf_edit ()
  RETURNS TRIGGER
  AS $$
BEGIN
  PERFORM
    pg_notify('postgraphile:ctfUpdated', json_build_object('__node__', json_build_array('ctfs', NEW.id))::text);
    RETURN NEW;
END
$$ VOLATILE
LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION ctfnote_private.notify_ctf_edit () TO user_guest;

CREATE TRIGGER _500_gql_update_ctf
  AFTER INSERT OR UPDATE ON ctfnote.ctf
  FOR EACH ROW
  EXECUTE PROCEDURE ctfnote_private.notify_ctf_edit ();

CREATE FUNCTION ctfnote_private.notify_task_edit ()
  RETURNS TRIGGER
  AS $$
BEGIN
  PERFORM
    pg_notify('postgraphile:taskUpdated', json_build_object('__node__', json_build_array('tasks', NEW.id))::text);
    RETURN NEW;
END
$$ VOLATILE
LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION ctfnote_private.notify_task_edit () TO user_guest;


CREATE TRIGGER _500_gql_update_task
  AFTER INSERT OR UPDATE ON ctfnote.task
  FOR EACH ROW
  EXECUTE PROCEDURE ctfnote_private.notify_task_edit ();

