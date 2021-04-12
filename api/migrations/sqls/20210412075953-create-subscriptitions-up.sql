-- TRIGGER ON UPDATE/INSERT CTF
CREATE FUNCTION ctfnote_private.notify_ctf_edit ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP
  WHEN 'INSERT' THEN
    PERFORM
      pg_notify(concat('postgraphile:ctfCreated', ':', NEW.id), json_build_object('__node__', json_build_array('ctfs', NEW.id))::text); RETURN NEW;
  WHEN 'UPDATE' THEN
    PERFORM
      pg_notify(concat('postgraphile:ctfUpdated', ':', NEW.id), json_build_object('__node__', json_build_array('ctfs', NEW.id))::text); RETURN NEW;
  WHEN 'DELETE' THEN
    PERFORM
      pg_notify(concat('postgraphile:ctfDeleted', ':', OLD.id), json_build_object('__node__', json_build_array('ctfs', OLD.id))::text); RETURN OLD;
  END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION ctfnote_private.notify_ctf_edit () TO user_guest;

CREATE TRIGGER _500_gql_update_ctf
  AFTER INSERT OR UPDATE OR DELETE ON ctfnote.ctf
  FOR EACH ROW
  EXECUTE PROCEDURE ctfnote_private.notify_ctf_edit ();

-- TRIGGER ON TASK UPDATE/INSERT
CREATE FUNCTION ctfnote_private.notify_task_edit ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP
  WHEN 'INSERT' THEN
    PERFORM
      pg_notify(concat('postgraphile:taskCreated', ':', NEW.ctf_id), json_build_object('__node__', json_build_array('tasks', NEW.id))::text); RETURN NEW;
  WHEN 'UPDATE' THEN
    IF NEW.flag <> '' AND OLD.flag = '' THEN
        PERFORM
          pg_notify(concat('postgraphile:taskSolved', ':', NEW.ctf_id), json_build_object('__node__', json_build_array('tasks', NEW.id))::text);
    END IF;
  PERFORM
    pg_notify(concat('postgraphile:taskUpdated', ':', NEW.ctf_id), json_build_object('__node__', json_build_array('tasks', NEW.id))::text);
  RETURN NEW;
  WHEN 'DELETE' THEN
    PERFORM
      pg_notify(concat('postgraphile:taskDeleted', ':', OLD.ctf_id), json_build_object('__node__', json_build_array('tasks', OLD.id))::text);
  RETURN OLD;
  END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION ctfnote_private.notify_task_edit () TO user_guest;

CREATE TRIGGER _500_gql_update_task
  AFTER INSERT OR UPDATE OR DELETE ON ctfnote.task
  FOR EACH ROW
  EXECUTE PROCEDURE ctfnote_private.notify_task_edit ();

