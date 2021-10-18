-- PROFILE
CREATE FUNCTION ctfnote_private.notify_role_edit ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP
  WHEN 'UPDATE' THEN
    PERFORM
      ctfnote_private.notify ('update', 'profiles', NEW.id); RETURN NEW;
  END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION ctfnote_private.notify_role_edit () TO user_guest;

CREATE TRIGGER _500_gql_update_role
  AFTER UPDATE ON ctfnote_private.user
  FOR EACH ROW
  EXECUTE PROCEDURE ctfnote_private.notify_role_edit ();

