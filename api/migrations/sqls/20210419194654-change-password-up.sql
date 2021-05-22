CREATE TYPE ctfnote.change_password_response AS (
    ok boolean
);

CREATE FUNCTION ctfnote.change_password (oldPassword text, newPassword text)
    RETURNS ctfnote.change_password_response
    AS $$
BEGIN
    UPDATE
        ctfnote_private.user
    SET
        "password" = crypt(newPassword, gen_salt('bf'))
    WHERE
        "user".id = ctfnote_private.current_id ()
        AND "user"."password" = crypt(oldPassword, "user"."password");
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wrong password';
    END IF;
    RETURN ROW (TRUE)::ctfnote.change_password_response;
END
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.change_password (text, text) TO user_guest;

