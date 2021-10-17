CREATE FUNCTION ctfnote_private.notify (event_name text, node_name text, node_id int)
  RETURNS void
  AS $$
BEGIN
  PERFORM
    pg_notify(concat('postgraphile:', event_name, ':', node_name, ':', node_id), json_build_object('__node__', json_build_array(node_name, node_id))::text);
END;
$$ STRICT VOLATILE
LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION ctfnote_private.notify (text, text, INT) TO user_anonymous;

-- CTF
CREATE FUNCTION ctfnote_private.notify_ctf_edit ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP
  WHEN 'INSERT' THEN
    PERFORM
      ctfnote_private.notify ('ctf-created', 'ctfs', NEW.id); RETURN NEW;
  WHEN 'UPDATE' THEN
    PERFORM
      ctfnote_private.notify ('update', 'ctfs', NEW.id); RETURN NEW;
  WHEN 'DELETE' THEN
    PERFORM
      ctfnote_private.notify ('ctf-deleted', 'ctfs', NEW.id); RETURN NEW;
  END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION ctfnote_private.notify_ctf_edit () TO user_guest;

CREATE TRIGGER _500_gql_update_ctf
  AFTER INSERT OR UPDATE OR DELETE ON ctfnote.ctf
  FOR EACH ROW
  EXECUTE PROCEDURE ctfnote_private.notify_ctf_edit ();

-- CTF SECRETS
CREATE FUNCTION ctfnote_private.notify_ctf_secrets_edit ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP
  WHEN 'UPDATE' THEN
    PERFORM
      ctfnote_private.notify ('update', 'ctfs', NEW.id); RETURN NEW;
  END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION ctfnote_private.notify_ctf_secrets_edit () TO user_guest;

CREATE TRIGGER _500_gql_update_ctf_secret
  AFTER UPDATE ON ctfnote.ctf_secrets
  FOR EACH ROW
  EXECUTE PROCEDURE ctfnote_private.notify_ctf_secrets_edit ();

-- TASK
CREATE FUNCTION ctfnote_private.notify_task_edit ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP
  WHEN 'INSERT' THEN
    PERFORM
      ctfnote_private.notify ('update', 'ctfs', NEW.ctf_id); RETURN NEW;
  WHEN 'UPDATE' THEN
    IF NEW.flag <> '' AND (OLD.flag is null or OLD.flag = '') THEN
        PERFORM
          ctfnote_private.notify ('task-solved', 'tasks', NEW.ctf_id);
    END IF;
  PERFORM
    ctfnote_private.notify ('update', 'tasks', NEW.id);
  RETURN NEW;
  WHEN 'DELETE' THEN
    PERFORM
      ctfnote_private.notify ('update', 'ctfs', OLD.ctf_id);
  RETURN NEW;
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

-- WORK ON
CREATE FUNCTION ctfnote_private.notify_work_on_task ()
  RETURNS TRIGGER
  AS $$
DECLARE
  current_ctf_id int;
BEGIN
  CASE TG_OP
  WHEN 'INSERT' THEN
    PERFORM
      ctfnote_private.notify ('update', 'tasks', NEW.task_id); RETURN NEW;
  WHEN 'DELETE' THEN
    PERFORM
      ctfnote_private.notify ('update', 'tasks', OLD.task_id); RETURN OLD;
  END CASE;
  END
$$ VOLATILE
LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION ctfnote_private.notify_work_on_task () TO user_guest;

CREATE TRIGGER _500_gql_update_work_on_task
  AFTER INSERT OR DELETE ON ctfnote.work_on_task
  FOR EACH ROW
  EXECUTE PROCEDURE ctfnote_private.notify_work_on_task ();

-- PROFILE
CREATE FUNCTION ctfnote_private.notify_profile_edit ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP
  WHEN 'INSERT' THEN
    PERFORM
      ctfnote_private.notify ('profile-created', 'profiles', NEW.id); RETURN NEW;
  WHEN 'UPDATE' THEN
    PERFORM
      ctfnote_private.notify ('update', 'profiles', NEW.id); RETURN NEW;
  WHEN 'DELETE' THEN
    PERFORM
      ctfnote_private.notify ('profile-deleted', 'profiles', OLD.id); RETURN OLD;
  END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION ctfnote_private.notify_profile_edit () TO user_guest;

CREATE TRIGGER _500_gql_update_profile
  AFTER INSERT OR UPDATE OR DELETE ON ctfnote.profile
  FOR EACH ROW
  EXECUTE PROCEDURE ctfnote_private.notify_profile_edit ();

-- Invitations
CREATE FUNCTION ctfnote_private.notify_invitation_edit ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP
  WHEN 'INSERT' THEN
    PERFORM
      ctfnote_private.notify ('update', 'ctfs', NEW.ctf_id); RETURN NEW;
  WHEN 'DELETE' THEN
    PERFORM
      ctfnote_private.notify ('update', 'ctfs', OLD.ctf_id); RETURN OLD;
  END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION ctfnote_private.notify_invitation_edit () TO user_guest;

CREATE TRIGGER _500_gql_update_invitation
  AFTER INSERT OR DELETE ON ctfnote.invitation
  FOR EACH ROW
  EXECUTE PROCEDURE ctfnote_private.notify_invitation_edit ();

CREATE FUNCTION ctfnote_private.can_watch_node (topic text)
  RETURNS boolean
  AS $$
DECLARE
  watch text[];
BEGIN
  SELECT
    (regexp_match(topic, '^postgraphile:update:([a-z]+):([0-9]+)$')) INTO watch;
  IF (watch IS NOT NULL) THEN
    CASE watch[1]
    WHEN 'ctfs',
    'ctfsecret' THEN
      RETURN ctfnote_private.can_play_ctf (watch[2]::int);
    WHEN 'tasks' THEN
      RETURN ctfnote_private.can_play_task (watch[2]::int);
    WHEN 'profiles',
    'settings' THEN
      RETURN TRUE;
    ELSE
      RETURN FALSE;
    END CASE;
    END IF;
    RETURN FALSE;
END
$$
LANGUAGE plpgsql
VOLATILE;

CREATE FUNCTION ctfnote_private.validate_subscription (topic text)
  RETURNS text
  AS $$
DECLARE
  ok text := 'e0d7b844-89cd-4d00-9818-47a3e9c3a429';
  ctf_id int;
BEGIN
  IF strpos(topic, 'postgraphile') <> 1 THEN
    RAISE EXCEPTION 'Subscription denied';
  END IF;
  IF topic ~ '^postgraphile:update:' AND ctfnote_private.can_watch_node (topic) THEN
    RETURN ok;
  END IF;
  RAISE EXCEPTION 'Subscription denied';
END;
$$
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote_private.validate_subscription TO user_anonymous;

