CREATE FUNCTION ctfnote_private.ctf_event_topic (ctf_id int, event_name text)
  RETURNS text
  AS $$
  SELECT
    concat('postgraphile:ctf:', ctf_id, ':', event_name);

$$ STRICT STABLE
LANGUAGE SQL;

GRANT EXECUTE ON FUNCTION ctfnote_private.ctf_event_topic (int, text) TO user_anonymous;

-- TRIGGER ON UPDATE/INSERT CTF
CREATE FUNCTION ctfnote_private.notify_ctf_edit ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP
  WHEN 'INSERT' THEN
    PERFORM
      pg_notify(ctfnote_private.ctf_event_topic (0, 'created'), json_build_object('__node__', json_build_array('ctfs', NEW.id))::text); RETURN NEW;
  WHEN 'UPDATE' THEN
    PERFORM
      pg_notify(ctfnote_private.ctf_event_topic (0, 'updated'), json_build_object('__node__', json_build_array('ctfs', NEW.id))::text); RETURN NEW;
  WHEN 'DELETE' THEN
    PERFORM
      pg_notify(ctfnote_private.ctf_event_topic (0, 'deleted'), json_build_object('__node__', json_build_array('ctfs', OLD.id))::text); RETURN OLD;
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
      pg_notify(ctfnote_private.ctf_event_topic (NEW.ctf_id, 'taskCreated'), json_build_object('__node__', json_build_array('tasks', NEW.id))::text); RETURN NEW;
  WHEN 'UPDATE' THEN
    IF NEW.flag <> '' AND (OLD.flag is null or OLD.flag = '') THEN
        PERFORM
          pg_notify(ctfnote_private.ctf_event_topic (NEW.ctf_id, 'taskSolved'), json_build_object('__node__', json_build_array('tasks', NEW.id))::text);
    END IF;
  PERFORM
    pg_notify(ctfnote_private.ctf_event_topic (NEW.ctf_id, 'taskUpdated'), json_build_object('__node__', json_build_array('tasks', NEW.id))::text);
  RETURN NEW;
  WHEN 'DELETE' THEN
    PERFORM
      pg_notify(ctfnote_private.ctf_event_topic (OLD.ctf_id, 'taskDeleted'), json_build_object('__node__', json_build_array('tasks', OLD.id))::text);
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

-- TRIGGER ON UPDATE/INSERT CTF
CREATE FUNCTION ctfnote_private.notify_work_on_task ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP
  WHEN 'INSERT' THEN
    PERFORM
      pg_notify(ctfnote_private.ctf_event_topic ((
          SELECT
            ctf_id FROM ctfnote.task
          WHERE
            id = NEW.task_id), 'taskUpdated'), json_build_object('__node__', json_build_array('tasks', NEW.task_id))::text); RETURN NEW;
  WHEN 'DELETE' THEN
    PERFORM
      pg_notify(ctfnote_private.ctf_event_topic ((
          SELECT
            ctf_id FROM ctfnote.task
          WHERE
            id = OLD.task_id), 'taskUpdated'), json_build_object('__node__', json_build_array('tasks', OLD.task_id))::text); RETURN NEW;
  END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION ctfnote_private.notify_work_on_task () TO user_guest;

CREATE TRIGGER _500_gql_update_work_on_task
  AFTER INSERT OR DELETE ON ctfnote.work_on_task
  FOR EACH ROW
  EXECUTE PROCEDURE ctfnote_private.notify_work_on_task ();

CREATE FUNCTION ctfnote_private.validate_subscription (topic text)
  RETURNS text
  AS $$
DECLARE
  ctf_id int;
BEGIN
  IF strpos(topic, 'postgraphile:ctf:') <> 1 THEN
    RAISE EXCEPTION 'Subscription denied';
  END IF;
  SELECT
    split_part(topic, ':', 3)::int INTO ctf_id;
  IF (ctf_id = 0 OR ctfnote_private.can_play_ctf (ctf_id)) THEN
    RETURN 'e0d7b844-89cd-4d00-9818-47a3e9c3a429';
  ELSE
    RAISE EXCEPTION 'Subscription denied';
  END IF;
END;
$$
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote_private.validate_subscription TO user_anonymous;

