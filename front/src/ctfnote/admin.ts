import {
  useCreateInvitationTokenMutation,
  useCreateResetPasswordTokenMutation,
  useDeleteUserByIdMutation,
  useGetUsersQuery,
  UserFragment,
  useUpdateRoleForUserIdMutation,
} from 'src/generated/graphql';
import { makeId, Role, User } from '.';
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

export function updateUserRole(user: User, role: Role) {
  const { mutate } = useUpdateRoleForUserIdMutation({});
  return mutate({ role, userId: user.id });
}

export function deleteUser(userId: number) {
  const { mutate } = useDeleteUserByIdMutation({});
  return mutate({ userId });
}

export async function createInvitationToken(role: Role) {
  const { mutate } = useCreateInvitationTokenMutation({});
  const r = await mutate({ role });
  const token = r?.data?.createInvitationLink?.invitationLinkResponse?.token;

  return token;
}

export async function createResetPasswordToken(user: User){
  const { mutate } = useCreateResetPasswordTokenMutation({});
  const r = await mutate({ userId: user.id });
  const token = r?.data?.createResetPasswordLink?.resetPasswordLinkResponse?.token;

  return token;
}