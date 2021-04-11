CREATE TABLE ctfnote.invitation (
    ctf_id int NOT NULL REFERENCES ctfnote.ctf (id),
    profile_id int NOT NULL REFERENCES ctfnote.profile (id),
    PRIMARY KEY (ctf_id, profile_id)
);

CREATE INDEX ON "ctfnote"."invitation" ("ctf_id");

CREATE INDEX ON "ctfnote"."invitation" ("profile_id");

GRANT SELECT ON TABLE ctfnote.invitation TO user_guest;

GRANT DELETE ON TABLE ctfnote.invitation TO user_member;

GRANT INSERT ON TABLE ctfnote.invitation TO user_member;

CREATE FUNCTION ctfnote_private.delete_invitations_by_ctf ()
    RETURNS TRIGGER
    AS $$
BEGIN
    DELETE FROM ctfnote.invitation
    WHERE invitation.ctf_id = OLD.id;
    RETURN OLD;
END
$$
LANGUAGE plpgsql
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote_private.delete_invitations_by_ctf () TO user_member;

CREATE FUNCTION ctfnote_private.delete_invitations_by_profile ()
    RETURNS TRIGGER
    AS $$
BEGIN
    DELETE FROM ctfnote.invitation
    WHERE invitation.profile_id = OLD.id;
    RETURN OLD;
END
$$
LANGUAGE plpgsql
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote_private.delete_invitations_by_profile () TO user_member;

CREATE TRIGGER delete_invitation_on_ctf_delete
    BEFORE DELETE ON ctfnote.ctf
    FOR EACH ROW
    EXECUTE PROCEDURE ctfnote_private.delete_invitations_by_ctf ();

CREATE TRIGGER delete_invitation_on_profile_delete
    BEFORE DELETE ON ctfnote.profile
    FOR EACH ROW
    EXECUTE PROCEDURE ctfnote_private.delete_invitations_by_profile ();

