import gql from 'graphql-tag';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type ReactiveFunction<TParam> = () => TParam;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: any;
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.
   */
  Datetime: string;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: string;
  /**
   * A JSON Web Token defined by [RFC 7519](https://tools.ietf.org/html/rfc7519)
   * which securely represents claims between two parties.
   */
  Jwt: string;
};

/** All input for the `changePassword` mutation. */
export type ChangePasswordInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  newpassword: Scalars['String'];
  oldpassword: Scalars['String'];
};

/** The output of our `changePassword` mutation. */
export type ChangePasswordPayload = {
  __typename?: 'ChangePasswordPayload';
  changePasswordResponse?: Maybe<ChangePasswordResponse>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

export type ChangePasswordResponse = {
  __typename?: 'ChangePasswordResponse';
  ok?: Maybe<Scalars['Boolean']>;
};

/** All input for the create `Ctf` mutation. */
export type CreateCtfInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Ctf` to be created by this mutation. */
  ctf: CtfInput;
};

/** The output of our create `Ctf` mutation. */
export type CreateCtfPayload = {
  __typename?: 'CreateCtfPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Ctf` that was created by this mutation. */
  ctf?: Maybe<Ctf>;
  /** An edge for our `Ctf`. May be used by Relay 1. */
  ctfEdge?: Maybe<CtfsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `CtfSecret` that is related to this `Ctf`. */
  secrets?: Maybe<CtfSecret>;
};


/** The output of our create `Ctf` mutation. */
export type CreateCtfPayloadCtfEdgeArgs = {
  orderBy?: Maybe<Array<CtfsOrderBy>>;
};

/** All input for the create `Invitation` mutation. */
export type CreateInvitationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Invitation` to be created by this mutation. */
  invitation: InvitationInput;
};

/** All input for the `createInvitationLink` mutation. */
export type CreateInvitationLinkInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  role?: Maybe<Role>;
};

/** The output of our `createInvitationLink` mutation. */
export type CreateInvitationLinkPayload = {
  __typename?: 'CreateInvitationLinkPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  invitationLinkResponse?: Maybe<InvitationLinkResponse>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `Invitation` mutation. */
export type CreateInvitationPayload = {
  __typename?: 'CreateInvitationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Ctf` that is related to this `Invitation`. */
  ctf?: Maybe<Ctf>;
  /** The `Invitation` that was created by this mutation. */
  invitation?: Maybe<Invitation>;
  /** An edge for our `Invitation`. May be used by Relay 1. */
  invitationEdge?: Maybe<InvitationsEdge>;
  /** Reads a single `Profile` that is related to this `Invitation`. */
  profile?: Maybe<Profile>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Invitation` mutation. */
export type CreateInvitationPayloadInvitationEdgeArgs = {
  orderBy?: Maybe<Array<InvitationsOrderBy>>;
};

/** All input for the `createResetPasswordLink` mutation. */
export type CreateResetPasswordLinkInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['Int']>;
};

/** The output of our `createResetPasswordLink` mutation. */
export type CreateResetPasswordLinkPayload = {
  __typename?: 'CreateResetPasswordLinkPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  resetPasswordLinkResponse?: Maybe<ResetPasswordLinkResponse>;
};

export type CreateTaskInput = {
  category?: Maybe<Scalars['String']>;
  ctfId: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  flag?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type CreateTaskPayload = {
  __typename?: 'CreateTaskPayload';
  query?: Maybe<Query>;
  task?: Maybe<Task>;
};

export type Ctf = Node & {
  __typename?: 'Ctf';
  ctfUrl?: Maybe<Scalars['String']>;
  ctftimeUrl?: Maybe<Scalars['String']>;
  description: Scalars['String'];
  endTime: Scalars['Datetime'];
  granted?: Maybe<Scalars['Boolean']>;
  id: Scalars['Int'];
  /** Reads and enables pagination through a set of `Invitation`. */
  invitations: InvitationsConnection;
  logoUrl?: Maybe<Scalars['String']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  /** Reads a single `CtfSecret` that is related to this `Ctf`. */
  secrets?: Maybe<CtfSecret>;
  secretsId: Scalars['Int'];
  startTime: Scalars['Datetime'];
  /** Reads and enables pagination through a set of `Task`. */
  tasks: TasksConnection;
  title: Scalars['String'];
  weight: Scalars['Float'];
};


export type CtfInvitationsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<InvitationCondition>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<InvitationsOrderBy>>;
};


export type CtfTasksArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<TaskCondition>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<TasksOrderBy>>;
};

/** A condition to be used against `Ctf` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type CtfCondition = {
  /** Checks for equality with the object’s `endTime` field. */
  endTime?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `secretsId` field. */
  secretsId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `startTime` field. */
  startTime?: Maybe<Scalars['Datetime']>;
};

/** An input for mutations affecting `Ctf` */
export type CtfInput = {
  ctfUrl?: Maybe<Scalars['String']>;
  ctftimeUrl?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  endTime: Scalars['Datetime'];
  logoUrl?: Maybe<Scalars['String']>;
  startTime: Scalars['Datetime'];
  title: Scalars['String'];
  weight?: Maybe<Scalars['Float']>;
};

/** Represents an update to a `Ctf`. Fields that are set will be updated. */
export type CtfPatch = {
  ctfUrl?: Maybe<Scalars['String']>;
  ctftimeUrl?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  endTime?: Maybe<Scalars['Datetime']>;
  logoUrl?: Maybe<Scalars['String']>;
  startTime?: Maybe<Scalars['Datetime']>;
  title?: Maybe<Scalars['String']>;
  weight?: Maybe<Scalars['Float']>;
};

export type CtfSecret = Node & {
  __typename?: 'CtfSecret';
  credentials?: Maybe<Scalars['String']>;
  /** Reads and enables pagination through a set of `Ctf`. */
  ctfsBySecretsId: CtfsConnection;
  id: Scalars['Int'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};


export type CtfSecretCtfsBySecretsIdArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<CtfCondition>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<CtfsOrderBy>>;
};

/**
 * A condition to be used against `CtfSecret` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type CtfSecretCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
};

/** Represents an update to a `CtfSecret`. Fields that are set will be updated. */
export type CtfSecretPatch = {
  credentials?: Maybe<Scalars['String']>;
};

/** A connection to a list of `CtfSecret` values. */
export type CtfSecretsConnection = {
  __typename?: 'CtfSecretsConnection';
  /** A list of edges which contains the `CtfSecret` and cursor to aid in pagination. */
  edges: Array<CtfSecretsEdge>;
  /** A list of `CtfSecret` objects. */
  nodes: Array<CtfSecret>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CtfSecret` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `CtfSecret` edge in the connection. */
export type CtfSecretsEdge = {
  __typename?: 'CtfSecretsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `CtfSecret` at the end of the edge. */
  node: CtfSecret;
};

/** Methods to use when ordering `CtfSecret`. */
export enum CtfSecretsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A connection to a list of `Ctf` values. */
export type CtfsConnection = {
  __typename?: 'CtfsConnection';
  /** A list of edges which contains the `Ctf` and cursor to aid in pagination. */
  edges: Array<CtfsEdge>;
  /** A list of `Ctf` objects. */
  nodes: Array<Ctf>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Ctf` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Ctf` edge in the connection. */
export type CtfsEdge = {
  __typename?: 'CtfsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Ctf` at the end of the edge. */
  node: Ctf;
};

/** Methods to use when ordering `Ctf`. */
export enum CtfsOrderBy {
  EndTimeAsc = 'END_TIME_ASC',
  EndTimeDesc = 'END_TIME_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SecretsIdAsc = 'SECRETS_ID_ASC',
  SecretsIdDesc = 'SECRETS_ID_DESC',
  StartTimeAsc = 'START_TIME_ASC',
  StartTimeDesc = 'START_TIME_DESC'
}

/** All input for the `deleteCtfByNodeId` mutation. */
export type DeleteCtfByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Ctf` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteCtf` mutation. */
export type DeleteCtfInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** The output of our delete `Ctf` mutation. */
export type DeleteCtfPayload = {
  __typename?: 'DeleteCtfPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Ctf` that was deleted by this mutation. */
  ctf?: Maybe<Ctf>;
  /** An edge for our `Ctf`. May be used by Relay 1. */
  ctfEdge?: Maybe<CtfsEdge>;
  deletedCtfNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `CtfSecret` that is related to this `Ctf`. */
  secrets?: Maybe<CtfSecret>;
};


/** The output of our delete `Ctf` mutation. */
export type DeleteCtfPayloadCtfEdgeArgs = {
  orderBy?: Maybe<Array<CtfsOrderBy>>;
};

/** All input for the `deleteInvitationByNodeId` mutation. */
export type DeleteInvitationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Invitation` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteInvitation` mutation. */
export type DeleteInvitationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  ctfId: Scalars['Int'];
  profileId: Scalars['Int'];
};

/** The output of our delete `Invitation` mutation. */
export type DeleteInvitationPayload = {
  __typename?: 'DeleteInvitationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Ctf` that is related to this `Invitation`. */
  ctf?: Maybe<Ctf>;
  deletedInvitationNodeId?: Maybe<Scalars['ID']>;
  /** The `Invitation` that was deleted by this mutation. */
  invitation?: Maybe<Invitation>;
  /** An edge for our `Invitation`. May be used by Relay 1. */
  invitationEdge?: Maybe<InvitationsEdge>;
  /** Reads a single `Profile` that is related to this `Invitation`. */
  profile?: Maybe<Profile>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Invitation` mutation. */
export type DeleteInvitationPayloadInvitationEdgeArgs = {
  orderBy?: Maybe<Array<InvitationsOrderBy>>;
};

/** All input for the `deleteTaskByNodeId` mutation. */
export type DeleteTaskByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Task` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteTask` mutation. */
export type DeleteTaskInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** The output of our delete `Task` mutation. */
export type DeleteTaskPayload = {
  __typename?: 'DeleteTaskPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Ctf` that is related to this `Task`. */
  ctf?: Maybe<Ctf>;
  deletedTaskNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Task` that was deleted by this mutation. */
  task?: Maybe<Task>;
  /** An edge for our `Task`. May be used by Relay 1. */
  taskEdge?: Maybe<TasksEdge>;
};


/** The output of our delete `Task` mutation. */
export type DeleteTaskPayloadTaskEdgeArgs = {
  orderBy?: Maybe<Array<TasksOrderBy>>;
};

/** All input for the `deleteUser` mutation. */
export type DeleteUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['Int']>;
};

/** The output of our `deleteUser` mutation. */
export type DeleteUserPayload = {
  __typename?: 'DeleteUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  userResponse?: Maybe<UserResponse>;
};

export type ImportCtfInput = {
  ctftimeId: Scalars['Int'];
};

export type ImportCtfPayload = {
  __typename?: 'ImportCtfPayload';
  ctf?: Maybe<Ctf>;
  query?: Maybe<Query>;
};

export type Invitation = Node & {
  __typename?: 'Invitation';
  /** Reads a single `Ctf` that is related to this `Invitation`. */
  ctf?: Maybe<Ctf>;
  ctfId: Scalars['Int'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  /** Reads a single `Profile` that is related to this `Invitation`. */
  profile?: Maybe<Profile>;
  profileId: Scalars['Int'];
};

/**
 * A condition to be used against `Invitation` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type InvitationCondition = {
  /** Checks for equality with the object’s `ctfId` field. */
  ctfId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `profileId` field. */
  profileId?: Maybe<Scalars['Int']>;
};

/** An input for mutations affecting `Invitation` */
export type InvitationInput = {
  ctfId: Scalars['Int'];
  profileId: Scalars['Int'];
};

export type InvitationLinkResponse = {
  __typename?: 'InvitationLinkResponse';
  token?: Maybe<Scalars['String']>;
};

/** A connection to a list of `Invitation` values. */
export type InvitationsConnection = {
  __typename?: 'InvitationsConnection';
  /** A list of edges which contains the `Invitation` and cursor to aid in pagination. */
  edges: Array<InvitationsEdge>;
  /** A list of `Invitation` objects. */
  nodes: Array<Invitation>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Invitation` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Invitation` edge in the connection. */
export type InvitationsEdge = {
  __typename?: 'InvitationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Invitation` at the end of the edge. */
  node: Invitation;
};

/** Methods to use when ordering `Invitation`. */
export enum InvitationsOrderBy {
  CtfIdAsc = 'CTF_ID_ASC',
  CtfIdDesc = 'CTF_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProfileIdAsc = 'PROFILE_ID_ASC',
  ProfileIdDesc = 'PROFILE_ID_DESC'
}

export type ListenPayload = {
  __typename?: 'ListenPayload';
  /** Our root query field type. Allows us to run any query from our subscription payload. */
  query?: Maybe<Query>;
  relatedNode?: Maybe<Node>;
  relatedNodeId?: Maybe<Scalars['ID']>;
};

/** All input for the `login` mutation. */
export type LoginInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  login: Scalars['String'];
  password: Scalars['String'];
};

/** The output of our `login` mutation. */
export type LoginPayload = {
  __typename?: 'LoginPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  jwt?: Maybe<Scalars['Jwt']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

export type MeResponse = {
  __typename?: 'MeResponse';
  jwt?: Maybe<Scalars['Jwt']>;
  profile?: Maybe<Profile>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  changePassword?: Maybe<ChangePasswordPayload>;
  /** Creates a single `Ctf`. */
  createCtf?: Maybe<CreateCtfPayload>;
  /** Creates a single `Invitation`. */
  createInvitation?: Maybe<CreateInvitationPayload>;
  createInvitationLink?: Maybe<CreateInvitationLinkPayload>;
  createResetPasswordLink?: Maybe<CreateResetPasswordLinkPayload>;
  createTask?: Maybe<CreateTaskPayload>;
  /** Deletes a single `Ctf` using a unique key. */
  deleteCtf?: Maybe<DeleteCtfPayload>;
  /** Deletes a single `Ctf` using its globally unique id. */
  deleteCtfByNodeId?: Maybe<DeleteCtfPayload>;
  /** Deletes a single `Invitation` using a unique key. */
  deleteInvitation?: Maybe<DeleteInvitationPayload>;
  /** Deletes a single `Invitation` using its globally unique id. */
  deleteInvitationByNodeId?: Maybe<DeleteInvitationPayload>;
  /** Deletes a single `Task` using a unique key. */
  deleteTask?: Maybe<DeleteTaskPayload>;
  /** Deletes a single `Task` using its globally unique id. */
  deleteTaskByNodeId?: Maybe<DeleteTaskPayload>;
  deleteUser?: Maybe<DeleteUserPayload>;
  importCtf?: Maybe<ImportCtfPayload>;
  login?: Maybe<LoginPayload>;
  register?: Maybe<RegisterPayload>;
  registerWithPassword?: Maybe<RegisterWithPasswordPayload>;
  registerWithToken?: Maybe<RegisterWithTokenPayload>;
  resetPassword?: Maybe<ResetPasswordPayload>;
  startWorkingOn?: Maybe<StartWorkingOnPayload>;
  stopWorkingOn?: Maybe<StopWorkingOnPayload>;
  /** Updates a single `Ctf` using a unique key and a patch. */
  updateCtf?: Maybe<UpdateCtfPayload>;
  /** Updates a single `Ctf` using its globally unique id and a patch. */
  updateCtfByNodeId?: Maybe<UpdateCtfPayload>;
  /** Updates a single `CtfSecret` using a unique key and a patch. */
  updateCtfSecret?: Maybe<UpdateCtfSecretPayload>;
  /** Updates a single `CtfSecret` using its globally unique id and a patch. */
  updateCtfSecretByNodeId?: Maybe<UpdateCtfSecretPayload>;
  /** Updates a single `Profile` using a unique key and a patch. */
  updateProfile?: Maybe<UpdateProfilePayload>;
  /** Updates a single `Profile` using its globally unique id and a patch. */
  updateProfileByNodeId?: Maybe<UpdateProfilePayload>;
  /** Updates a single `Profile` using a unique key and a patch. */
  updateProfileByUsername?: Maybe<UpdateProfilePayload>;
  /** Updates a single `Setting` using its globally unique id and a patch. */
  updateSettingByNodeId?: Maybe<UpdateSettingPayload>;
  /** Updates a single `Task` using a unique key and a patch. */
  updateTask?: Maybe<UpdateTaskPayload>;
  /** Updates a single `Task` using its globally unique id and a patch. */
  updateTaskByNodeId?: Maybe<UpdateTaskPayload>;
  updateUserRole?: Maybe<UpdateUserRolePayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCtfArgs = {
  input: CreateCtfInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateInvitationArgs = {
  input: CreateInvitationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateInvitationLinkArgs = {
  input: CreateInvitationLinkInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateResetPasswordLinkArgs = {
  input: CreateResetPasswordLinkInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTaskArgs = {
  input?: Maybe<CreateTaskInput>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCtfArgs = {
  input: DeleteCtfInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCtfByNodeIdArgs = {
  input: DeleteCtfByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteInvitationArgs = {
  input: DeleteInvitationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteInvitationByNodeIdArgs = {
  input: DeleteInvitationByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTaskArgs = {
  input: DeleteTaskInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTaskByNodeIdArgs = {
  input: DeleteTaskByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationImportCtfArgs = {
  input?: Maybe<ImportCtfInput>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationLoginArgs = {
  input: LoginInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationRegisterArgs = {
  input: RegisterInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationRegisterWithPasswordArgs = {
  input: RegisterWithPasswordInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationRegisterWithTokenArgs = {
  input: RegisterWithTokenInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationStartWorkingOnArgs = {
  input: StartWorkingOnInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationStopWorkingOnArgs = {
  input: StopWorkingOnInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCtfArgs = {
  input: UpdateCtfInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCtfByNodeIdArgs = {
  input: UpdateCtfByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCtfSecretArgs = {
  input: UpdateCtfSecretInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCtfSecretByNodeIdArgs = {
  input: UpdateCtfSecretByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProfileByNodeIdArgs = {
  input: UpdateProfileByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProfileByUsernameArgs = {
  input: UpdateProfileByUsernameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSettingByNodeIdArgs = {
  input: UpdateSettingByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTaskByNodeIdArgs = {
  input: UpdateTaskByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserRoleArgs = {
  input: UpdateUserRoleInput;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']>;
};

export type Profile = Node & {
  __typename?: 'Profile';
  color?: Maybe<Scalars['String']>;
  description: Scalars['String'];
  id: Scalars['Int'];
  /** Reads and enables pagination through a set of `Invitation`. */
  invitations: InvitationsConnection;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  role?: Maybe<Role>;
  username: Scalars['String'];
  /** Reads and enables pagination through a set of `WorkOnTask`. */
  workOnTasks: WorkOnTasksConnection;
};


export type ProfileInvitationsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<InvitationCondition>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<InvitationsOrderBy>>;
};


export type ProfileWorkOnTasksArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<WorkOnTaskCondition>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<WorkOnTasksOrderBy>>;
};

/** A condition to be used against `Profile` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ProfileCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `username` field. */
  username?: Maybe<Scalars['String']>;
};

/** Represents an update to a `Profile`. Fields that are set will be updated. */
export type ProfilePatch = {
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

/** A connection to a list of `Profile` values. */
export type ProfilesConnection = {
  __typename?: 'ProfilesConnection';
  /** A list of edges which contains the `Profile` and cursor to aid in pagination. */
  edges: Array<ProfilesEdge>;
  /** A list of `Profile` objects. */
  nodes: Array<Profile>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Profile` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Profile` edge in the connection. */
export type ProfilesEdge = {
  __typename?: 'ProfilesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Profile` at the end of the edge. */
  node: Profile;
};

/** Methods to use when ordering `Profile`. */
export enum ProfilesOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UsernameAsc = 'USERNAME_ASC',
  UsernameDesc = 'USERNAME_DESC'
}

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  ctf?: Maybe<Ctf>;
  /** Reads a single `Ctf` using its globally unique `ID`. */
  ctfByNodeId?: Maybe<Ctf>;
  ctfSecret?: Maybe<CtfSecret>;
  /** Reads a single `CtfSecret` using its globally unique `ID`. */
  ctfSecretByNodeId?: Maybe<CtfSecret>;
  /** Reads and enables pagination through a set of `CtfSecret`. */
  ctfSecrets?: Maybe<CtfSecretsConnection>;
  /** Reads and enables pagination through a set of `Ctf`. */
  ctfs?: Maybe<CtfsConnection>;
  /** Reads and enables pagination through a set of `Profile`. */
  guests?: Maybe<ProfilesConnection>;
  /** Reads and enables pagination through a set of `Ctf`. */
  incomingCtf?: Maybe<CtfsConnection>;
  invitation?: Maybe<Invitation>;
  /** Reads a single `Invitation` using its globally unique `ID`. */
  invitationByNodeId?: Maybe<Invitation>;
  /** Reads and enables pagination through a set of `Invitation`. */
  invitations?: Maybe<InvitationsConnection>;
  me?: Maybe<MeResponse>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID'];
  /** Reads and enables pagination through a set of `Ctf`. */
  pastCtf?: Maybe<CtfsConnection>;
  profile?: Maybe<Profile>;
  /** Reads a single `Profile` using its globally unique `ID`. */
  profileByNodeId?: Maybe<Profile>;
  profileByUsername?: Maybe<Profile>;
  /** Reads and enables pagination through a set of `Profile`. */
  profiles?: Maybe<ProfilesConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** Reads a single `Setting` using its globally unique `ID`. */
  settingByNodeId?: Maybe<Setting>;
  /** Reads and enables pagination through a set of `Setting`. */
  settings?: Maybe<SettingsConnection>;
  task?: Maybe<Task>;
  /** Reads a single `Task` using its globally unique `ID`. */
  taskByNodeId?: Maybe<Task>;
  /** Reads and enables pagination through a set of `Task`. */
  tasks?: Maybe<TasksConnection>;
  /** Reads and enables pagination through a set of `User`. */
  users?: Maybe<UsersConnection>;
  workOnTask?: Maybe<WorkOnTask>;
  /** Reads a single `WorkOnTask` using its globally unique `ID`. */
  workOnTaskByNodeId?: Maybe<WorkOnTask>;
  /** Reads and enables pagination through a set of `WorkOnTask`. */
  workOnTasks?: Maybe<WorkOnTasksConnection>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCtfArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCtfByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCtfSecretArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCtfSecretByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCtfSecretsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<CtfSecretCondition>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<CtfSecretsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCtfsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<CtfCondition>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<CtfsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGuestsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryIncomingCtfArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryInvitationArgs = {
  ctfId: Scalars['Int'];
  profileId: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryInvitationByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryInvitationsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<InvitationCondition>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<InvitationsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPastCtfArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryProfileArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProfileByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProfileByUsernameArgs = {
  username: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProfilesArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<ProfileCondition>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<ProfilesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySettingByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySettingsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<SettingsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTaskArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTaskByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTasksArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<TaskCondition>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<TasksOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryUsersArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<UsersOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkOnTaskArgs = {
  profileId: Scalars['Int'];
  taskId: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkOnTaskByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkOnTasksArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<WorkOnTaskCondition>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<WorkOnTasksOrderBy>>;
};

/** All input for the `register` mutation. */
export type RegisterInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  login: Scalars['String'];
  password: Scalars['String'];
};

/** The output of our `register` mutation. */
export type RegisterPayload = {
  __typename?: 'RegisterPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  jwt?: Maybe<Scalars['Jwt']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `registerWithPassword` mutation. */
export type RegisterWithPasswordInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  ctfnotePassword: Scalars['String'];
  login: Scalars['String'];
  password: Scalars['String'];
};

/** The output of our `registerWithPassword` mutation. */
export type RegisterWithPasswordPayload = {
  __typename?: 'RegisterWithPasswordPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  jwt?: Maybe<Scalars['Jwt']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `registerWithToken` mutation. */
export type RegisterWithTokenInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  login?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

/** The output of our `registerWithToken` mutation. */
export type RegisterWithTokenPayload = {
  __typename?: 'RegisterWithTokenPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  jwt?: Maybe<Scalars['Jwt']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `resetPassword` mutation. */
export type ResetPasswordInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

export type ResetPasswordLinkResponse = {
  __typename?: 'ResetPasswordLinkResponse';
  token?: Maybe<Scalars['String']>;
};

/** The output of our `resetPassword` mutation. */
export type ResetPasswordPayload = {
  __typename?: 'ResetPasswordPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  jwt?: Maybe<Scalars['Jwt']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

export enum Role {
  UserAdmin = 'USER_ADMIN',
  UserGuest = 'USER_GUEST',
  UserManager = 'USER_MANAGER',
  UserMember = 'USER_MEMBER'
}

export type Setting = Node & {
  __typename?: 'Setting';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  registrationAllowed: Scalars['Boolean'];
  registrationDefaultRole: Role;
  registrationPassword: Scalars['String'];
  registrationPasswordAllowed: Scalars['Boolean'];
  style: Scalars['JSON'];
};

/** Represents an update to a `Setting`. Fields that are set will be updated. */
export type SettingPatch = {
  registrationAllowed?: Maybe<Scalars['Boolean']>;
  registrationDefaultRole?: Maybe<Role>;
  registrationPassword?: Maybe<Scalars['String']>;
  registrationPasswordAllowed?: Maybe<Scalars['Boolean']>;
  style?: Maybe<Scalars['JSON']>;
};

/** A connection to a list of `Setting` values. */
export type SettingsConnection = {
  __typename?: 'SettingsConnection';
  /** A list of edges which contains the `Setting` and cursor to aid in pagination. */
  edges: Array<SettingsEdge>;
  /** A list of `Setting` objects. */
  nodes: Array<Setting>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Setting` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Setting` edge in the connection. */
export type SettingsEdge = {
  __typename?: 'SettingsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Setting` at the end of the edge. */
  node: Setting;
};

/** Methods to use when ordering `Setting`. */
export enum SettingsOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** All input for the `startWorkingOn` mutation. */
export type StartWorkingOnInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  taskId?: Maybe<Scalars['Int']>;
};

/** The output of our `startWorkingOn` mutation. */
export type StartWorkingOnPayload = {
  __typename?: 'StartWorkingOnPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Profile` that is related to this `WorkOnTask`. */
  profile?: Maybe<Profile>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Task` that is related to this `WorkOnTask`. */
  task?: Maybe<Task>;
  workOnTask?: Maybe<WorkOnTask>;
  /** An edge for our `WorkOnTask`. May be used by Relay 1. */
  workOnTaskEdge?: Maybe<WorkOnTasksEdge>;
};


/** The output of our `startWorkingOn` mutation. */
export type StartWorkingOnPayloadWorkOnTaskEdgeArgs = {
  orderBy?: Maybe<Array<WorkOnTasksOrderBy>>;
};

/** All input for the `stopWorkingOn` mutation. */
export type StopWorkingOnInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  taskId?: Maybe<Scalars['Int']>;
};

/** The output of our `stopWorkingOn` mutation. */
export type StopWorkingOnPayload = {
  __typename?: 'StopWorkingOnPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Profile` that is related to this `WorkOnTask`. */
  profile?: Maybe<Profile>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Task` that is related to this `WorkOnTask`. */
  task?: Maybe<Task>;
  workOnTask?: Maybe<WorkOnTask>;
  /** An edge for our `WorkOnTask`. May be used by Relay 1. */
  workOnTaskEdge?: Maybe<WorkOnTasksEdge>;
};


/** The output of our `stopWorkingOn` mutation. */
export type StopWorkingOnPayloadWorkOnTaskEdgeArgs = {
  orderBy?: Maybe<Array<WorkOnTasksOrderBy>>;
};

/** The root subscription type: contains realtime events you can subscribe to with the `subscription` operation. */
export type Subscription = {
  __typename?: 'Subscription';
  listen: ListenPayload;
};


/** The root subscription type: contains realtime events you can subscribe to with the `subscription` operation. */
export type SubscriptionListenArgs = {
  topic: Scalars['String'];
};

export type Task = Node & {
  __typename?: 'Task';
  category: Scalars['String'];
  /** Reads a single `Ctf` that is related to this `Task`. */
  ctf?: Maybe<Ctf>;
  ctfId: Scalars['Int'];
  description: Scalars['String'];
  flag: Scalars['String'];
  id: Scalars['Int'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  padUrl: Scalars['String'];
  solved?: Maybe<Scalars['Boolean']>;
  title: Scalars['String'];
  /** Reads and enables pagination through a set of `WorkOnTask`. */
  workOnTasks: WorkOnTasksConnection;
};


export type TaskWorkOnTasksArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<WorkOnTaskCondition>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<WorkOnTasksOrderBy>>;
};

/** A condition to be used against `Task` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TaskCondition = {
  /** Checks for equality with the object’s `ctfId` field. */
  ctfId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
};

/** Represents an update to a `Task`. Fields that are set will be updated. */
export type TaskPatch = {
  category?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  flag?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

/** A connection to a list of `Task` values. */
export type TasksConnection = {
  __typename?: 'TasksConnection';
  /** A list of edges which contains the `Task` and cursor to aid in pagination. */
  edges: Array<TasksEdge>;
  /** A list of `Task` objects. */
  nodes: Array<Task>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Task` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Task` edge in the connection. */
export type TasksEdge = {
  __typename?: 'TasksEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Task` at the end of the edge. */
  node: Task;
};

/** Methods to use when ordering `Task`. */
export enum TasksOrderBy {
  CtfIdAsc = 'CTF_ID_ASC',
  CtfIdDesc = 'CTF_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** All input for the `updateCtfByNodeId` mutation. */
export type UpdateCtfByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Ctf` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Ctf` being updated. */
  patch: CtfPatch;
};

/** All input for the `updateCtf` mutation. */
export type UpdateCtfInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `Ctf` being updated. */
  patch: CtfPatch;
};

/** The output of our update `Ctf` mutation. */
export type UpdateCtfPayload = {
  __typename?: 'UpdateCtfPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Ctf` that was updated by this mutation. */
  ctf?: Maybe<Ctf>;
  /** An edge for our `Ctf`. May be used by Relay 1. */
  ctfEdge?: Maybe<CtfsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `CtfSecret` that is related to this `Ctf`. */
  secrets?: Maybe<CtfSecret>;
};


/** The output of our update `Ctf` mutation. */
export type UpdateCtfPayloadCtfEdgeArgs = {
  orderBy?: Maybe<Array<CtfsOrderBy>>;
};

/** All input for the `updateCtfSecretByNodeId` mutation. */
export type UpdateCtfSecretByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `CtfSecret` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `CtfSecret` being updated. */
  patch: CtfSecretPatch;
};

/** All input for the `updateCtfSecret` mutation. */
export type UpdateCtfSecretInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `CtfSecret` being updated. */
  patch: CtfSecretPatch;
};

/** The output of our update `CtfSecret` mutation. */
export type UpdateCtfSecretPayload = {
  __typename?: 'UpdateCtfSecretPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `CtfSecret` that was updated by this mutation. */
  ctfSecret?: Maybe<CtfSecret>;
  /** An edge for our `CtfSecret`. May be used by Relay 1. */
  ctfSecretEdge?: Maybe<CtfSecretsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `CtfSecret` mutation. */
export type UpdateCtfSecretPayloadCtfSecretEdgeArgs = {
  orderBy?: Maybe<Array<CtfSecretsOrderBy>>;
};

/** All input for the `updateProfileByNodeId` mutation. */
export type UpdateProfileByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Profile` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Profile` being updated. */
  patch: ProfilePatch;
};

/** All input for the `updateProfileByUsername` mutation. */
export type UpdateProfileByUsernameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Profile` being updated. */
  patch: ProfilePatch;
  username: Scalars['String'];
};

/** All input for the `updateProfile` mutation. */
export type UpdateProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `Profile` being updated. */
  patch: ProfilePatch;
};

/** The output of our update `Profile` mutation. */
export type UpdateProfilePayload = {
  __typename?: 'UpdateProfilePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Profile` that was updated by this mutation. */
  profile?: Maybe<Profile>;
  /** An edge for our `Profile`. May be used by Relay 1. */
  profileEdge?: Maybe<ProfilesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Profile` mutation. */
export type UpdateProfilePayloadProfileEdgeArgs = {
  orderBy?: Maybe<Array<ProfilesOrderBy>>;
};

/** All input for the `updateSettingByNodeId` mutation. */
export type UpdateSettingByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Setting` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Setting` being updated. */
  patch: SettingPatch;
};

/** The output of our update `Setting` mutation. */
export type UpdateSettingPayload = {
  __typename?: 'UpdateSettingPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Setting` that was updated by this mutation. */
  setting?: Maybe<Setting>;
  /** An edge for our `Setting`. May be used by Relay 1. */
  settingEdge?: Maybe<SettingsEdge>;
};


/** The output of our update `Setting` mutation. */
export type UpdateSettingPayloadSettingEdgeArgs = {
  orderBy?: Maybe<Array<SettingsOrderBy>>;
};

/** All input for the `updateTaskByNodeId` mutation. */
export type UpdateTaskByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Task` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Task` being updated. */
  patch: TaskPatch;
};

/** All input for the `updateTask` mutation. */
export type UpdateTaskInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `Task` being updated. */
  patch: TaskPatch;
};

/** The output of our update `Task` mutation. */
export type UpdateTaskPayload = {
  __typename?: 'UpdateTaskPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Ctf` that is related to this `Task`. */
  ctf?: Maybe<Ctf>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Task` that was updated by this mutation. */
  task?: Maybe<Task>;
  /** An edge for our `Task`. May be used by Relay 1. */
  taskEdge?: Maybe<TasksEdge>;
};


/** The output of our update `Task` mutation. */
export type UpdateTaskPayloadTaskEdgeArgs = {
  orderBy?: Maybe<Array<TasksOrderBy>>;
};

/** All input for the `updateUserRole` mutation. */
export type UpdateUserRoleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  role?: Maybe<Role>;
  userId?: Maybe<Scalars['Int']>;
};

/** The output of our `updateUserRole` mutation. */
export type UpdateUserRolePayload = {
  __typename?: 'UpdateUserRolePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  role?: Maybe<Role>;
};

export type User = {
  __typename?: 'User';
  id?: Maybe<Scalars['Int']>;
  login?: Maybe<Scalars['String']>;
  nodeId?: Maybe<Scalars['String']>;
  profile?: Maybe<Profile>;
  role?: Maybe<Role>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  id?: Maybe<Scalars['Int']>;
  login?: Maybe<Scalars['String']>;
  role?: Maybe<Role>;
};

/** A connection to a list of `User` values. */
export type UsersConnection = {
  __typename?: 'UsersConnection';
  /** A list of edges which contains the `User` and cursor to aid in pagination. */
  edges: Array<UsersEdge>;
  /** A list of `User` objects. */
  nodes: Array<User>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `User` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `User` edge in the connection. */
export type UsersEdge = {
  __typename?: 'UsersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `User` at the end of the edge. */
  node: User;
};

/** Methods to use when ordering `User`. */
export enum UsersOrderBy {
  Natural = 'NATURAL'
}

export type WorkOnTask = Node & {
  __typename?: 'WorkOnTask';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  /** Reads a single `Profile` that is related to this `WorkOnTask`. */
  profile?: Maybe<Profile>;
  profileId: Scalars['Int'];
  /** Reads a single `Task` that is related to this `WorkOnTask`. */
  task?: Maybe<Task>;
  taskId: Scalars['Int'];
};

/**
 * A condition to be used against `WorkOnTask` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type WorkOnTaskCondition = {
  /** Checks for equality with the object’s `profileId` field. */
  profileId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `taskId` field. */
  taskId?: Maybe<Scalars['Int']>;
};

/** A connection to a list of `WorkOnTask` values. */
export type WorkOnTasksConnection = {
  __typename?: 'WorkOnTasksConnection';
  /** A list of edges which contains the `WorkOnTask` and cursor to aid in pagination. */
  edges: Array<WorkOnTasksEdge>;
  /** A list of `WorkOnTask` objects. */
  nodes: Array<WorkOnTask>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `WorkOnTask` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `WorkOnTask` edge in the connection. */
export type WorkOnTasksEdge = {
  __typename?: 'WorkOnTasksEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `WorkOnTask` at the end of the edge. */
  node: WorkOnTask;
};

/** Methods to use when ordering `WorkOnTask`. */
export enum WorkOnTasksOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProfileIdAsc = 'PROFILE_ID_ASC',
  ProfileIdDesc = 'PROFILE_ID_DESC',
  TaskIdAsc = 'TASK_ID_ASC',
  TaskIdDesc = 'TASK_ID_DESC'
}

export type UserFragment = { __typename?: 'User', nodeId?: string | null | undefined, login?: string | null | undefined, role?: Role | null | undefined, id?: number | null | undefined, profile?: { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string } | null | undefined };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users?: { __typename?: 'UsersConnection', nodes: Array<{ __typename?: 'User', nodeId?: string | null | undefined, login?: string | null | undefined, role?: Role | null | undefined, id?: number | null | undefined, profile?: { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string } | null | undefined }> } | null | undefined };

export type CreateInvitationTokenMutationVariables = Exact<{
  role: Role;
}>;


export type CreateInvitationTokenMutation = { __typename?: 'Mutation', createInvitationLink?: { __typename?: 'CreateInvitationLinkPayload', invitationLinkResponse?: { __typename?: 'InvitationLinkResponse', token?: string | null | undefined } | null | undefined } | null | undefined };

export type CreateResetPasswordTokenMutationVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type CreateResetPasswordTokenMutation = { __typename?: 'Mutation', createResetPasswordLink?: { __typename?: 'CreateResetPasswordLinkPayload', resetPasswordLinkResponse?: { __typename?: 'ResetPasswordLinkResponse', token?: string | null | undefined } | null | undefined } | null | undefined };

export type DeleteUserByIdMutationVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type DeleteUserByIdMutation = { __typename?: 'Mutation', deleteUser?: { __typename?: 'DeleteUserPayload', userResponse?: { __typename?: 'UserResponse', id?: number | null | undefined, login?: string | null | undefined, role?: Role | null | undefined } | null | undefined } | null | undefined };

export type UpdateRoleForUserIdMutationVariables = Exact<{
  userId: Scalars['Int'];
  role: Role;
}>;


export type UpdateRoleForUserIdMutation = { __typename?: 'Mutation', updateUserRole?: { __typename?: 'UpdateUserRolePayload', role?: Role | null | undefined } | null | undefined };

export type MeFragment = { __typename?: 'MeResponse', jwt?: string | null | undefined, profile?: { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string } | null | undefined };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'MeResponse', jwt?: string | null | undefined, profile?: { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string } | null | undefined } | null | undefined };

export type LoginMutationVariables = Exact<{
  login: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'LoginPayload', jwt?: string | null | undefined } | null | undefined };

export type RegisterMutationVariables = Exact<{
  login: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register?: { __typename?: 'RegisterPayload', jwt?: string | null | undefined } | null | undefined };

export type RegisterWithTokenMutationVariables = Exact<{
  login: Scalars['String'];
  password: Scalars['String'];
  token: Scalars['String'];
}>;


export type RegisterWithTokenMutation = { __typename?: 'Mutation', registerWithToken?: { __typename?: 'RegisterWithTokenPayload', jwt?: string | null | undefined } | null | undefined };

export type RegisterWithPasswordMutationVariables = Exact<{
  login: Scalars['String'];
  password: Scalars['String'];
  ctfnotePassword: Scalars['String'];
}>;


export type RegisterWithPasswordMutation = { __typename?: 'Mutation', registerWithPassword?: { __typename?: 'RegisterWithPasswordPayload', jwt?: string | null | undefined } | null | undefined };

export type ResetPasswordMutationVariables = Exact<{
  password: Scalars['String'];
  token: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword?: { __typename?: 'ResetPasswordPayload', jwt?: string | null | undefined } | null | undefined };

export type CtfFragment = { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null | undefined, ctfUrl?: string | null | undefined, ctftimeUrl?: string | null | undefined, description: string, endTime: string, logoUrl?: string | null | undefined, startTime: string, weight: number, title: string };

export type FullCtfFragment = { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null | undefined, ctfUrl?: string | null | undefined, ctftimeUrl?: string | null | undefined, description: string, endTime: string, logoUrl?: string | null | undefined, startTime: string, weight: number, title: string, tasks: { __typename?: 'TasksConnection', nodes: Array<{ __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null | undefined, category: string, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, profile?: { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string } | null | undefined }> } }> }, secrets?: { __typename?: 'CtfSecret', nodeId: string, credentials?: string | null | undefined } | null | undefined, invitations: { __typename?: 'InvitationsConnection', nodes: Array<{ __typename?: 'Invitation', nodeId: string, ctfId: number, profileId: number }> } };

export type CtfsQueryVariables = Exact<{ [key: string]: never; }>;


export type CtfsQuery = { __typename?: 'Query', ctfs?: { __typename?: 'CtfsConnection', nodes: Array<{ __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null | undefined, ctfUrl?: string | null | undefined, ctftimeUrl?: string | null | undefined, description: string, endTime: string, logoUrl?: string | null | undefined, startTime: string, weight: number, title: string }> } | null | undefined };

export type SubscribeToCtfSubscriptionVariables = Exact<{
  topic: Scalars['String'];
}>;


export type SubscribeToCtfSubscription = { __typename?: 'Subscription', listen: { __typename?: 'ListenPayload', relatedNodeId?: string | null | undefined, relatedNode?: { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null | undefined, ctfUrl?: string | null | undefined, ctftimeUrl?: string | null | undefined, description: string, endTime: string, logoUrl?: string | null | undefined, startTime: string, weight: number, title: string } | { __typename?: 'CtfSecret', nodeId: string } | { __typename?: 'Invitation', nodeId: string } | { __typename?: 'Profile', nodeId: string } | { __typename?: 'Query', nodeId: string } | { __typename?: 'Setting', nodeId: string } | { __typename?: 'Task', nodeId: string } | { __typename?: 'WorkOnTask', nodeId: string } | null | undefined } };

export type GetFullCtfQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetFullCtfQuery = { __typename?: 'Query', ctf?: { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null | undefined, ctfUrl?: string | null | undefined, ctftimeUrl?: string | null | undefined, description: string, endTime: string, logoUrl?: string | null | undefined, startTime: string, weight: number, title: string, tasks: { __typename?: 'TasksConnection', nodes: Array<{ __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null | undefined, category: string, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, profile?: { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string } | null | undefined }> } }> }, secrets?: { __typename?: 'CtfSecret', nodeId: string, credentials?: string | null | undefined } | null | undefined, invitations: { __typename?: 'InvitationsConnection', nodes: Array<{ __typename?: 'Invitation', nodeId: string, ctfId: number, profileId: number }> } } | null | undefined };

export type SubscribeToFullCtfSubscriptionVariables = Exact<{
  topic: Scalars['String'];
}>;


export type SubscribeToFullCtfSubscription = { __typename?: 'Subscription', listen: { __typename?: 'ListenPayload', relatedNodeId?: string | null | undefined, relatedNode?: { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null | undefined, ctfUrl?: string | null | undefined, ctftimeUrl?: string | null | undefined, description: string, endTime: string, logoUrl?: string | null | undefined, startTime: string, weight: number, title: string, tasks: { __typename?: 'TasksConnection', nodes: Array<{ __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null | undefined, category: string, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, profile?: { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string } | null | undefined }> } }> }, secrets?: { __typename?: 'CtfSecret', nodeId: string, credentials?: string | null | undefined } | null | undefined, invitations: { __typename?: 'InvitationsConnection', nodes: Array<{ __typename?: 'Invitation', nodeId: string, ctfId: number, profileId: number }> } } | { __typename?: 'CtfSecret', nodeId: string } | { __typename?: 'Invitation', nodeId: string } | { __typename?: 'Profile', nodeId: string } | { __typename?: 'Query', nodeId: string } | { __typename?: 'Setting', nodeId: string } | { __typename?: 'Task', nodeId: string } | { __typename?: 'WorkOnTask', nodeId: string } | null | undefined } };

export type IncomingCtfsQueryVariables = Exact<{ [key: string]: never; }>;


export type IncomingCtfsQuery = { __typename?: 'Query', incomingCtf?: { __typename?: 'CtfsConnection', nodes: Array<{ __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null | undefined, ctfUrl?: string | null | undefined, ctftimeUrl?: string | null | undefined, description: string, endTime: string, logoUrl?: string | null | undefined, startTime: string, weight: number, title: string }> } | null | undefined };

export type PastCtfsQueryVariables = Exact<{
  first?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
}>;


export type PastCtfsQuery = { __typename?: 'Query', pastCtf?: { __typename?: 'CtfsConnection', totalCount: number, nodes: Array<{ __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null | undefined, ctfUrl?: string | null | undefined, ctftimeUrl?: string | null | undefined, description: string, endTime: string, logoUrl?: string | null | undefined, startTime: string, weight: number, title: string }> } | null | undefined };

export type CreateCtfMutationVariables = Exact<{
  title: Scalars['String'];
  startTime: Scalars['Datetime'];
  endTime: Scalars['Datetime'];
  weight?: Maybe<Scalars['Float']>;
  ctfUrl?: Maybe<Scalars['String']>;
  ctftimeUrl?: Maybe<Scalars['String']>;
  logoUrl?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
}>;


export type CreateCtfMutation = { __typename?: 'Mutation', createCtf?: { __typename?: 'CreateCtfPayload', ctf?: { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null | undefined, ctfUrl?: string | null | undefined, ctftimeUrl?: string | null | undefined, description: string, endTime: string, logoUrl?: string | null | undefined, startTime: string, weight: number, title: string } | null | undefined } | null | undefined };

export type DeleteCtfbyIdMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteCtfbyIdMutation = { __typename?: 'Mutation', deleteCtf?: { __typename?: 'DeleteCtfPayload', deletedCtfNodeId?: string | null | undefined } | null | undefined };

export type ImportctfMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ImportctfMutation = { __typename?: 'Mutation', importCtf?: { __typename?: 'ImportCtfPayload', ctf?: { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null | undefined, ctfUrl?: string | null | undefined, ctftimeUrl?: string | null | undefined, description: string, endTime: string, logoUrl?: string | null | undefined, startTime: string, weight: number, title: string } | null | undefined } | null | undefined };

export type UpdateCtfByIdMutationVariables = Exact<{
  id: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
  weight?: Maybe<Scalars['Float']>;
  ctfUrl?: Maybe<Scalars['String']>;
  ctftimeUrl?: Maybe<Scalars['String']>;
  logoUrl?: Maybe<Scalars['String']>;
  startTime?: Maybe<Scalars['Datetime']>;
  endTime?: Maybe<Scalars['Datetime']>;
  description?: Maybe<Scalars['String']>;
}>;


export type UpdateCtfByIdMutation = { __typename?: 'Mutation', updateCtf?: { __typename?: 'UpdateCtfPayload', ctf?: { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null | undefined, ctfUrl?: string | null | undefined, ctftimeUrl?: string | null | undefined, description: string, endTime: string, logoUrl?: string | null | undefined, startTime: string, weight: number, title: string } | null | undefined } | null | undefined };

export type InvitationFragment = { __typename?: 'Invitation', nodeId: string, ctfId: number, profileId: number };

export type InviteUserToCtfMutationVariables = Exact<{
  ctfId: Scalars['Int'];
  profileId: Scalars['Int'];
}>;


export type InviteUserToCtfMutation = { __typename?: 'Mutation', createInvitation?: { __typename?: 'CreateInvitationPayload', invitation?: { __typename?: 'Invitation', nodeId: string, ctfId: number, profileId: number } | null | undefined } | null | undefined };

export type UninviteUserToCtfMutationVariables = Exact<{
  ctfId: Scalars['Int'];
  profileId: Scalars['Int'];
}>;


export type UninviteUserToCtfMutation = { __typename?: 'Mutation', deleteInvitation?: { __typename?: 'DeleteInvitationPayload', deletedInvitationNodeId?: string | null | undefined } | null | undefined };

export type ProfileFragment = { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string };

export type GetGuestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGuestsQuery = { __typename?: 'Query', guests?: { __typename?: 'ProfilesConnection', nodes: Array<{ __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string }> } | null | undefined };

export type UpdatePasswordMutationVariables = Exact<{
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type UpdatePasswordMutation = { __typename?: 'Mutation', changePassword?: { __typename?: 'ChangePasswordPayload', changePasswordResponse?: { __typename?: 'ChangePasswordResponse', ok?: boolean | null | undefined } | null | undefined } | null | undefined };

export type UpdateProfileMutationVariables = Exact<{
  id: Scalars['Int'];
  patch: ProfilePatch;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile?: { __typename?: 'UpdateProfilePayload', profile?: { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string } | null | undefined } | null | undefined };

export type GetTeamQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTeamQuery = { __typename?: 'Query', profiles?: { __typename?: 'ProfilesConnection', nodes: Array<{ __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string }> } | null | undefined };

export type SubscribeToProfileSubscriptionVariables = Exact<{
  topic: Scalars['String'];
}>;


export type SubscribeToProfileSubscription = { __typename?: 'Subscription', listen: { __typename?: 'ListenPayload', relatedNode?: { __typename?: 'Ctf', nodeId: string } | { __typename?: 'CtfSecret', nodeId: string } | { __typename?: 'Invitation', nodeId: string } | { __typename?: 'Profile', nodeId: string, id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined } | { __typename?: 'Query', nodeId: string } | { __typename?: 'Setting', nodeId: string } | { __typename?: 'Task', nodeId: string } | { __typename?: 'WorkOnTask', nodeId: string } | null | undefined } };

export type CtfSecretFragment = { __typename?: 'CtfSecret', nodeId: string, credentials?: string | null | undefined };

export type GetCredentialsForCtfIdQueryVariables = Exact<{
  ctfId: Scalars['Int'];
}>;


export type GetCredentialsForCtfIdQuery = { __typename?: 'Query', ctfSecret?: { __typename?: 'CtfSecret', nodeId: string, credentials?: string | null | undefined } | null | undefined };

export type UpdateCredentialsForCtfIdMutationVariables = Exact<{
  ctfId: Scalars['Int'];
  credentials?: Maybe<Scalars['String']>;
}>;


export type UpdateCredentialsForCtfIdMutation = { __typename?: 'Mutation', updateCtfSecret?: { __typename?: 'UpdateCtfSecretPayload', ctfSecret?: { __typename?: 'CtfSecret', nodeId: string, credentials?: string | null | undefined } | null | undefined } | null | undefined };

export type SettingsInfoFragment = { __typename?: 'Setting', nodeId: string, registrationAllowed: boolean, registrationPasswordAllowed: boolean, style: string };

export type AdminSettingsInfoFragment = { __typename?: 'Setting', nodeId: string, registrationPassword: string, registrationDefaultRole: Role, registrationAllowed: boolean, registrationPasswordAllowed: boolean, style: string };

export type GetSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSettingsQuery = { __typename?: 'Query', settings?: { __typename?: 'SettingsConnection', nodes: Array<{ __typename?: 'Setting', nodeId: string, registrationAllowed: boolean, registrationPasswordAllowed: boolean, style: string }> } | null | undefined };

export type GetAdminSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminSettingsQuery = { __typename?: 'Query', settings?: { __typename?: 'SettingsConnection', nodes: Array<{ __typename?: 'Setting', nodeId: string, registrationPassword: string, registrationDefaultRole: Role, registrationAllowed: boolean, registrationPasswordAllowed: boolean, style: string }> } | null | undefined };

export type UpdateSettingsMutationVariables = Exact<{
  nodeId: Scalars['ID'];
  patch: SettingPatch;
}>;


export type UpdateSettingsMutation = { __typename?: 'Mutation', updateSettingByNodeId?: { __typename?: 'UpdateSettingPayload', setting?: { __typename?: 'Setting', nodeId: string, registrationPassword: string, registrationDefaultRole: Role, registrationAllowed: boolean, registrationPasswordAllowed: boolean, style: string } | null | undefined } | null | undefined };

export type WorkingOnFragment = { __typename?: 'WorkOnTask', nodeId: string, profileId: number, profile?: { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string } | null | undefined };

export type TaskFragment = { __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null | undefined, category: string, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, profile?: { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string } | null | undefined }> } };

export type GetTasksForCtfIdQueryVariables = Exact<{
  ctfId: Scalars['Int'];
}>;


export type GetTasksForCtfIdQuery = { __typename?: 'Query', tasks?: { __typename?: 'TasksConnection', nodes: Array<{ __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null | undefined, category: string, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, profile?: { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string } | null | undefined }> } }> } | null | undefined };

export type TaskByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type TaskByIdQuery = { __typename?: 'Query', task?: { __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null | undefined, category: string, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, profile?: { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string } | null | undefined }> } } | null | undefined };

export type UpdateTaskMutationVariables = Exact<{
  id: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  flag?: Maybe<Scalars['String']>;
}>;


export type UpdateTaskMutation = { __typename?: 'Mutation', updateTask?: { __typename?: 'UpdateTaskPayload', task?: { __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null | undefined, category: string, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, profile?: { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string } | null | undefined }> } } | null | undefined } | null | undefined };

export type CreateTaskForCtfIdMutationVariables = Exact<{
  ctfId: Scalars['Int'];
  title: Scalars['String'];
  category?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  flag?: Maybe<Scalars['String']>;
}>;


export type CreateTaskForCtfIdMutation = { __typename?: 'Mutation', createTask?: { __typename?: 'CreateTaskPayload', task?: { __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null | undefined, category: string, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, profile?: { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string } | null | undefined }> } } | null | undefined } | null | undefined };

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteTaskMutation = { __typename?: 'Mutation', deleteTask?: { __typename?: 'DeleteTaskPayload', deletedTaskNodeId?: string | null | undefined } | null | undefined };

export type StartWorkingOnMutationVariables = Exact<{
  taskId: Scalars['Int'];
}>;


export type StartWorkingOnMutation = { __typename?: 'Mutation', startWorkingOn?: { __typename?: 'StartWorkingOnPayload', task?: { __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null | undefined, category: string, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, profile?: { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string } | null | undefined }> } } | null | undefined } | null | undefined };

export type StopWorkingOnMutationVariables = Exact<{
  taskId: Scalars['Int'];
}>;


export type StopWorkingOnMutation = { __typename?: 'Mutation', stopWorkingOn?: { __typename?: 'StopWorkingOnPayload', task?: { __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null | undefined, category: string, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, profile?: { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string } | null | undefined }> } } | null | undefined } | null | undefined };

export type SubscribeToTaskSubscriptionVariables = Exact<{
  topic: Scalars['String'];
}>;


export type SubscribeToTaskSubscription = { __typename?: 'Subscription', listen: { __typename?: 'ListenPayload', relatedNode?: { __typename?: 'Ctf', nodeId: string } | { __typename?: 'CtfSecret', nodeId: string } | { __typename?: 'Invitation', nodeId: string } | { __typename?: 'Profile', nodeId: string } | { __typename?: 'Query', nodeId: string } | { __typename?: 'Setting', nodeId: string } | { __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null | undefined, category: string, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, profile?: { __typename?: 'Profile', id: number, username: string, color?: string | null | undefined, description: string, role?: Role | null | undefined, nodeId: string } | null | undefined }> } } | { __typename?: 'WorkOnTask', nodeId: string } | null | undefined } };

export const ProfileFragmentDoc = gql`
    fragment ProfileFragment on Profile {
  id
  username
  color
  description
  role
  nodeId
}
    `;
export const UserFragmentDoc = gql`
    fragment UserFragment on User {
  nodeId
  login
  role
  id
  profile {
    ...ProfileFragment
  }
}
    ${ProfileFragmentDoc}`;
export const MeFragmentDoc = gql`
    fragment MeFragment on MeResponse {
  jwt
  profile {
    ...ProfileFragment
  }
}
    ${ProfileFragmentDoc}`;
export const CtfFragmentDoc = gql`
    fragment CtfFragment on Ctf {
  nodeId
  id
  granted
  ctfUrl
  ctftimeUrl
  description
  endTime
  logoUrl
  startTime
  weight
  title
}
    `;
export const WorkingOnFragmentDoc = gql`
    fragment WorkingOnFragment on WorkOnTask {
  nodeId
  profileId
  profile {
    ...ProfileFragment
  }
}
    ${ProfileFragmentDoc}`;
export const TaskFragmentDoc = gql`
    fragment TaskFragment on Task {
  nodeId
  id
  title
  ctfId
  padUrl
  description
  flag
  solved
  category
  workOnTasks {
    nodes {
      ...WorkingOnFragment
    }
  }
}
    ${WorkingOnFragmentDoc}`;
export const CtfSecretFragmentDoc = gql`
    fragment CtfSecretFragment on CtfSecret {
  nodeId
  credentials
}
    `;
export const InvitationFragmentDoc = gql`
    fragment InvitationFragment on Invitation {
  nodeId
  ctfId
  profileId
}
    `;
export const FullCtfFragmentDoc = gql`
    fragment FullCtfFragment on Ctf {
  ...CtfFragment
  tasks {
    nodes {
      ...TaskFragment
    }
  }
  secrets {
    ...CtfSecretFragment
  }
  invitations {
    nodes {
      ...InvitationFragment
    }
  }
}
    ${CtfFragmentDoc}
${TaskFragmentDoc}
${CtfSecretFragmentDoc}
${InvitationFragmentDoc}`;
export const SettingsInfoFragmentDoc = gql`
    fragment SettingsInfo on Setting {
  nodeId
  registrationAllowed
  registrationPasswordAllowed
  style
}
    `;
export const AdminSettingsInfoFragmentDoc = gql`
    fragment AdminSettingsInfo on Setting {
  nodeId
  ...SettingsInfo
  registrationPassword
  registrationDefaultRole
}
    ${SettingsInfoFragmentDoc}`;
export const GetUsersDocument = gql`
    query getUsers {
  users {
    nodes {
      ...UserFragment
    }
  }
}
    ${UserFragmentDoc}`;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a Vue component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetUsersQuery();
 */
export function useGetUsersQuery(options: VueApolloComposable.UseQueryOptions<GetUsersQuery, GetUsersQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetUsersQuery, GetUsersQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetUsersQuery, GetUsersQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, {}, options);
}
export type GetUsersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetUsersQuery, GetUsersQueryVariables>;
export const CreateInvitationTokenDocument = gql`
    mutation createInvitationToken($role: Role!) {
  createInvitationLink(input: {role: $role}) {
    invitationLinkResponse {
      token
    }
  }
}
    `;

/**
 * __useCreateInvitationTokenMutation__
 *
 * To run a mutation, you first call `useCreateInvitationTokenMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateInvitationTokenMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateInvitationTokenMutation({
 *   variables: {
 *     role: // value for 'role'
 *   },
 * });
 */
export function useCreateInvitationTokenMutation(options: VueApolloComposable.UseMutationOptions<CreateInvitationTokenMutation, CreateInvitationTokenMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateInvitationTokenMutation, CreateInvitationTokenMutationVariables>>) {
  return VueApolloComposable.useMutation<CreateInvitationTokenMutation, CreateInvitationTokenMutationVariables>(CreateInvitationTokenDocument, options);
}
export type CreateInvitationTokenMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateInvitationTokenMutation, CreateInvitationTokenMutationVariables>;
export const CreateResetPasswordTokenDocument = gql`
    mutation createResetPasswordToken($userId: Int!) {
  createResetPasswordLink(input: {userId: $userId}) {
    resetPasswordLinkResponse {
      token
    }
  }
}
    `;

/**
 * __useCreateResetPasswordTokenMutation__
 *
 * To run a mutation, you first call `useCreateResetPasswordTokenMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateResetPasswordTokenMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateResetPasswordTokenMutation({
 *   variables: {
 *     userId: // value for 'userId'
 *   },
 * });
 */
export function useCreateResetPasswordTokenMutation(options: VueApolloComposable.UseMutationOptions<CreateResetPasswordTokenMutation, CreateResetPasswordTokenMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateResetPasswordTokenMutation, CreateResetPasswordTokenMutationVariables>>) {
  return VueApolloComposable.useMutation<CreateResetPasswordTokenMutation, CreateResetPasswordTokenMutationVariables>(CreateResetPasswordTokenDocument, options);
}
export type CreateResetPasswordTokenMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateResetPasswordTokenMutation, CreateResetPasswordTokenMutationVariables>;
export const DeleteUserByIdDocument = gql`
    mutation deleteUserById($userId: Int!) {
  deleteUser(input: {userId: $userId}) {
    userResponse {
      id
      login
      role
    }
  }
}
    `;

/**
 * __useDeleteUserByIdMutation__
 *
 * To run a mutation, you first call `useDeleteUserByIdMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserByIdMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteUserByIdMutation({
 *   variables: {
 *     userId: // value for 'userId'
 *   },
 * });
 */
export function useDeleteUserByIdMutation(options: VueApolloComposable.UseMutationOptions<DeleteUserByIdMutation, DeleteUserByIdMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteUserByIdMutation, DeleteUserByIdMutationVariables>>) {
  return VueApolloComposable.useMutation<DeleteUserByIdMutation, DeleteUserByIdMutationVariables>(DeleteUserByIdDocument, options);
}
export type DeleteUserByIdMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteUserByIdMutation, DeleteUserByIdMutationVariables>;
export const UpdateRoleForUserIdDocument = gql`
    mutation updateRoleForUserId($userId: Int!, $role: Role!) {
  updateUserRole(input: {userId: $userId, role: $role}) {
    role
  }
}
    `;

/**
 * __useUpdateRoleForUserIdMutation__
 *
 * To run a mutation, you first call `useUpdateRoleForUserIdMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoleForUserIdMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateRoleForUserIdMutation({
 *   variables: {
 *     userId: // value for 'userId'
 *     role: // value for 'role'
 *   },
 * });
 */
export function useUpdateRoleForUserIdMutation(options: VueApolloComposable.UseMutationOptions<UpdateRoleForUserIdMutation, UpdateRoleForUserIdMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateRoleForUserIdMutation, UpdateRoleForUserIdMutationVariables>>) {
  return VueApolloComposable.useMutation<UpdateRoleForUserIdMutation, UpdateRoleForUserIdMutationVariables>(UpdateRoleForUserIdDocument, options);
}
export type UpdateRoleForUserIdMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateRoleForUserIdMutation, UpdateRoleForUserIdMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...MeFragment
  }
}
    ${MeFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a Vue component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useMeQuery();
 */
export function useMeQuery(options: VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<MeQuery, MeQueryVariables>(MeDocument, {}, options);
}
export type MeQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<MeQuery, MeQueryVariables>;
export const LoginDocument = gql`
    mutation Login($login: String!, $password: String!) {
  login(input: {login: $login, password: $password}) {
    jwt
  }
}
    `;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useLoginMutation({
 *   variables: {
 *     login: // value for 'login'
 *     password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(options: VueApolloComposable.UseMutationOptions<LoginMutation, LoginMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<LoginMutation, LoginMutationVariables>>) {
  return VueApolloComposable.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
}
export type LoginMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($login: String!, $password: String!) {
  register(input: {login: $login, password: $password}) {
    jwt
  }
}
    `;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useRegisterMutation({
 *   variables: {
 *     login: // value for 'login'
 *     password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(options: VueApolloComposable.UseMutationOptions<RegisterMutation, RegisterMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RegisterMutation, RegisterMutationVariables>>) {
  return VueApolloComposable.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
}
export type RegisterMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RegisterMutation, RegisterMutationVariables>;
export const RegisterWithTokenDocument = gql`
    mutation RegisterWithToken($login: String!, $password: String!, $token: String!) {
  registerWithToken(input: {login: $login, password: $password, token: $token}) {
    jwt
  }
}
    `;

/**
 * __useRegisterWithTokenMutation__
 *
 * To run a mutation, you first call `useRegisterWithTokenMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useRegisterWithTokenMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useRegisterWithTokenMutation({
 *   variables: {
 *     login: // value for 'login'
 *     password: // value for 'password'
 *     token: // value for 'token'
 *   },
 * });
 */
export function useRegisterWithTokenMutation(options: VueApolloComposable.UseMutationOptions<RegisterWithTokenMutation, RegisterWithTokenMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RegisterWithTokenMutation, RegisterWithTokenMutationVariables>>) {
  return VueApolloComposable.useMutation<RegisterWithTokenMutation, RegisterWithTokenMutationVariables>(RegisterWithTokenDocument, options);
}
export type RegisterWithTokenMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RegisterWithTokenMutation, RegisterWithTokenMutationVariables>;
export const RegisterWithPasswordDocument = gql`
    mutation RegisterWithPassword($login: String!, $password: String!, $ctfnotePassword: String!) {
  registerWithPassword(
    input: {login: $login, password: $password, ctfnotePassword: $ctfnotePassword}
  ) {
    jwt
  }
}
    `;

/**
 * __useRegisterWithPasswordMutation__
 *
 * To run a mutation, you first call `useRegisterWithPasswordMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useRegisterWithPasswordMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useRegisterWithPasswordMutation({
 *   variables: {
 *     login: // value for 'login'
 *     password: // value for 'password'
 *     ctfnotePassword: // value for 'ctfnotePassword'
 *   },
 * });
 */
export function useRegisterWithPasswordMutation(options: VueApolloComposable.UseMutationOptions<RegisterWithPasswordMutation, RegisterWithPasswordMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RegisterWithPasswordMutation, RegisterWithPasswordMutationVariables>>) {
  return VueApolloComposable.useMutation<RegisterWithPasswordMutation, RegisterWithPasswordMutationVariables>(RegisterWithPasswordDocument, options);
}
export type RegisterWithPasswordMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RegisterWithPasswordMutation, RegisterWithPasswordMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($password: String!, $token: String!) {
  resetPassword(input: {password: $password, token: $token}) {
    jwt
  }
}
    `;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useResetPasswordMutation({
 *   variables: {
 *     password: // value for 'password'
 *     token: // value for 'token'
 *   },
 * });
 */
export function useResetPasswordMutation(options: VueApolloComposable.UseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>>) {
  return VueApolloComposable.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
}
export type ResetPasswordMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const CtfsDocument = gql`
    query Ctfs {
  ctfs {
    nodes {
      ...CtfFragment
    }
  }
}
    ${CtfFragmentDoc}`;

/**
 * __useCtfsQuery__
 *
 * To run a query within a Vue component, call `useCtfsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCtfsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useCtfsQuery();
 */
export function useCtfsQuery(options: VueApolloComposable.UseQueryOptions<CtfsQuery, CtfsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<CtfsQuery, CtfsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<CtfsQuery, CtfsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<CtfsQuery, CtfsQueryVariables>(CtfsDocument, {}, options);
}
export type CtfsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<CtfsQuery, CtfsQueryVariables>;
export const SubscribeToCtfDocument = gql`
    subscription subscribeToCtf($topic: String!) {
  listen(topic: $topic) {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Ctf {
        ...CtfFragment
      }
    }
  }
}
    ${CtfFragmentDoc}`;

/**
 * __useSubscribeToCtfSubscription__
 *
 * To run a query within a Vue component, call `useSubscribeToCtfSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToCtfSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useSubscribeToCtfSubscription({
 *   topic: // value for 'topic'
 * });
 */
export function useSubscribeToCtfSubscription(variables: SubscribeToCtfSubscriptionVariables | VueCompositionApi.Ref<SubscribeToCtfSubscriptionVariables> | ReactiveFunction<SubscribeToCtfSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<SubscribeToCtfSubscription, SubscribeToCtfSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<SubscribeToCtfSubscription, SubscribeToCtfSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<SubscribeToCtfSubscription, SubscribeToCtfSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<SubscribeToCtfSubscription, SubscribeToCtfSubscriptionVariables>(SubscribeToCtfDocument, variables, options);
}
export type SubscribeToCtfSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<SubscribeToCtfSubscription, SubscribeToCtfSubscriptionVariables>;
export const GetFullCtfDocument = gql`
    query GetFullCtf($id: Int!) {
  ctf(id: $id) {
    ...FullCtfFragment
  }
}
    ${FullCtfFragmentDoc}`;

/**
 * __useGetFullCtfQuery__
 *
 * To run a query within a Vue component, call `useGetFullCtfQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFullCtfQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetFullCtfQuery({
 *   id: // value for 'id'
 * });
 */
export function useGetFullCtfQuery(variables: GetFullCtfQueryVariables | VueCompositionApi.Ref<GetFullCtfQueryVariables> | ReactiveFunction<GetFullCtfQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetFullCtfQuery, GetFullCtfQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetFullCtfQuery, GetFullCtfQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetFullCtfQuery, GetFullCtfQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetFullCtfQuery, GetFullCtfQueryVariables>(GetFullCtfDocument, variables, options);
}
export type GetFullCtfQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetFullCtfQuery, GetFullCtfQueryVariables>;
export const SubscribeToFullCtfDocument = gql`
    subscription subscribeToFullCtf($topic: String!) {
  listen(topic: $topic) {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Ctf {
        ...FullCtfFragment
      }
    }
  }
}
    ${FullCtfFragmentDoc}`;

/**
 * __useSubscribeToFullCtfSubscription__
 *
 * To run a query within a Vue component, call `useSubscribeToFullCtfSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToFullCtfSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useSubscribeToFullCtfSubscription({
 *   topic: // value for 'topic'
 * });
 */
export function useSubscribeToFullCtfSubscription(variables: SubscribeToFullCtfSubscriptionVariables | VueCompositionApi.Ref<SubscribeToFullCtfSubscriptionVariables> | ReactiveFunction<SubscribeToFullCtfSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<SubscribeToFullCtfSubscription, SubscribeToFullCtfSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<SubscribeToFullCtfSubscription, SubscribeToFullCtfSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<SubscribeToFullCtfSubscription, SubscribeToFullCtfSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<SubscribeToFullCtfSubscription, SubscribeToFullCtfSubscriptionVariables>(SubscribeToFullCtfDocument, variables, options);
}
export type SubscribeToFullCtfSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<SubscribeToFullCtfSubscription, SubscribeToFullCtfSubscriptionVariables>;
export const IncomingCtfsDocument = gql`
    query IncomingCtfs {
  incomingCtf {
    nodes {
      ...CtfFragment
    }
  }
}
    ${CtfFragmentDoc}`;

/**
 * __useIncomingCtfsQuery__
 *
 * To run a query within a Vue component, call `useIncomingCtfsQuery` and pass it any options that fit your needs.
 * When your component renders, `useIncomingCtfsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useIncomingCtfsQuery();
 */
export function useIncomingCtfsQuery(options: VueApolloComposable.UseQueryOptions<IncomingCtfsQuery, IncomingCtfsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<IncomingCtfsQuery, IncomingCtfsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<IncomingCtfsQuery, IncomingCtfsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<IncomingCtfsQuery, IncomingCtfsQueryVariables>(IncomingCtfsDocument, {}, options);
}
export type IncomingCtfsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<IncomingCtfsQuery, IncomingCtfsQueryVariables>;
export const PastCtfsDocument = gql`
    query PastCtfs($first: Int, $offset: Int) {
  pastCtf(first: $first, offset: $offset) {
    nodes {
      ...CtfFragment
    }
    totalCount
  }
}
    ${CtfFragmentDoc}`;

/**
 * __usePastCtfsQuery__
 *
 * To run a query within a Vue component, call `usePastCtfsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePastCtfsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = usePastCtfsQuery({
 *   first: // value for 'first'
 *   offset: // value for 'offset'
 * });
 */
export function usePastCtfsQuery(variables: PastCtfsQueryVariables | VueCompositionApi.Ref<PastCtfsQueryVariables> | ReactiveFunction<PastCtfsQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<PastCtfsQuery, PastCtfsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<PastCtfsQuery, PastCtfsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<PastCtfsQuery, PastCtfsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<PastCtfsQuery, PastCtfsQueryVariables>(PastCtfsDocument, variables, options);
}
export type PastCtfsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<PastCtfsQuery, PastCtfsQueryVariables>;
export const CreateCtfDocument = gql`
    mutation createCtf($title: String!, $startTime: Datetime!, $endTime: Datetime!, $weight: Float, $ctfUrl: String, $ctftimeUrl: String, $logoUrl: String, $description: String) {
  createCtf(
    input: {ctf: {title: $title, weight: $weight, ctfUrl: $ctfUrl, ctftimeUrl: $ctftimeUrl, logoUrl: $logoUrl, startTime: $startTime, endTime: $endTime, description: $description}}
  ) {
    ctf {
      ...CtfFragment
    }
  }
}
    ${CtfFragmentDoc}`;

/**
 * __useCreateCtfMutation__
 *
 * To run a mutation, you first call `useCreateCtfMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateCtfMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateCtfMutation({
 *   variables: {
 *     title: // value for 'title'
 *     startTime: // value for 'startTime'
 *     endTime: // value for 'endTime'
 *     weight: // value for 'weight'
 *     ctfUrl: // value for 'ctfUrl'
 *     ctftimeUrl: // value for 'ctftimeUrl'
 *     logoUrl: // value for 'logoUrl'
 *     description: // value for 'description'
 *   },
 * });
 */
export function useCreateCtfMutation(options: VueApolloComposable.UseMutationOptions<CreateCtfMutation, CreateCtfMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateCtfMutation, CreateCtfMutationVariables>>) {
  return VueApolloComposable.useMutation<CreateCtfMutation, CreateCtfMutationVariables>(CreateCtfDocument, options);
}
export type CreateCtfMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateCtfMutation, CreateCtfMutationVariables>;
export const DeleteCtfbyIdDocument = gql`
    mutation deleteCtfbyId($id: Int!) {
  deleteCtf(input: {id: $id}) {
    deletedCtfNodeId
  }
}
    `;

/**
 * __useDeleteCtfbyIdMutation__
 *
 * To run a mutation, you first call `useDeleteCtfbyIdMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCtfbyIdMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteCtfbyIdMutation({
 *   variables: {
 *     id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCtfbyIdMutation(options: VueApolloComposable.UseMutationOptions<DeleteCtfbyIdMutation, DeleteCtfbyIdMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteCtfbyIdMutation, DeleteCtfbyIdMutationVariables>>) {
  return VueApolloComposable.useMutation<DeleteCtfbyIdMutation, DeleteCtfbyIdMutationVariables>(DeleteCtfbyIdDocument, options);
}
export type DeleteCtfbyIdMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteCtfbyIdMutation, DeleteCtfbyIdMutationVariables>;
export const ImportctfDocument = gql`
    mutation importctf($id: Int!) {
  importCtf(input: {ctftimeId: $id}) {
    ctf {
      ...CtfFragment
    }
  }
}
    ${CtfFragmentDoc}`;

/**
 * __useImportctfMutation__
 *
 * To run a mutation, you first call `useImportctfMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useImportctfMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useImportctfMutation({
 *   variables: {
 *     id: // value for 'id'
 *   },
 * });
 */
export function useImportctfMutation(options: VueApolloComposable.UseMutationOptions<ImportctfMutation, ImportctfMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<ImportctfMutation, ImportctfMutationVariables>>) {
  return VueApolloComposable.useMutation<ImportctfMutation, ImportctfMutationVariables>(ImportctfDocument, options);
}
export type ImportctfMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<ImportctfMutation, ImportctfMutationVariables>;
export const UpdateCtfByIdDocument = gql`
    mutation updateCtfById($id: Int!, $title: String, $weight: Float, $ctfUrl: String, $ctftimeUrl: String, $logoUrl: String, $startTime: Datetime, $endTime: Datetime, $description: String) {
  updateCtf(
    input: {id: $id, patch: {title: $title, weight: $weight, ctfUrl: $ctfUrl, ctftimeUrl: $ctftimeUrl, logoUrl: $logoUrl, startTime: $startTime, endTime: $endTime, description: $description}}
  ) {
    ctf {
      ...CtfFragment
    }
  }
}
    ${CtfFragmentDoc}`;

/**
 * __useUpdateCtfByIdMutation__
 *
 * To run a mutation, you first call `useUpdateCtfByIdMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCtfByIdMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateCtfByIdMutation({
 *   variables: {
 *     id: // value for 'id'
 *     title: // value for 'title'
 *     weight: // value for 'weight'
 *     ctfUrl: // value for 'ctfUrl'
 *     ctftimeUrl: // value for 'ctftimeUrl'
 *     logoUrl: // value for 'logoUrl'
 *     startTime: // value for 'startTime'
 *     endTime: // value for 'endTime'
 *     description: // value for 'description'
 *   },
 * });
 */
export function useUpdateCtfByIdMutation(options: VueApolloComposable.UseMutationOptions<UpdateCtfByIdMutation, UpdateCtfByIdMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateCtfByIdMutation, UpdateCtfByIdMutationVariables>>) {
  return VueApolloComposable.useMutation<UpdateCtfByIdMutation, UpdateCtfByIdMutationVariables>(UpdateCtfByIdDocument, options);
}
export type UpdateCtfByIdMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateCtfByIdMutation, UpdateCtfByIdMutationVariables>;
export const InviteUserToCtfDocument = gql`
    mutation inviteUserToCtf($ctfId: Int!, $profileId: Int!) {
  createInvitation(input: {invitation: {ctfId: $ctfId, profileId: $profileId}}) {
    invitation {
      ...InvitationFragment
    }
  }
}
    ${InvitationFragmentDoc}`;

/**
 * __useInviteUserToCtfMutation__
 *
 * To run a mutation, you first call `useInviteUserToCtfMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useInviteUserToCtfMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useInviteUserToCtfMutation({
 *   variables: {
 *     ctfId: // value for 'ctfId'
 *     profileId: // value for 'profileId'
 *   },
 * });
 */
export function useInviteUserToCtfMutation(options: VueApolloComposable.UseMutationOptions<InviteUserToCtfMutation, InviteUserToCtfMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<InviteUserToCtfMutation, InviteUserToCtfMutationVariables>>) {
  return VueApolloComposable.useMutation<InviteUserToCtfMutation, InviteUserToCtfMutationVariables>(InviteUserToCtfDocument, options);
}
export type InviteUserToCtfMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<InviteUserToCtfMutation, InviteUserToCtfMutationVariables>;
export const UninviteUserToCtfDocument = gql`
    mutation uninviteUserToCtf($ctfId: Int!, $profileId: Int!) {
  deleteInvitation(input: {ctfId: $ctfId, profileId: $profileId}) {
    deletedInvitationNodeId
  }
}
    `;

/**
 * __useUninviteUserToCtfMutation__
 *
 * To run a mutation, you first call `useUninviteUserToCtfMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUninviteUserToCtfMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUninviteUserToCtfMutation({
 *   variables: {
 *     ctfId: // value for 'ctfId'
 *     profileId: // value for 'profileId'
 *   },
 * });
 */
export function useUninviteUserToCtfMutation(options: VueApolloComposable.UseMutationOptions<UninviteUserToCtfMutation, UninviteUserToCtfMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UninviteUserToCtfMutation, UninviteUserToCtfMutationVariables>>) {
  return VueApolloComposable.useMutation<UninviteUserToCtfMutation, UninviteUserToCtfMutationVariables>(UninviteUserToCtfDocument, options);
}
export type UninviteUserToCtfMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UninviteUserToCtfMutation, UninviteUserToCtfMutationVariables>;
export const GetGuestsDocument = gql`
    query getGuests {
  guests {
    nodes {
      ...ProfileFragment
    }
  }
}
    ${ProfileFragmentDoc}`;

/**
 * __useGetGuestsQuery__
 *
 * To run a query within a Vue component, call `useGetGuestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGuestsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetGuestsQuery();
 */
export function useGetGuestsQuery(options: VueApolloComposable.UseQueryOptions<GetGuestsQuery, GetGuestsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetGuestsQuery, GetGuestsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetGuestsQuery, GetGuestsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetGuestsQuery, GetGuestsQueryVariables>(GetGuestsDocument, {}, options);
}
export type GetGuestsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetGuestsQuery, GetGuestsQueryVariables>;
export const UpdatePasswordDocument = gql`
    mutation updatePassword($oldPassword: String!, $newPassword: String!) {
  changePassword(input: {oldpassword: $oldPassword, newpassword: $newPassword}) {
    changePasswordResponse {
      ok
    }
  }
}
    `;

/**
 * __useUpdatePasswordMutation__
 *
 * To run a mutation, you first call `useUpdatePasswordMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePasswordMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdatePasswordMutation({
 *   variables: {
 *     oldPassword: // value for 'oldPassword'
 *     newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useUpdatePasswordMutation(options: VueApolloComposable.UseMutationOptions<UpdatePasswordMutation, UpdatePasswordMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdatePasswordMutation, UpdatePasswordMutationVariables>>) {
  return VueApolloComposable.useMutation<UpdatePasswordMutation, UpdatePasswordMutationVariables>(UpdatePasswordDocument, options);
}
export type UpdatePasswordMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdatePasswordMutation, UpdatePasswordMutationVariables>;
export const UpdateProfileDocument = gql`
    mutation updateProfile($id: Int!, $patch: ProfilePatch!) {
  updateProfile(input: {id: $id, patch: $patch}) {
    profile {
      ...ProfileFragment
    }
  }
}
    ${ProfileFragmentDoc}`;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateProfileMutation({
 *   variables: {
 *     id: // value for 'id'
 *     patch: // value for 'patch'
 *   },
 * });
 */
export function useUpdateProfileMutation(options: VueApolloComposable.UseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables>>) {
  return VueApolloComposable.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, options);
}
export type UpdateProfileMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const GetTeamDocument = gql`
    query getTeam {
  profiles {
    nodes {
      ...ProfileFragment
    }
  }
}
    ${ProfileFragmentDoc}`;

/**
 * __useGetTeamQuery__
 *
 * To run a query within a Vue component, call `useGetTeamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetTeamQuery();
 */
export function useGetTeamQuery(options: VueApolloComposable.UseQueryOptions<GetTeamQuery, GetTeamQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTeamQuery, GetTeamQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTeamQuery, GetTeamQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetTeamQuery, GetTeamQueryVariables>(GetTeamDocument, {}, options);
}
export type GetTeamQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetTeamQuery, GetTeamQueryVariables>;
export const SubscribeToProfileDocument = gql`
    subscription subscribeToProfile($topic: String!) {
  listen(topic: $topic) {
    relatedNode {
      nodeId
      ... on Profile {
        ...ProfileFragment
      }
    }
  }
}
    ${ProfileFragmentDoc}`;

/**
 * __useSubscribeToProfileSubscription__
 *
 * To run a query within a Vue component, call `useSubscribeToProfileSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToProfileSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useSubscribeToProfileSubscription({
 *   topic: // value for 'topic'
 * });
 */
export function useSubscribeToProfileSubscription(variables: SubscribeToProfileSubscriptionVariables | VueCompositionApi.Ref<SubscribeToProfileSubscriptionVariables> | ReactiveFunction<SubscribeToProfileSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<SubscribeToProfileSubscription, SubscribeToProfileSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<SubscribeToProfileSubscription, SubscribeToProfileSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<SubscribeToProfileSubscription, SubscribeToProfileSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<SubscribeToProfileSubscription, SubscribeToProfileSubscriptionVariables>(SubscribeToProfileDocument, variables, options);
}
export type SubscribeToProfileSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<SubscribeToProfileSubscription, SubscribeToProfileSubscriptionVariables>;
export const GetCredentialsForCtfIdDocument = gql`
    query getCredentialsForCtfId($ctfId: Int!) {
  ctfSecret(id: $ctfId) {
    ...CtfSecretFragment
  }
}
    ${CtfSecretFragmentDoc}`;

/**
 * __useGetCredentialsForCtfIdQuery__
 *
 * To run a query within a Vue component, call `useGetCredentialsForCtfIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCredentialsForCtfIdQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetCredentialsForCtfIdQuery({
 *   ctfId: // value for 'ctfId'
 * });
 */
export function useGetCredentialsForCtfIdQuery(variables: GetCredentialsForCtfIdQueryVariables | VueCompositionApi.Ref<GetCredentialsForCtfIdQueryVariables> | ReactiveFunction<GetCredentialsForCtfIdQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetCredentialsForCtfIdQuery, GetCredentialsForCtfIdQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetCredentialsForCtfIdQuery, GetCredentialsForCtfIdQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetCredentialsForCtfIdQuery, GetCredentialsForCtfIdQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetCredentialsForCtfIdQuery, GetCredentialsForCtfIdQueryVariables>(GetCredentialsForCtfIdDocument, variables, options);
}
export type GetCredentialsForCtfIdQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetCredentialsForCtfIdQuery, GetCredentialsForCtfIdQueryVariables>;
export const UpdateCredentialsForCtfIdDocument = gql`
    mutation updateCredentialsForCtfId($ctfId: Int!, $credentials: String) {
  updateCtfSecret(input: {id: $ctfId, patch: {credentials: $credentials}}) {
    ctfSecret {
      ...CtfSecretFragment
    }
  }
}
    ${CtfSecretFragmentDoc}`;

/**
 * __useUpdateCredentialsForCtfIdMutation__
 *
 * To run a mutation, you first call `useUpdateCredentialsForCtfIdMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCredentialsForCtfIdMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateCredentialsForCtfIdMutation({
 *   variables: {
 *     ctfId: // value for 'ctfId'
 *     credentials: // value for 'credentials'
 *   },
 * });
 */
export function useUpdateCredentialsForCtfIdMutation(options: VueApolloComposable.UseMutationOptions<UpdateCredentialsForCtfIdMutation, UpdateCredentialsForCtfIdMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateCredentialsForCtfIdMutation, UpdateCredentialsForCtfIdMutationVariables>>) {
  return VueApolloComposable.useMutation<UpdateCredentialsForCtfIdMutation, UpdateCredentialsForCtfIdMutationVariables>(UpdateCredentialsForCtfIdDocument, options);
}
export type UpdateCredentialsForCtfIdMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateCredentialsForCtfIdMutation, UpdateCredentialsForCtfIdMutationVariables>;
export const GetSettingsDocument = gql`
    query getSettings {
  settings {
    nodes {
      ...SettingsInfo
    }
  }
}
    ${SettingsInfoFragmentDoc}`;

/**
 * __useGetSettingsQuery__
 *
 * To run a query within a Vue component, call `useGetSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSettingsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetSettingsQuery();
 */
export function useGetSettingsQuery(options: VueApolloComposable.UseQueryOptions<GetSettingsQuery, GetSettingsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetSettingsQuery, GetSettingsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetSettingsQuery, GetSettingsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetSettingsQuery, GetSettingsQueryVariables>(GetSettingsDocument, {}, options);
}
export type GetSettingsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetSettingsQuery, GetSettingsQueryVariables>;
export const GetAdminSettingsDocument = gql`
    query getAdminSettings {
  settings {
    nodes {
      ...AdminSettingsInfo
    }
  }
}
    ${AdminSettingsInfoFragmentDoc}`;

/**
 * __useGetAdminSettingsQuery__
 *
 * To run a query within a Vue component, call `useGetAdminSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminSettingsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetAdminSettingsQuery();
 */
export function useGetAdminSettingsQuery(options: VueApolloComposable.UseQueryOptions<GetAdminSettingsQuery, GetAdminSettingsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAdminSettingsQuery, GetAdminSettingsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAdminSettingsQuery, GetAdminSettingsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetAdminSettingsQuery, GetAdminSettingsQueryVariables>(GetAdminSettingsDocument, {}, options);
}
export type GetAdminSettingsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetAdminSettingsQuery, GetAdminSettingsQueryVariables>;
export const UpdateSettingsDocument = gql`
    mutation updateSettings($nodeId: ID!, $patch: SettingPatch!) {
  updateSettingByNodeId(input: {nodeId: $nodeId, patch: $patch}) {
    setting {
      ...AdminSettingsInfo
    }
  }
}
    ${AdminSettingsInfoFragmentDoc}`;

/**
 * __useUpdateSettingsMutation__
 *
 * To run a mutation, you first call `useUpdateSettingsMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSettingsMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateSettingsMutation({
 *   variables: {
 *     nodeId: // value for 'nodeId'
 *     patch: // value for 'patch'
 *   },
 * });
 */
export function useUpdateSettingsMutation(options: VueApolloComposable.UseMutationOptions<UpdateSettingsMutation, UpdateSettingsMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateSettingsMutation, UpdateSettingsMutationVariables>>) {
  return VueApolloComposable.useMutation<UpdateSettingsMutation, UpdateSettingsMutationVariables>(UpdateSettingsDocument, options);
}
export type UpdateSettingsMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateSettingsMutation, UpdateSettingsMutationVariables>;
export const GetTasksForCtfIdDocument = gql`
    query getTasksForCtfId($ctfId: Int!) {
  tasks(condition: {ctfId: $ctfId}) {
    nodes {
      ...TaskFragment
    }
  }
}
    ${TaskFragmentDoc}`;

/**
 * __useGetTasksForCtfIdQuery__
 *
 * To run a query within a Vue component, call `useGetTasksForCtfIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTasksForCtfIdQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetTasksForCtfIdQuery({
 *   ctfId: // value for 'ctfId'
 * });
 */
export function useGetTasksForCtfIdQuery(variables: GetTasksForCtfIdQueryVariables | VueCompositionApi.Ref<GetTasksForCtfIdQueryVariables> | ReactiveFunction<GetTasksForCtfIdQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetTasksForCtfIdQuery, GetTasksForCtfIdQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTasksForCtfIdQuery, GetTasksForCtfIdQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTasksForCtfIdQuery, GetTasksForCtfIdQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetTasksForCtfIdQuery, GetTasksForCtfIdQueryVariables>(GetTasksForCtfIdDocument, variables, options);
}
export type GetTasksForCtfIdQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetTasksForCtfIdQuery, GetTasksForCtfIdQueryVariables>;
export const TaskByIdDocument = gql`
    query taskById($id: Int!) {
  task(id: $id) {
    ...TaskFragment
  }
}
    ${TaskFragmentDoc}`;

/**
 * __useTaskByIdQuery__
 *
 * To run a query within a Vue component, call `useTaskByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaskByIdQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useTaskByIdQuery({
 *   id: // value for 'id'
 * });
 */
export function useTaskByIdQuery(variables: TaskByIdQueryVariables | VueCompositionApi.Ref<TaskByIdQueryVariables> | ReactiveFunction<TaskByIdQueryVariables>, options: VueApolloComposable.UseQueryOptions<TaskByIdQuery, TaskByIdQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<TaskByIdQuery, TaskByIdQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<TaskByIdQuery, TaskByIdQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<TaskByIdQuery, TaskByIdQueryVariables>(TaskByIdDocument, variables, options);
}
export type TaskByIdQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<TaskByIdQuery, TaskByIdQueryVariables>;
export const UpdateTaskDocument = gql`
    mutation updateTask($id: Int!, $title: String, $description: String, $category: String, $flag: String) {
  updateTask(
    input: {id: $id, patch: {title: $title, category: $category, description: $description, flag: $flag}}
  ) {
    task {
      ...TaskFragment
    }
  }
}
    ${TaskFragmentDoc}`;

/**
 * __useUpdateTaskMutation__
 *
 * To run a mutation, you first call `useUpdateTaskMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateTaskMutation({
 *   variables: {
 *     id: // value for 'id'
 *     title: // value for 'title'
 *     description: // value for 'description'
 *     category: // value for 'category'
 *     flag: // value for 'flag'
 *   },
 * });
 */
export function useUpdateTaskMutation(options: VueApolloComposable.UseMutationOptions<UpdateTaskMutation, UpdateTaskMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateTaskMutation, UpdateTaskMutationVariables>>) {
  return VueApolloComposable.useMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument, options);
}
export type UpdateTaskMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const CreateTaskForCtfIdDocument = gql`
    mutation createTaskForCtfId($ctfId: Int!, $title: String!, $category: String, $description: String, $flag: String) {
  createTask(
    input: {ctfId: $ctfId, title: $title, category: $category, description: $description, flag: $flag}
  ) {
    task {
      ...TaskFragment
    }
  }
}
    ${TaskFragmentDoc}`;

/**
 * __useCreateTaskForCtfIdMutation__
 *
 * To run a mutation, you first call `useCreateTaskForCtfIdMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskForCtfIdMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateTaskForCtfIdMutation({
 *   variables: {
 *     ctfId: // value for 'ctfId'
 *     title: // value for 'title'
 *     category: // value for 'category'
 *     description: // value for 'description'
 *     flag: // value for 'flag'
 *   },
 * });
 */
export function useCreateTaskForCtfIdMutation(options: VueApolloComposable.UseMutationOptions<CreateTaskForCtfIdMutation, CreateTaskForCtfIdMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateTaskForCtfIdMutation, CreateTaskForCtfIdMutationVariables>>) {
  return VueApolloComposable.useMutation<CreateTaskForCtfIdMutation, CreateTaskForCtfIdMutationVariables>(CreateTaskForCtfIdDocument, options);
}
export type CreateTaskForCtfIdMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateTaskForCtfIdMutation, CreateTaskForCtfIdMutationVariables>;
export const DeleteTaskDocument = gql`
    mutation deleteTask($id: Int!) {
  deleteTask(input: {id: $id}) {
    deletedTaskNodeId
  }
}
    `;

/**
 * __useDeleteTaskMutation__
 *
 * To run a mutation, you first call `useDeleteTaskMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTaskMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteTaskMutation({
 *   variables: {
 *     id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTaskMutation(options: VueApolloComposable.UseMutationOptions<DeleteTaskMutation, DeleteTaskMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteTaskMutation, DeleteTaskMutationVariables>>) {
  return VueApolloComposable.useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DeleteTaskDocument, options);
}
export type DeleteTaskMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteTaskMutation, DeleteTaskMutationVariables>;
export const StartWorkingOnDocument = gql`
    mutation startWorkingOn($taskId: Int!) {
  startWorkingOn(input: {taskId: $taskId}) {
    task {
      ...TaskFragment
    }
  }
}
    ${TaskFragmentDoc}`;

/**
 * __useStartWorkingOnMutation__
 *
 * To run a mutation, you first call `useStartWorkingOnMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useStartWorkingOnMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useStartWorkingOnMutation({
 *   variables: {
 *     taskId: // value for 'taskId'
 *   },
 * });
 */
export function useStartWorkingOnMutation(options: VueApolloComposable.UseMutationOptions<StartWorkingOnMutation, StartWorkingOnMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<StartWorkingOnMutation, StartWorkingOnMutationVariables>>) {
  return VueApolloComposable.useMutation<StartWorkingOnMutation, StartWorkingOnMutationVariables>(StartWorkingOnDocument, options);
}
export type StartWorkingOnMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<StartWorkingOnMutation, StartWorkingOnMutationVariables>;
export const StopWorkingOnDocument = gql`
    mutation stopWorkingOn($taskId: Int!) {
  stopWorkingOn(input: {taskId: $taskId}) {
    task {
      ...TaskFragment
    }
  }
}
    ${TaskFragmentDoc}`;

/**
 * __useStopWorkingOnMutation__
 *
 * To run a mutation, you first call `useStopWorkingOnMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useStopWorkingOnMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useStopWorkingOnMutation({
 *   variables: {
 *     taskId: // value for 'taskId'
 *   },
 * });
 */
export function useStopWorkingOnMutation(options: VueApolloComposable.UseMutationOptions<StopWorkingOnMutation, StopWorkingOnMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<StopWorkingOnMutation, StopWorkingOnMutationVariables>>) {
  return VueApolloComposable.useMutation<StopWorkingOnMutation, StopWorkingOnMutationVariables>(StopWorkingOnDocument, options);
}
export type StopWorkingOnMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<StopWorkingOnMutation, StopWorkingOnMutationVariables>;
export const SubscribeToTaskDocument = gql`
    subscription subscribeToTask($topic: String!) {
  listen(topic: $topic) {
    relatedNode {
      nodeId
      ... on Task {
        ...TaskFragment
      }
    }
  }
}
    ${TaskFragmentDoc}`;

/**
 * __useSubscribeToTaskSubscription__
 *
 * To run a query within a Vue component, call `useSubscribeToTaskSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToTaskSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useSubscribeToTaskSubscription({
 *   topic: // value for 'topic'
 * });
 */
export function useSubscribeToTaskSubscription(variables: SubscribeToTaskSubscriptionVariables | VueCompositionApi.Ref<SubscribeToTaskSubscriptionVariables> | ReactiveFunction<SubscribeToTaskSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<SubscribeToTaskSubscription, SubscribeToTaskSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<SubscribeToTaskSubscription, SubscribeToTaskSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<SubscribeToTaskSubscription, SubscribeToTaskSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<SubscribeToTaskSubscription, SubscribeToTaskSubscriptionVariables>(SubscribeToTaskDocument, variables, options);
}
export type SubscribeToTaskSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<SubscribeToTaskSubscription, SubscribeToTaskSubscriptionVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "Node": [
      "Ctf",
      "CtfSecret",
      "Invitation",
      "Profile",
      "Query",
      "Setting",
      "Task",
      "WorkOnTask"
    ]
  }
};
      export default result;
    
export const ProfileFragment = gql`
    fragment ProfileFragment on Profile {
  id
  username
  color
  description
  role
  nodeId
}
    `;
export const UserFragment = gql`
    fragment UserFragment on User {
  nodeId
  login
  role
  id
  profile {
    ...ProfileFragment
  }
}
    ${ProfileFragment}`;
export const MeFragment = gql`
    fragment MeFragment on MeResponse {
  jwt
  profile {
    ...ProfileFragment
  }
}
    ${ProfileFragment}`;
export const CtfFragment = gql`
    fragment CtfFragment on Ctf {
  nodeId
  id
  granted
  ctfUrl
  ctftimeUrl
  description
  endTime
  logoUrl
  startTime
  weight
  title
}
    `;
export const WorkingOnFragment = gql`
    fragment WorkingOnFragment on WorkOnTask {
  nodeId
  profileId
  profile {
    ...ProfileFragment
  }
}
    ${ProfileFragment}`;
export const TaskFragment = gql`
    fragment TaskFragment on Task {
  nodeId
  id
  title
  ctfId
  padUrl
  description
  flag
  solved
  category
  workOnTasks {
    nodes {
      ...WorkingOnFragment
    }
  }
}
    ${WorkingOnFragment}`;
export const CtfSecretFragment = gql`
    fragment CtfSecretFragment on CtfSecret {
  nodeId
  credentials
}
    `;
export const InvitationFragment = gql`
    fragment InvitationFragment on Invitation {
  nodeId
  ctfId
  profileId
}
    `;
export const FullCtfFragment = gql`
    fragment FullCtfFragment on Ctf {
  ...CtfFragment
  tasks {
    nodes {
      ...TaskFragment
    }
  }
  secrets {
    ...CtfSecretFragment
  }
  invitations {
    nodes {
      ...InvitationFragment
    }
  }
}
    ${CtfFragment}
${TaskFragment}
${CtfSecretFragment}
${InvitationFragment}`;
export const SettingsInfo = gql`
    fragment SettingsInfo on Setting {
  nodeId
  registrationAllowed
  registrationPasswordAllowed
  style
}
    `;
export const AdminSettingsInfo = gql`
    fragment AdminSettingsInfo on Setting {
  nodeId
  ...SettingsInfo
  registrationPassword
  registrationDefaultRole
}
    ${SettingsInfo}`;
export const GetUsers = gql`
    query getUsers {
  users {
    nodes {
      ...UserFragment
    }
  }
}
    ${UserFragment}`;
export const CreateInvitationToken = gql`
    mutation createInvitationToken($role: Role!) {
  createInvitationLink(input: {role: $role}) {
    invitationLinkResponse {
      token
    }
  }
}
    `;
export const CreateResetPasswordToken = gql`
    mutation createResetPasswordToken($userId: Int!) {
  createResetPasswordLink(input: {userId: $userId}) {
    resetPasswordLinkResponse {
      token
    }
  }
}
    `;
export const DeleteUserById = gql`
    mutation deleteUserById($userId: Int!) {
  deleteUser(input: {userId: $userId}) {
    userResponse {
      id
      login
      role
    }
  }
}
    `;
export const UpdateRoleForUserId = gql`
    mutation updateRoleForUserId($userId: Int!, $role: Role!) {
  updateUserRole(input: {userId: $userId, role: $role}) {
    role
  }
}
    `;
export const Me = gql`
    query Me {
  me {
    ...MeFragment
  }
}
    ${MeFragment}`;
export const Login = gql`
    mutation Login($login: String!, $password: String!) {
  login(input: {login: $login, password: $password}) {
    jwt
  }
}
    `;
export const Register = gql`
    mutation Register($login: String!, $password: String!) {
  register(input: {login: $login, password: $password}) {
    jwt
  }
}
    `;
export const RegisterWithToken = gql`
    mutation RegisterWithToken($login: String!, $password: String!, $token: String!) {
  registerWithToken(input: {login: $login, password: $password, token: $token}) {
    jwt
  }
}
    `;
export const RegisterWithPassword = gql`
    mutation RegisterWithPassword($login: String!, $password: String!, $ctfnotePassword: String!) {
  registerWithPassword(
    input: {login: $login, password: $password, ctfnotePassword: $ctfnotePassword}
  ) {
    jwt
  }
}
    `;
export const ResetPassword = gql`
    mutation ResetPassword($password: String!, $token: String!) {
  resetPassword(input: {password: $password, token: $token}) {
    jwt
  }
}
    `;
export const Ctfs = gql`
    query Ctfs {
  ctfs {
    nodes {
      ...CtfFragment
    }
  }
}
    ${CtfFragment}`;
export const SubscribeToCtf = gql`
    subscription subscribeToCtf($topic: String!) {
  listen(topic: $topic) {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Ctf {
        ...CtfFragment
      }
    }
  }
}
    ${CtfFragment}`;
export const GetFullCtf = gql`
    query GetFullCtf($id: Int!) {
  ctf(id: $id) {
    ...FullCtfFragment
  }
}
    ${FullCtfFragment}`;
export const SubscribeToFullCtf = gql`
    subscription subscribeToFullCtf($topic: String!) {
  listen(topic: $topic) {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Ctf {
        ...FullCtfFragment
      }
    }
  }
}
    ${FullCtfFragment}`;
export const IncomingCtfs = gql`
    query IncomingCtfs {
  incomingCtf {
    nodes {
      ...CtfFragment
    }
  }
}
    ${CtfFragment}`;
export const PastCtfs = gql`
    query PastCtfs($first: Int, $offset: Int) {
  pastCtf(first: $first, offset: $offset) {
    nodes {
      ...CtfFragment
    }
    totalCount
  }
}
    ${CtfFragment}`;
export const CreateCtf = gql`
    mutation createCtf($title: String!, $startTime: Datetime!, $endTime: Datetime!, $weight: Float, $ctfUrl: String, $ctftimeUrl: String, $logoUrl: String, $description: String) {
  createCtf(
    input: {ctf: {title: $title, weight: $weight, ctfUrl: $ctfUrl, ctftimeUrl: $ctftimeUrl, logoUrl: $logoUrl, startTime: $startTime, endTime: $endTime, description: $description}}
  ) {
    ctf {
      ...CtfFragment
    }
  }
}
    ${CtfFragment}`;
export const DeleteCtfbyId = gql`
    mutation deleteCtfbyId($id: Int!) {
  deleteCtf(input: {id: $id}) {
    deletedCtfNodeId
  }
}
    `;
export const Importctf = gql`
    mutation importctf($id: Int!) {
  importCtf(input: {ctftimeId: $id}) {
    ctf {
      ...CtfFragment
    }
  }
}
    ${CtfFragment}`;
export const UpdateCtfById = gql`
    mutation updateCtfById($id: Int!, $title: String, $weight: Float, $ctfUrl: String, $ctftimeUrl: String, $logoUrl: String, $startTime: Datetime, $endTime: Datetime, $description: String) {
  updateCtf(
    input: {id: $id, patch: {title: $title, weight: $weight, ctfUrl: $ctfUrl, ctftimeUrl: $ctftimeUrl, logoUrl: $logoUrl, startTime: $startTime, endTime: $endTime, description: $description}}
  ) {
    ctf {
      ...CtfFragment
    }
  }
}
    ${CtfFragment}`;
export const InviteUserToCtf = gql`
    mutation inviteUserToCtf($ctfId: Int!, $profileId: Int!) {
  createInvitation(input: {invitation: {ctfId: $ctfId, profileId: $profileId}}) {
    invitation {
      ...InvitationFragment
    }
  }
}
    ${InvitationFragment}`;
export const UninviteUserToCtf = gql`
    mutation uninviteUserToCtf($ctfId: Int!, $profileId: Int!) {
  deleteInvitation(input: {ctfId: $ctfId, profileId: $profileId}) {
    deletedInvitationNodeId
  }
}
    `;
export const GetGuests = gql`
    query getGuests {
  guests {
    nodes {
      ...ProfileFragment
    }
  }
}
    ${ProfileFragment}`;
export const UpdatePassword = gql`
    mutation updatePassword($oldPassword: String!, $newPassword: String!) {
  changePassword(input: {oldpassword: $oldPassword, newpassword: $newPassword}) {
    changePasswordResponse {
      ok
    }
  }
}
    `;
export const UpdateProfile = gql`
    mutation updateProfile($id: Int!, $patch: ProfilePatch!) {
  updateProfile(input: {id: $id, patch: $patch}) {
    profile {
      ...ProfileFragment
    }
  }
}
    ${ProfileFragment}`;
export const GetTeam = gql`
    query getTeam {
  profiles {
    nodes {
      ...ProfileFragment
    }
  }
}
    ${ProfileFragment}`;
export const SubscribeToProfile = gql`
    subscription subscribeToProfile($topic: String!) {
  listen(topic: $topic) {
    relatedNode {
      nodeId
      ... on Profile {
        ...ProfileFragment
      }
    }
  }
}
    ${ProfileFragment}`;
export const GetCredentialsForCtfId = gql`
    query getCredentialsForCtfId($ctfId: Int!) {
  ctfSecret(id: $ctfId) {
    ...CtfSecretFragment
  }
}
    ${CtfSecretFragment}`;
export const UpdateCredentialsForCtfId = gql`
    mutation updateCredentialsForCtfId($ctfId: Int!, $credentials: String) {
  updateCtfSecret(input: {id: $ctfId, patch: {credentials: $credentials}}) {
    ctfSecret {
      ...CtfSecretFragment
    }
  }
}
    ${CtfSecretFragment}`;
export const GetSettings = gql`
    query getSettings {
  settings {
    nodes {
      ...SettingsInfo
    }
  }
}
    ${SettingsInfo}`;
export const GetAdminSettings = gql`
    query getAdminSettings {
  settings {
    nodes {
      ...AdminSettingsInfo
    }
  }
}
    ${AdminSettingsInfo}`;
export const UpdateSettings = gql`
    mutation updateSettings($nodeId: ID!, $patch: SettingPatch!) {
  updateSettingByNodeId(input: {nodeId: $nodeId, patch: $patch}) {
    setting {
      ...AdminSettingsInfo
    }
  }
}
    ${AdminSettingsInfo}`;
export const GetTasksForCtfId = gql`
    query getTasksForCtfId($ctfId: Int!) {
  tasks(condition: {ctfId: $ctfId}) {
    nodes {
      ...TaskFragment
    }
  }
}
    ${TaskFragment}`;
export const TaskById = gql`
    query taskById($id: Int!) {
  task(id: $id) {
    ...TaskFragment
  }
}
    ${TaskFragment}`;
export const UpdateTask = gql`
    mutation updateTask($id: Int!, $title: String, $description: String, $category: String, $flag: String) {
  updateTask(
    input: {id: $id, patch: {title: $title, category: $category, description: $description, flag: $flag}}
  ) {
    task {
      ...TaskFragment
    }
  }
}
    ${TaskFragment}`;
export const CreateTaskForCtfId = gql`
    mutation createTaskForCtfId($ctfId: Int!, $title: String!, $category: String, $description: String, $flag: String) {
  createTask(
    input: {ctfId: $ctfId, title: $title, category: $category, description: $description, flag: $flag}
  ) {
    task {
      ...TaskFragment
    }
  }
}
    ${TaskFragment}`;
export const DeleteTask = gql`
    mutation deleteTask($id: Int!) {
  deleteTask(input: {id: $id}) {
    deletedTaskNodeId
  }
}
    `;
export const StartWorkingOn = gql`
    mutation startWorkingOn($taskId: Int!) {
  startWorkingOn(input: {taskId: $taskId}) {
    task {
      ...TaskFragment
    }
  }
}
    ${TaskFragment}`;
export const StopWorkingOn = gql`
    mutation stopWorkingOn($taskId: Int!) {
  stopWorkingOn(input: {taskId: $taskId}) {
    task {
      ...TaskFragment
    }
  }
}
    ${TaskFragment}`;
export const SubscribeToTask = gql`
    subscription subscribeToTask($topic: String!) {
  listen(topic: $topic) {
    relatedNode {
      nodeId
      ... on Task {
        ...TaskFragment
      }
    }
  }
}
    ${TaskFragment}`;