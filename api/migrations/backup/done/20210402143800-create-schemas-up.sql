/* Replace with your SQL commands */
ALTER DEFAULT privileges REVOKE EXECUTE ON functions FROM public;


CREATE ROLE user_postgraphile LOGIN PASSWORD 'secret_password';

CREATE ROLE user_anonymous;

CREATE ROLE user_guest;

CREATE ROLE user_member;

CREATE ROLE user_manager;

CREATE ROLE user_admin;

GRANT user_anonymous TO user_guest;

GRANT user_guest TO user_member;

GRANT user_member TO user_manager;

GRANT user_manager TO user_admin;

GRANT user_admin TO user_postgraphile;


CREATE SCHEMA ctfnote;

CREATE SCHEMA ctfnote_private;

GRANT USAGE ON SCHEMA ctfnote TO user_anonymous;
GRANT USAGE ON SCHEMA ctfnote_private TO user_anonymous;

CREATE TYPE ctfnote.role AS ENUM (
    'user_guest',
    'user_member',
    'user_manager',
    'user_admin'
);