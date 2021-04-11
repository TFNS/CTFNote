CREATE TABLE ctfnote.invitation (
    ctf_id int CONSTRAINT invitation_ctf_id_fkey REFERENCES ctfnote.ctf (id),
    user_id int CONSTRAINT invitation_user_id_fkey REFERENCES ctfnote_private.user (id),
    PRIMARY KEY (ctf_id, user_id)
);

COMMENT ON CONSTRAINT invitation_ctf_id_fkey ON ctfnote.invitation IS E'@omit manyToMany';

CREATE INDEX ON "ctfnote"."invitation" ("ctf_id");

CREATE INDEX ON "ctfnote"."invitation" ("user_id");

GRANT SELECT ON TABLE ctfnote.invitation TO user_guest;

GRANT DELETE ON TABLE ctfnote.invitation TO user_guest;

CREATE FUNCTION ctfnote.invite_user (ctf_id int, user_id int)
    RETURNS ctfnote.invitation
    AS $$
DECLARE
    invitation ctfnote.invitation;
BEGIN
    SELECT
        id INTO invitation.ctf_id
    FROM
        ctfnote.ctf
    WHERE
        id = ctf_id;
    SELECT
        id INTO invitation.user_id
    FROM
        ctfnote_private.user
    WHERE
        id = user_id;
    INSERT INTO ctfnote.invitation (ctf_id, user_id)
        VALUES (invitation.ctf_id, invitation.user_id);
    RETURN invitation;
END;
$$ STRICT
SECURITY DEFINER
LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION ctfnote.invite_user TO user_member;

CREATE FUNCTION ctfnote.invitation_user (invitation ctfnote.invitation)
    RETURNS ctfnote.user
    AS $$
    SELECT
        *
    FROM
        ctfnote.user
    WHERE
        id = invitation.user_id
    LIMIT 1;

$$
LANGUAGE sql
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote.invitation_user (ctfnote.invitation) TO user_guest;

