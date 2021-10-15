CREATE TABLE ctfnote.settings (
  unique_id boolean UNIQUE PRIMARY KEY DEFAULT TRUE,
  registration_allowed boolean NOT NULL DEFAULT TRUE,
  registration_password_allowed boolean NOT NULL DEFAULT FALSE,
  registration_password text NOT NULL DEFAULT '',
  registration_default_role ctfnote.role NOT NULL  DEFAULT 'user_guest' ::ctfnote.role,
  style json NOT NULL DEFAULT '{}',
  CONSTRAINT unique_id CHECK (unique_id)
);

COMMENT ON COLUMN ctfnote.settings.unique_id IS E'@omit';

INSERT INTO ctfnote.settings (unique_id)
  VALUES (TRUE);

GRANT SELECT (unique_id, registration_allowed, registration_password_allowed, style) ON ctfnote.settings TO user_anonymous;


GRANT SELECT, UPDATE  ON ctfnote.settings TO user_admin;

