ALTER TABLE ctfnote.settings
    ADD COLUMN "hedgedoc_meta_user_password" VARCHAR(128);

GRANT SELECT ("hedgedoc_meta_user_password") ON ctfnote.settings TO user_postgraphile;
GRANT UPDATE ("hedgedoc_meta_user_password") ON ctfnote.settings TO user_postgraphile;