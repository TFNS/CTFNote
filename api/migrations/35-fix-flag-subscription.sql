CREATE OR REPLACE FUNCTION ctfnote_private.notify_task_edit ()
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
          ctfnote_private.notify ('task-solved', 'tasks', NEW.id);
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
