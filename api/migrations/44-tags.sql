--- Tag table
CREATE TABLE ctfnote.tag (
  id serial PRIMARY KEY,
  "tag" text NOT NULL CHECK (tag = lower(tag)) UNIQUE
);

--- Relationship
CREATE TABLE ctfnote.assigned_tags (
    tag_id int NOT NULL REFERENCES ctfnote.tag (id) ON DELETE CASCADE,
    task_id int NOT NULL REFERENCES ctfnote.task (id) ON DELETE CASCADE,
    PRIMARY KEY (tag_id, task_id)
);

CREATE INDEX ON "ctfnote"."assigned_tags" ("tag_id");

CREATE INDEX ON "ctfnote"."assigned_tags" ("task_id");

GRANT SELECT ON TABLE ctfnote.assigned_tags TO user_guest;

GRANT INSERT ON TABLE ctfnote.assigned_tags TO user_guest;

GRANT DELETE ON TABLE ctfnote.assigned_tags TO user_guest;

CREATE FUNCTION tag_lower_case() 
  RETURNS TRIGGER
AS
$$
BEGIN
  new.tag := lower(new.tag);
  RETURN new;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE TRIGGER ensure_tag_lower_case
   BEFORE UPDATE OR INSERT ON ctfnote.tag
   FOR EACH ROW
   EXECUTE PROCEDURE tag_lower_case();

--- Remove category from create_task
CREATE OR REPLACE FUNCTION ctfnote_private.create_task (title text, description text, flag text, pad_url text, ctf_id int)
  RETURNS ctfnote.task
  AS $$
  INSERT INTO ctfnote.task (title, description, flag, pad_url, ctf_id)
    VALUES (title, description, flag, pad_url, ctf_id)
  RETURNING
*;

$$
LANGUAGE SQL
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote_private.create_task (text, text,  text, text, int) TO user_guest;


--- Add custom logic for inserting tags
CREATE OR REPLACE FUNCTION ctfnote.add_tags_for_task (tags text ARRAY, taskId int)
  RETURNS void
  AS $$
  DECLARE
    t text;
  BEGIN
    DELETE FROM ctfnote.assigned_tags WHERE task_id = taskId;
    FOREACH t IN ARRAY $1 
    LOOP
      INSERT INTO ctfnote.tag (tag) VALUES (t) ON CONFLICT DO NOTHING;

      INSERT INTO ctfnote.assigned_tags (tag_id, task_id) VALUES ((SELECT id FROM ctfnote.tag WHERE tag = lower(t)), taskId);
    END LOOP;
  END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.add_tags_for_task (text ARRAY, int) TO user_guest;


--- Security
ALTER TABLE ctfnote.assigned_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY assigned_tags ON ctfnote.assigned_tags
  FOR ALL TO user_guest
    USING (ctfnote_private.can_play_task (task_id));

CREATE POLICY member_assigned_tags ON ctfnote.assigned_tags
  FOR ALL TO user_member
    USING (TRUE);

GRANT SELECT ON TABLE ctfnote.tag TO user_guest;

GRANT INSERT ON TABLE ctfnote.tag TO user_guest;

GRANT usage ON SEQUENCE ctfnote.tag_id_seq
  TO user_guest;

--- Notify
CREATE FUNCTION ctfnote_private.notify_tag_linking ()
  RETURNS TRIGGER
  AS $$
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

GRANT EXECUTE ON FUNCTION ctfnote_private.notify_tag_linking () TO user_guest;

CREATE TRIGGER _500_gql_update_assigned_tags
  AFTER INSERT OR DELETE ON ctfnote.assigned_tags
  FOR EACH ROW
  EXECUTE PROCEDURE ctfnote_private.notify_tag_linking ();

--- Migrate data
DO $$
DECLARE
  _e record;
  _tagid int;
BEGIN
  FOR _e IN
    SELECT category, id FROM ctfnote.task
  LOOP
    IF _e.category != '' AND _e.category IS NOT NULL THEN
      INSERT INTO ctfnote.tag (tag) 
        SELECT _e.category
        ON CONFLICT (tag) DO NOTHING;
      
      SELECT id INTO _tagid FROM ctfnote.tag
        WHERE tag = lower(_e.category);
      
      INSERT INTO ctfnote.assigned_tags (tag_id, task_id)
        VALUES (_tagid, _e.id);
    END IF;
  END LOOP;
END; $$;

ALTER TABLE ctfnote.task DROP COLUMN category;