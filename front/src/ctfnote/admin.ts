import {
  useCreateInvitationTokenMutation,
  useCreateResetPasswordTokenMutation,
  useDeleteUserByIdMutation,
  useGetUsersQuery,
  UserFragment,
  useUpdateRoleForUserIdMutation,
} from 'src/generated/graphql';
import { makeId, Role, User } from './models';
import { buildProfile } from './profiles';
import { wrapQuery } from './utils';

type FullUserFragment = {
  [k in keyof UserFragment]-?: Required<NonNullable<UserFragment[k]>>;
};

/* Builders */
export function buildUser(user: FullUserFragment): User {
  return {
    ...user,
    id: makeId(user.id),
    profile: buildProfile(user.profile),
  };
}

/* Queries */
export function getUsers() {
  const q = useGetUsersQuery({});
  return wrapQuery(q, [], (data) => data.users.nodes.map(buildUser));
}

/* Mutations */

export function useUpdateUserRole() {
  const { mutate } = useUpdateRoleForUserIdMutation({});
  return (user: User, role: Role) => mutate({ role, userId: user.id });
}

export function useDeleteUser() {
  const { mutate } = useDeleteUserByIdMutation({});
  return (userId: number) => mutate({ userId });
}

export function useCreateInvitationToken() {
  const { mutate } = useCreateInvitationTokenMutation({});
  return async (role: Role) => {
    const r = await mutate({ role });
    const token = r?.data?.createInvitationLink?.invitationLinkResponse?.token;

    return token;
  };
}

export function useCreateResetPasswordToken() {
  const { mutate } = useCreateResetPasswordTokenMutation({});
  return async (user: User) => {
    const r = await mutate({ userId: user.id });
    const token =
      r?.data?.createResetPasswordLink?.resetPasswordLinkResponse?.token;

    return token;
  };
}
