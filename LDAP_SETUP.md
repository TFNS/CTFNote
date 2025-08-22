# LDAP Authentication Setup for CTFNote

This document explains how to set up LDAP authentication for CTFNote using the provided test LDAP server.

## Overview

The LDAP authentication system allows users to log in using their LDAP credentials instead of local CTFNote accounts. Users are automatically created in CTFNote when they first log in via LDAP, and their roles are mapped based on their LDAP group membership.

## Test LDAP Server Configuration

This implementation is configured to work with the public test LDAP server at `ldap.forumsys.com`:

- **Server**: ldap.forumsys.com
- **Port**: 389  
- **Bind DN**: cn=read-only-admin,dc=example,dc=com
- **Bind Password**: password
- **Base DN**: dc=example,dc=com

### Available Test Users

All users have the password: `password`

**Mathematicians Group** (ou=mathematicians,dc=example,dc=com):
- riemann
- gauss
- euler
- euclid

**Scientists Group** (ou=scientists,dc=example,dc=com):
- einstein
- newton
- galieleo
- tesla

## Backend Changes

### 1. Configuration (api/src/config.ts)
Added LDAP configuration options with environment variable support:

```typescript
ldap: {
  enabled: boolean;
  server: string;
  port: number;
  baseDN: string;
  bindDN: string;
  bindPassword: string;
  userSearchBase: string;
  userSearchFilter: string;
  defaultRole: string;
  groupMapping: {
    mathematicians: string;
    scientists: string;
  };
}
```

### 2. LDAP Authentication Plugin (api/src/plugins/ldapAuth.ts)
- Handles LDAP authentication using the `ldap-authentication` library
- Maps LDAP groups to CTFNote roles
- Creates or updates users in the database
- Returns JWT tokens for authenticated users

### 3. Database Migration (api/migrations/60-ldap-auth.sql)
Added database functions:
- `ctfnote.login_ldap()` - Handles user creation/update for LDAP users
- `ctfnote.ldap_enabled()` - Returns LDAP status for frontend

### 4. Dependencies
- Added `ldap-authentication` package for LDAP connectivity

## Frontend Changes

### 1. Authentication Service (front/src/ctfnote/auth.ts)
- Added `useLdapLogin()` function
- GraphQL mutation for LDAP authentication

### 2. Login Component (front/src/components/Auth/Login.vue)
- Added tabs to switch between Local and LDAP authentication
- Handles both authentication methods in the submit function

## Environment Variables

Create a `.env` file in the `api` directory with the following variables:

```bash
# Enable LDAP authentication
LDAP_ENABLED=true

# LDAP Server Configuration
LDAP_SERVER=ldap.forumsys.com
LDAP_PORT=389
LDAP_BASE_DN=dc=example,dc=com

# LDAP Bind Configuration  
LDAP_BIND_DN=cn=read-only-admin,dc=example,dc=com
LDAP_BIND_PASSWORD=password

# User Search Configuration
LDAP_USER_SEARCH_BASE=dc=example,dc=com
LDAP_USER_SEARCH_FILTER=(uid={0})

# Role Mapping
LDAP_DEFAULT_ROLE=user_guest
LDAP_MATHEMATICIANS_ROLE=user_member
LDAP_SCIENTISTS_ROLE=user_member
```

## Role Mapping

The system maps LDAP groups to CTFNote roles:

- **Mathematicians** (ou=mathematicians,dc=example,dc=com) → `user_member`
- **Scientists** (ou=scientists,dc=example,dc=com) → `user_member`  
- **Default** (no group or unknown group) → `user_guest`

You can customize these mappings by changing the environment variables:
- `LDAP_MATHEMATICIANS_ROLE`
- `LDAP_SCIENTISTS_ROLE`
- `LDAP_DEFAULT_ROLE`

Available CTFNote roles:
- `user_guest` - Limited access
- `user_friend` - Friend access 
- `user_member` - Member access
- `user_manager` - Manager access
- `user_admin` - Full admin access

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd api
   yarn add ldap-authentication
   ```

2. **Set Environment Variables**:
   Copy the provided `.env.ldap` file to `.env` or add the LDAP variables to your existing `.env` file.

3. **Apply Database Migration**:
   The migration `60-ldap-auth.sql` will be applied automatically when the API starts.

4. **Start the Application**:
   ```bash
   # Start API
   cd api
   yarn start

   # Start Frontend (in another terminal)
   cd front  
   yarn dev
   ```

5. **Test LDAP Login**:
   - Navigate to the login page
   - Click on the "LDAP Login" tab
   - Use any of the test credentials (e.g., username: `einstein`, password: `password`)

## User Experience

1. **First LDAP Login**:
   - User authenticates against LDAP server
   - New CTFNote account is created automatically
   - Role is assigned based on LDAP group membership
   - User is logged into CTFNote with JWT token

2. **Subsequent LDAP Logins**:
   - User authenticates against LDAP server
   - Existing CTFNote account is found
   - Role is updated if LDAP group membership changed
   - User is logged into CTFNote with JWT token

3. **Fallback**:
   - Local authentication remains available
   - Existing local users are unaffected
   - Admin can still create local accounts

## Security Considerations

1. **LDAP Connection**: Uses unencrypted LDAP (port 389) - suitable for testing only
2. **Production Setup**: Use LDAPS (port 636) or LDAP with StartTLS for production
3. **Bind Credentials**: Store bind DN and password securely
4. **Role Mapping**: Regularly review and update role mappings
5. **User Synchronization**: Consider implementing periodic sync for role updates

## Troubleshooting

### Common Issues

1. **LDAP Connection Failed**:
   - Check server address and port
   - Verify network connectivity
   - Ensure LDAP server is accessible

2. **Authentication Failed**:
   - Verify bind DN and password
   - Check user search base and filter
   - Confirm user exists in LDAP directory

3. **Role Mapping Issues**:
   - Review group membership in LDAP
   - Check group mapping configuration
   - Verify role mapping environment variables

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=ldap-authentication
```

This will provide detailed LDAP operation logs for troubleshooting.

## Production Deployment

For production deployment:

1. **Use Secure LDAP**:
   ```bash
   LDAP_SERVER=your-ldap-server.com
   LDAP_PORT=636  # or 389 with StartTLS
   ```

2. **Secure Credentials**:
   - Use dedicated service account for LDAP binding
   - Store credentials in secure secret management system
   - Rotate credentials regularly

3. **Monitor and Audit**:
   - Log all LDAP authentication attempts
   - Monitor for suspicious activity
   - Regular security audits

4. **Error Handling**:
   - Implement proper error handling
   - Fallback authentication methods
   - User-friendly error messages
