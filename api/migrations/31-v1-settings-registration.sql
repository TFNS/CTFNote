-- Allow-registration
UPDATE ctfnote.settings
SET    registration_allowed = value::jsonb <@ 'true'::jsonb
FROM   migration.config WHERE key = 'allow-registration';
