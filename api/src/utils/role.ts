export enum AllowedRoles {
  user_guest = "user_guest",
  user_friend = "user_friend",
  user_member = "user_member",
  user_manager = "user_manager",
  user_admin = "user_admin",
}

export function determineRoleByMapping(
  input: string | string[],
  mapping: Record<string, AllowedRoles | undefined>
): AllowedRoles | undefined {
  if (typeof input === "string") {
    return mapping[input];
  }

  const roles = input.map((value) => mapping[value]);
  for (const role of [
    AllowedRoles.user_admin,
    AllowedRoles.user_manager,
    AllowedRoles.user_member,
    AllowedRoles.user_friend,
    AllowedRoles.user_guest,
  ]) {
    if (roles.includes(role)) {
      return role;
    }
  }
  return undefined;
}
