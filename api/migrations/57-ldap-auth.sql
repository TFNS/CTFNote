-- Add LDAP user authentication function
-- This function will be called from the LDAP plugin to handle user creation/update

CREATE OR REPLACE FUNCTION ctfnote.login_ldap(
  "username" text, 
  "user_role" ctfnote.role, 
  "ldap_data" jsonb DEFAULT '{}'::jsonb
)
RETURNS ctfnote.jwt
AS $$
DECLARE
  existing_user ctfnote_private.user;
  new_user ctfnote_private.user;
BEGIN
  -- Check if user already exists
  SELECT * INTO existing_user 
  FROM ctfnote_private.user 
  WHERE login = username;
  
  IF existing_user.id IS NOT NULL THEN
    -- User exists, update role if different
    IF existing_user.role != user_role THEN
      UPDATE ctfnote_private.user 
      SET role = user_role 
      WHERE id = existing_user.id;
    END IF;
    
    -- Return token for existing user
    RETURN (ctfnote_private.new_token(existing_user.id))::ctfnote.jwt;
  ELSE
    -- Create new user with LDAP marker in password field
    INSERT INTO ctfnote_private.user ("login", "password", "role")
      VALUES (username, 'ldap_user', user_role)
    RETURNING * INTO new_user;
    
    -- Create profile
    INSERT INTO ctfnote.profile ("id", "username")
      VALUES (new_user.id, username);
      
    -- Return token for new user
    RETURN (ctfnote_private.new_token(new_user.id))::ctfnote.jwt;
  END IF;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Username already taken';
END;
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;

-- Grant permission to execute this function to anonymous users (for login)
GRANT EXECUTE ON FUNCTION ctfnote.login_ldap(text, ctfnote.role, jsonb) TO user_anonymous;

-- Add a function to check if LDAP is enabled (can be used by frontend)
CREATE OR REPLACE FUNCTION ctfnote.ldap_enabled()
RETURNS boolean
AS $$
BEGIN
  -- This will be determined by environment variables in the plugin
  -- For now, return false by default
  RETURN false;
END;
$$
LANGUAGE plpgsql
STABLE
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.ldap_enabled() TO user_anonymous;
