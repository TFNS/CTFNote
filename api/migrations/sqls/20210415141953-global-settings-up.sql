/* Replace with your SQL commands */
CREATE TABLE ctfnote_private.settings (
  unique_id boolean UNIQUE PRIMARY KEY DEFAULT TRUE,
  settings json,
  CONSTRAINT unique_id CHECK (unique_id)
);
INSERT INTO ctfnote_private.settings (settings) VALUES ('{}');

GRANT SELECT ON ctfnote_private.settings TO user_anonymous;

CREATE FUNCTION ctfnote_private.update_settings (new_settings json)
  RETURNS json
  AS $$
  INSERT INTO ctfnote_private.settings (settings)
    VALUES (new_settings)
  ON CONFLICT (unique_id)
    DO UPDATE SET
      settings = new_settings
    RETURNING
      settings;

$$
LANGUAGE sql
VOLATILE STRICT
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote_private.update_settings TO user_admin;

