import gql from 'graphql-tag';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  Cursor: any;
  Datetime: string;
  JSON: string;
  Jwt: string;
  Upload: File;
};

/** All input for the `addTagsForTask` mutation. */
export type AddTagsForTaskInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  taskid?: InputMaybe<Scalars['Int']>;
};

/** The output of our `addTagsForTask` mutation. */
export type AddTagsForTaskPayload = {
  __typename?: 'AddTagsForTaskPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

export type AssignedTag = Node & {
  __typename?: 'AssignedTag';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  /** Reads a single `Tag` that is related to this `AssignedTag`. */
  tag?: Maybe<Tag>;
  tagId: Scalars['Int'];
  /** Reads a single `Task` that is related to this `AssignedTag`. */
  task?: Maybe<Task>;
  taskId: Scalars['Int'];
};

/**
 * A condition to be used against `AssignedTag` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type AssignedTagCondition = {
  /** Checks for equality with the object’s `tagId` field. */
  tagId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `taskId` field. */
  taskId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `AssignedTag` object types. All fields are combined with a logical ‘and.’ */
export type AssignedTagFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<AssignedTagFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<AssignedTagFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<AssignedTagFilter>>;
  /** Filter by the object’s `tagId` field. */
  tagId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `taskId` field. */
  taskId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `AssignedTag` */
export type AssignedTagInput = {
  tagId: Scalars['Int'];
  taskId: Scalars['Int'];
};

/** A connection to a list of `AssignedTag` values. */
export type AssignedTagsConnection = {
  __typename?: 'AssignedTagsConnection';
  /** A list of edges which contains the `AssignedTag` and cursor to aid in pagination. */
  edges: Array<AssignedTagsEdge>;
  /** A list of `AssignedTag` objects. */
  nodes: Array<AssignedTag>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `AssignedTag` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `AssignedTag` edge in the connection. */
export type AssignedTagsEdge = {
  __typename?: 'AssignedTagsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `AssignedTag` at the end of the edge. */
  node: AssignedTag;
};

/** Methods to use when ordering `AssignedTag`. */
export enum AssignedTagsOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TagIdAsc = 'TAG_ID_ASC',
  TagIdDesc = 'TAG_ID_DESC',
  TaskIdAsc = 'TASK_ID_ASC',
  TaskIdDesc = 'TASK_ID_DESC'
}

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Boolean']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Boolean']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Boolean']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Boolean']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Boolean']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Boolean']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Boolean']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Boolean']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Boolean']>>;
};

/** All input for the `cancelWorkingOn` mutation. */
export type CancelWorkingOnInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  taskId?: InputMaybe<Scalars['Int']>;
};

/** The output of our `cancelWorkingOn` mutation. */
export type CancelWorkingOnPayload = {
  __typename?: 'CancelWorkingOnPayload';
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


/** The output of our `cancelWorkingOn` mutation. */
export type CancelWorkingOnPayloadWorkOnTaskEdgeArgs = {
  orderBy?: InputMaybe<Array<WorkOnTasksOrderBy>>;
};

/** All input for the `changePassword` mutation. */
export type ChangePasswordInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
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

/** All input for the create `AssignedTag` mutation. */
export type CreateAssignedTagInput = {
  /** The `AssignedTag` to be created by this mutation. */
  assignedTag: AssignedTagInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** The output of our create `AssignedTag` mutation. */
export type CreateAssignedTagPayload = {
  __typename?: 'CreateAssignedTagPayload';
  /** The `AssignedTag` that was created by this mutation. */
  assignedTag?: Maybe<AssignedTag>;
  /** An edge for our `AssignedTag`. May be used by Relay 1. */
  assignedTagEdge?: Maybe<AssignedTagsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tag` that is related to this `AssignedTag`. */
  tag?: Maybe<Tag>;
  /** Reads a single `Task` that is related to this `AssignedTag`. */
  task?: Maybe<Task>;
};


/** The output of our create `AssignedTag` mutation. */
export type CreateAssignedTagPayloadAssignedTagEdgeArgs = {
  orderBy?: InputMaybe<Array<AssignedTagsOrderBy>>;
};

/** All input for the create `Ctf` mutation. */
export type CreateCtfInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  orderBy?: InputMaybe<Array<CtfsOrderBy>>;
};

/** All input for the create `Invitation` mutation. */
export type CreateInvitationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Invitation` to be created by this mutation. */
  invitation: InvitationInput;
};

/** All input for the `createInvitationLink` mutation. */
export type CreateInvitationLinkInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  discordId?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Role>;
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
  orderBy?: InputMaybe<Array<InvitationsOrderBy>>;
};

/** All input for the `createResetPasswordLink` mutation. */
export type CreateResetPasswordLinkInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['Int']>;
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

/** All input for the create `Tag` mutation. */
export type CreateTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Tag` to be created by this mutation. */
  tag: TagInput;
};

/** The output of our create `Tag` mutation. */
export type CreateTagPayload = {
  __typename?: 'CreateTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Tag` that was created by this mutation. */
  tag?: Maybe<Tag>;
  /** An edge for our `Tag`. May be used by Relay 1. */
  tagEdge?: Maybe<TagsEdge>;
};


/** The output of our create `Tag` mutation. */
export type CreateTagPayloadTagEdgeArgs = {
  orderBy?: InputMaybe<Array<TagsOrderBy>>;
};

export type CreateTaskInput = {
  ctfId: Scalars['Int'];
  description?: InputMaybe<Scalars['String']>;
  flag?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title: Scalars['String'];
};

export type CreateTaskPayload = {
  __typename?: 'CreateTaskPayload';
  query?: Maybe<Query>;
  task?: Maybe<Task>;
};

/** All input for the create `WorkOnTask` mutation. */
export type CreateWorkOnTaskInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `WorkOnTask` to be created by this mutation. */
  workOnTask: WorkOnTaskInput;
};

/** The output of our create `WorkOnTask` mutation. */
export type CreateWorkOnTaskPayload = {
  __typename?: 'CreateWorkOnTaskPayload';
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
  /** The `WorkOnTask` that was created by this mutation. */
  workOnTask?: Maybe<WorkOnTask>;
  /** An edge for our `WorkOnTask`. May be used by Relay 1. */
  workOnTaskEdge?: Maybe<WorkOnTasksEdge>;
};


/** The output of our create `WorkOnTask` mutation. */
export type CreateWorkOnTaskPayloadWorkOnTaskEdgeArgs = {
  orderBy?: InputMaybe<Array<WorkOnTasksOrderBy>>;
};

export type Ctf = Node & {
  __typename?: 'Ctf';
  ctfUrl?: Maybe<Scalars['String']>;
  ctftimeUrl?: Maybe<Scalars['String']>;
  description: Scalars['String'];
  discordEventLink?: Maybe<Scalars['String']>;
  endTime: Scalars['Datetime'];
  granted?: Maybe<Scalars['Boolean']>;
  id: Scalars['Int'];
  /** Reads and enables pagination through a set of `Invitation`. */
  invitations: InvitationsConnection;
  logoUrl?: Maybe<Scalars['String']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  /** Reads and enables pagination through a set of `Profile`. */
  profilesByInvitationCtfIdAndProfileId: CtfProfilesByInvitationCtfIdAndProfileIdManyToManyConnection;
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
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<InvitationCondition>;
  filter?: InputMaybe<InvitationFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InvitationsOrderBy>>;
};


export type CtfProfilesByInvitationCtfIdAndProfileIdArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ProfileCondition>;
  filter?: InputMaybe<ProfileFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ProfilesOrderBy>>;
};


export type CtfTasksArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TaskCondition>;
  filter?: InputMaybe<TaskFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TasksOrderBy>>;
};

/** A condition to be used against `Ctf` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type CtfCondition = {
  /** Checks for equality with the object’s `endTime` field. */
  endTime?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `secretsId` field. */
  secretsId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `startTime` field. */
  startTime?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `Ctf` object types. All fields are combined with a logical ‘and.’ */
export type CtfFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CtfFilter>>;
  /** Filter by the object’s `endTime` field. */
  endTime?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `granted` field. */
  granted?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CtfFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CtfFilter>>;
  /** Filter by the object’s `secretsId` field. */
  secretsId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `startTime` field. */
  startTime?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `Ctf` */
export type CtfInput = {
  ctfUrl?: InputMaybe<Scalars['String']>;
  ctftimeUrl?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  endTime: Scalars['Datetime'];
  logoUrl?: InputMaybe<Scalars['String']>;
  startTime: Scalars['Datetime'];
  title: Scalars['String'];
  weight?: InputMaybe<Scalars['Float']>;
};

/** Represents an update to a `Ctf`. Fields that are set will be updated. */
export type CtfPatch = {
  ctfUrl?: InputMaybe<Scalars['String']>;
  ctftimeUrl?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  discordEventLink?: InputMaybe<Scalars['String']>;
  endTime?: InputMaybe<Scalars['Datetime']>;
  logoUrl?: InputMaybe<Scalars['String']>;
  startTime?: InputMaybe<Scalars['Datetime']>;
  title?: InputMaybe<Scalars['String']>;
  weight?: InputMaybe<Scalars['Float']>;
};

/** A connection to a list of `Profile` values, with data from `Invitation`. */
export type CtfProfilesByInvitationCtfIdAndProfileIdManyToManyConnection = {
  __typename?: 'CtfProfilesByInvitationCtfIdAndProfileIdManyToManyConnection';
  /** A list of edges which contains the `Profile`, info from the `Invitation`, and the cursor to aid in pagination. */
  edges: Array<CtfProfilesByInvitationCtfIdAndProfileIdManyToManyEdge>;
  /** A list of `Profile` objects. */
  nodes: Array<Profile>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Profile` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Profile` edge in the connection, with data from `Invitation`. */
export type CtfProfilesByInvitationCtfIdAndProfileIdManyToManyEdge = {
  __typename?: 'CtfProfilesByInvitationCtfIdAndProfileIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Profile` at the end of the edge. */
  node: Profile;
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
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CtfCondition>;
  filter?: InputMaybe<CtfFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CtfsOrderBy>>;
};

/**
 * A condition to be used against `CtfSecret` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type CtfSecretCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `CtfSecret` object types. All fields are combined with a logical ‘and.’ */
export type CtfSecretFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CtfSecretFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CtfSecretFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CtfSecretFilter>>;
};

/** Represents an update to a `CtfSecret`. Fields that are set will be updated. */
export type CtfSecretPatch = {
  credentials?: InputMaybe<Scalars['String']>;
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
  StartTimeDesc = 'START_TIME_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC'
}

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Datetime']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Datetime']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Datetime']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Datetime']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Datetime']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Datetime']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Datetime']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Datetime']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Datetime']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Datetime']>>;
};

/** All input for the `deleteAssignedTagByNodeId` mutation. */
export type DeleteAssignedTagByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `AssignedTag` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteAssignedTag` mutation. */
export type DeleteAssignedTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  tagId: Scalars['Int'];
  taskId: Scalars['Int'];
};

/** The output of our delete `AssignedTag` mutation. */
export type DeleteAssignedTagPayload = {
  __typename?: 'DeleteAssignedTagPayload';
  /** The `AssignedTag` that was deleted by this mutation. */
  assignedTag?: Maybe<AssignedTag>;
  /** An edge for our `AssignedTag`. May be used by Relay 1. */
  assignedTagEdge?: Maybe<AssignedTagsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedAssignedTagNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tag` that is related to this `AssignedTag`. */
  tag?: Maybe<Tag>;
  /** Reads a single `Task` that is related to this `AssignedTag`. */
  task?: Maybe<Task>;
};


/** The output of our delete `AssignedTag` mutation. */
export type DeleteAssignedTagPayloadAssignedTagEdgeArgs = {
  orderBy?: InputMaybe<Array<AssignedTagsOrderBy>>;
};

/** All input for the `deleteCtfByNodeId` mutation. */
export type DeleteCtfByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Ctf` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteCtf` mutation. */
export type DeleteCtfInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  orderBy?: InputMaybe<Array<CtfsOrderBy>>;
};

/** All input for the `deleteInvitationByNodeId` mutation. */
export type DeleteInvitationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Invitation` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteInvitation` mutation. */
export type DeleteInvitationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  orderBy?: InputMaybe<Array<InvitationsOrderBy>>;
};

/** All input for the `deleteTaskByNodeId` mutation. */
export type DeleteTaskByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Task` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteTask` mutation. */
export type DeleteTaskInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  orderBy?: InputMaybe<Array<TasksOrderBy>>;
};

/** All input for the `deleteUser` mutation. */
export type DeleteUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['Int']>;
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

/** All input for the `deleteWorkOnTaskByNodeId` mutation. */
export type DeleteWorkOnTaskByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `WorkOnTask` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteWorkOnTask` mutation. */
export type DeleteWorkOnTaskInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  profileId: Scalars['Int'];
  taskId: Scalars['Int'];
};

/** The output of our delete `WorkOnTask` mutation. */
export type DeleteWorkOnTaskPayload = {
  __typename?: 'DeleteWorkOnTaskPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedWorkOnTaskNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `Profile` that is related to this `WorkOnTask`. */
  profile?: Maybe<Profile>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Task` that is related to this `WorkOnTask`. */
  task?: Maybe<Task>;
  /** The `WorkOnTask` that was deleted by this mutation. */
  workOnTask?: Maybe<WorkOnTask>;
  /** An edge for our `WorkOnTask`. May be used by Relay 1. */
  workOnTaskEdge?: Maybe<WorkOnTasksEdge>;
};


/** The output of our delete `WorkOnTask` mutation. */
export type DeleteWorkOnTaskPayloadWorkOnTaskEdgeArgs = {
  orderBy?: InputMaybe<Array<WorkOnTasksOrderBy>>;
};

export type ImportCtfInput = {
  ctftimeId: Scalars['Int'];
};

export type ImportCtfPayload = {
  __typename?: 'ImportCtfPayload';
  ctf?: Maybe<Ctf>;
  query?: Maybe<Query>;
};

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Int']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Int']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Int']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Int']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Int']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Int']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Int']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Int']>>;
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
  ctfId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `profileId` field. */
  profileId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `Invitation` object types. All fields are combined with a logical ‘and.’ */
export type InvitationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<InvitationFilter>>;
  /** Filter by the object’s `ctfId` field. */
  ctfId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<InvitationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<InvitationFilter>>;
  /** Filter by the object’s `profileId` field. */
  profileId?: InputMaybe<IntFilter>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
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

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  addTagsForTask?: Maybe<AddTagsForTaskPayload>;
  cancelWorkingOn?: Maybe<CancelWorkingOnPayload>;
  changePassword?: Maybe<ChangePasswordPayload>;
  /** Creates a single `AssignedTag`. */
  createAssignedTag?: Maybe<CreateAssignedTagPayload>;
  /** Creates a single `Ctf`. */
  createCtf?: Maybe<CreateCtfPayload>;
  /** Creates a single `Invitation`. */
  createInvitation?: Maybe<CreateInvitationPayload>;
  createInvitationLink?: Maybe<CreateInvitationLinkPayload>;
  createResetPasswordLink?: Maybe<CreateResetPasswordLinkPayload>;
  /** Creates a single `Tag`. */
  createTag?: Maybe<CreateTagPayload>;
  createTask?: Maybe<CreateTaskPayload>;
  /** Creates a single `WorkOnTask`. */
  createWorkOnTask?: Maybe<CreateWorkOnTaskPayload>;
  /** Deletes a single `AssignedTag` using a unique key. */
  deleteAssignedTag?: Maybe<DeleteAssignedTagPayload>;
  /** Deletes a single `AssignedTag` using its globally unique id. */
  deleteAssignedTagByNodeId?: Maybe<DeleteAssignedTagPayload>;
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
  /** Deletes a single `WorkOnTask` using a unique key. */
  deleteWorkOnTask?: Maybe<DeleteWorkOnTaskPayload>;
  /** Deletes a single `WorkOnTask` using its globally unique id. */
  deleteWorkOnTaskByNodeId?: Maybe<DeleteWorkOnTaskPayload>;
  importCtf?: Maybe<ImportCtfPayload>;
  login?: Maybe<LoginPayload>;
  register?: Maybe<RegisterPayload>;
  registerWithPassword?: Maybe<RegisterWithPasswordPayload>;
  registerWithToken?: Maybe<RegisterWithTokenPayload>;
  resetDiscordId?: Maybe<ResetDiscordIdPayload>;
  resetPassword?: Maybe<ResetPasswordPayload>;
  resetProfileToken?: Maybe<ResetProfileTokenPayload>;
  setDiscordEventLink?: Maybe<SetDiscordEventLinkPayload>;
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
  updateLastActive?: Maybe<UpdateLastActivePayload>;
  /** Updates a single `Profile` using a unique key and a patch. */
  updateProfile?: Maybe<UpdateProfilePayload>;
  /** Updates a single `Profile` using a unique key and a patch. */
  updateProfileByDiscordId?: Maybe<UpdateProfilePayload>;
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
  /** Updates a single `WorkOnTask` using a unique key and a patch. */
  updateWorkOnTask?: Maybe<UpdateWorkOnTaskPayload>;
  /** Updates a single `WorkOnTask` using its globally unique id and a patch. */
  updateWorkOnTaskByNodeId?: Maybe<UpdateWorkOnTaskPayload>;
  uploadCtfLogo: Scalars['String'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationAddTagsForTaskArgs = {
  input: AddTagsForTaskInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCancelWorkingOnArgs = {
  input: CancelWorkingOnInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateAssignedTagArgs = {
  input: CreateAssignedTagInput;
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
export type MutationCreateTagArgs = {
  input: CreateTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTaskArgs = {
  input?: InputMaybe<CreateTaskInput>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateWorkOnTaskArgs = {
  input: CreateWorkOnTaskInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAssignedTagArgs = {
  input: DeleteAssignedTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAssignedTagByNodeIdArgs = {
  input: DeleteAssignedTagByNodeIdInput;
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
export type MutationDeleteWorkOnTaskArgs = {
  input: DeleteWorkOnTaskInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWorkOnTaskByNodeIdArgs = {
  input: DeleteWorkOnTaskByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationImportCtfArgs = {
  input?: InputMaybe<ImportCtfInput>;
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
export type MutationResetDiscordIdArgs = {
  input: ResetDiscordIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationResetProfileTokenArgs = {
  input: ResetProfileTokenInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationSetDiscordEventLinkArgs = {
  input: SetDiscordEventLinkInput;
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
export type MutationUpdateLastActiveArgs = {
  input: UpdateLastActiveInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProfileByDiscordIdArgs = {
  input: UpdateProfileByDiscordIdInput;
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


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWorkOnTaskArgs = {
  input: UpdateWorkOnTaskInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWorkOnTaskByNodeIdArgs = {
  input: UpdateWorkOnTaskByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUploadCtfLogoArgs = {
  logo: Scalars['Upload'];
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
  /** Reads and enables pagination through a set of `Ctf`. */
  ctfsByInvitationProfileIdAndCtfId: ProfileCtfsByInvitationProfileIdAndCtfIdManyToManyConnection;
  description: Scalars['String'];
  discordId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  /** Reads and enables pagination through a set of `Invitation`. */
  invitations: InvitationsConnection;
  lastactive: Scalars['Datetime'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  role?: Maybe<Role>;
  /** Reads and enables pagination through a set of `Task`. */
  tasksByWorkOnTaskProfileIdAndTaskId: ProfileTasksByWorkOnTaskProfileIdAndTaskIdManyToManyConnection;
  username: Scalars['String'];
  /** Reads and enables pagination through a set of `WorkOnTask`. */
  workOnTasks: WorkOnTasksConnection;
};


export type ProfileCtfsByInvitationProfileIdAndCtfIdArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CtfCondition>;
  filter?: InputMaybe<CtfFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CtfsOrderBy>>;
};


export type ProfileInvitationsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<InvitationCondition>;
  filter?: InputMaybe<InvitationFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InvitationsOrderBy>>;
};


export type ProfileTasksByWorkOnTaskProfileIdAndTaskIdArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TaskCondition>;
  filter?: InputMaybe<TaskFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TasksOrderBy>>;
};


export type ProfileWorkOnTasksArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<WorkOnTaskCondition>;
  filter?: InputMaybe<WorkOnTaskFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<WorkOnTasksOrderBy>>;
};

/** A condition to be used against `Profile` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ProfileCondition = {
  /** Checks for equality with the object’s `discordId` field. */
  discordId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `username` field. */
  username?: InputMaybe<Scalars['String']>;
};

/** A connection to a list of `Ctf` values, with data from `Invitation`. */
export type ProfileCtfsByInvitationProfileIdAndCtfIdManyToManyConnection = {
  __typename?: 'ProfileCtfsByInvitationProfileIdAndCtfIdManyToManyConnection';
  /** A list of edges which contains the `Ctf`, info from the `Invitation`, and the cursor to aid in pagination. */
  edges: Array<ProfileCtfsByInvitationProfileIdAndCtfIdManyToManyEdge>;
  /** A list of `Ctf` objects. */
  nodes: Array<Ctf>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Ctf` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Ctf` edge in the connection, with data from `Invitation`. */
export type ProfileCtfsByInvitationProfileIdAndCtfIdManyToManyEdge = {
  __typename?: 'ProfileCtfsByInvitationProfileIdAndCtfIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Ctf` at the end of the edge. */
  node: Ctf;
};

/** A filter to be used against `Profile` object types. All fields are combined with a logical ‘and.’ */
export type ProfileFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProfileFilter>>;
  /** Filter by the object’s `discordId` field. */
  discordId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ProfileFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProfileFilter>>;
  /** Filter by the object’s `role` field. */
  role?: InputMaybe<RoleFilter>;
  /** Filter by the object’s `username` field. */
  username?: InputMaybe<StringFilter>;
};

/** Represents an update to a `Profile`. Fields that are set will be updated. */
export type ProfilePatch = {
  color?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

/** A connection to a list of `Task` values, with data from `WorkOnTask`. */
export type ProfileTasksByWorkOnTaskProfileIdAndTaskIdManyToManyConnection = {
  __typename?: 'ProfileTasksByWorkOnTaskProfileIdAndTaskIdManyToManyConnection';
  /** A list of edges which contains the `Task`, info from the `WorkOnTask`, and the cursor to aid in pagination. */
  edges: Array<ProfileTasksByWorkOnTaskProfileIdAndTaskIdManyToManyEdge>;
  /** A list of `Task` objects. */
  nodes: Array<Task>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Task` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Task` edge in the connection, with data from `WorkOnTask`. */
export type ProfileTasksByWorkOnTaskProfileIdAndTaskIdManyToManyEdge = {
  __typename?: 'ProfileTasksByWorkOnTaskProfileIdAndTaskIdManyToManyEdge';
  active: Scalars['Boolean'];
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Task` at the end of the edge. */
  node: Task;
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
  DiscordIdAsc = 'DISCORD_ID_ASC',
  DiscordIdDesc = 'DISCORD_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UsernameAsc = 'USERNAME_ASC',
  UsernameDesc = 'USERNAME_DESC'
}

export type PublicProfile = {
  __typename?: 'PublicProfile';
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  nodeId?: Maybe<Scalars['String']>;
  role?: Maybe<Role>;
  username?: Maybe<Scalars['String']>;
};

export type PublicProfileSubscriptionPayload = {
  __typename?: 'PublicProfileSubscriptionPayload';
  event?: Maybe<Scalars['String']>;
  publicProfile?: Maybe<PublicProfile>;
};

/** A connection to a list of `PublicProfile` values. */
export type PublicProfilesConnection = {
  __typename?: 'PublicProfilesConnection';
  /** A list of edges which contains the `PublicProfile` and cursor to aid in pagination. */
  edges: Array<PublicProfilesEdge>;
  /** A list of `PublicProfile` objects. */
  nodes: Array<PublicProfile>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PublicProfile` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `PublicProfile` edge in the connection. */
export type PublicProfilesEdge = {
  __typename?: 'PublicProfilesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PublicProfile` at the end of the edge. */
  node: PublicProfile;
};

/** Methods to use when ordering `PublicProfile`. */
export enum PublicProfilesOrderBy {
  Natural = 'NATURAL'
}

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  assignedTag?: Maybe<AssignedTag>;
  /** Reads a single `AssignedTag` using its globally unique `ID`. */
  assignedTagByNodeId?: Maybe<AssignedTag>;
  /** Reads and enables pagination through a set of `AssignedTag`. */
  assignedTags?: Maybe<AssignedTagsConnection>;
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
  me?: Maybe<Profile>;
  newToken?: Maybe<Scalars['Jwt']>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID'];
  /** Reads and enables pagination through a set of `Ctf`. */
  pastCtf?: Maybe<CtfsConnection>;
  profile?: Maybe<Profile>;
  profileByDiscordId?: Maybe<Profile>;
  /** Reads a single `Profile` using its globally unique `ID`. */
  profileByNodeId?: Maybe<Profile>;
  profileByUsername?: Maybe<Profile>;
  profileToken?: Maybe<Scalars['String']>;
  /** Reads and enables pagination through a set of `Profile`. */
  profiles?: Maybe<ProfilesConnection>;
  /** Reads and enables pagination through a set of `PublicProfile`. */
  publicProfiles?: Maybe<PublicProfilesConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** Reads a single `Setting` using its globally unique `ID`. */
  settingByNodeId?: Maybe<Setting>;
  /** Reads and enables pagination through a set of `Setting`. */
  settings?: Maybe<SettingsConnection>;
  tag?: Maybe<Tag>;
  /** Reads a single `Tag` using its globally unique `ID`. */
  tagByNodeId?: Maybe<Tag>;
  tagByTag?: Maybe<Tag>;
  /** Reads and enables pagination through a set of `Tag`. */
  tags?: Maybe<TagsConnection>;
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
export type QueryAssignedTagArgs = {
  tagId: Scalars['Int'];
  taskId: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAssignedTagByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAssignedTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<AssignedTagCondition>;
  filter?: InputMaybe<AssignedTagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<AssignedTagsOrderBy>>;
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
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CtfSecretCondition>;
  filter?: InputMaybe<CtfSecretFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CtfSecretsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCtfsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CtfCondition>;
  filter?: InputMaybe<CtfFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CtfsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGuestsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<ProfileFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryIncomingCtfArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<CtfFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
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
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<InvitationCondition>;
  filter?: InputMaybe<InvitationFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InvitationsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPastCtfArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<CtfFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryProfileArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProfileByDiscordIdArgs = {
  discordId: Scalars['String'];
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
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ProfileCondition>;
  filter?: InputMaybe<ProfileFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ProfilesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPublicProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PublicProfilesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySettingByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySettingsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SettingsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTagArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTagByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTagByTagArgs = {
  tag: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TagCondition>;
  filter?: InputMaybe<TagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TagsOrderBy>>;
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
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TaskCondition>;
  filter?: InputMaybe<TaskFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TasksOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
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
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<WorkOnTaskCondition>;
  filter?: InputMaybe<WorkOnTaskFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<WorkOnTasksOrderBy>>;
};

/** All input for the `register` mutation. */
export type RegisterInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
  login?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
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

/** All input for the `resetDiscordId` mutation. */
export type ResetDiscordIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** The output of our `resetDiscordId` mutation. */
export type ResetDiscordIdPayload = {
  __typename?: 'ResetDiscordIdPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  string?: Maybe<Scalars['String']>;
};

/** All input for the `resetPassword` mutation. */
export type ResetPasswordInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
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

/** All input for the `resetProfileToken` mutation. */
export type ResetProfileTokenInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** The output of our `resetProfileToken` mutation. */
export type ResetProfileTokenPayload = {
  __typename?: 'ResetProfileTokenPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  string?: Maybe<Scalars['String']>;
};

export enum Role {
  UserAdmin = 'USER_ADMIN',
  UserFriend = 'USER_FRIEND',
  UserGuest = 'USER_GUEST',
  UserManager = 'USER_MANAGER',
  UserMember = 'USER_MEMBER'
}

/** A filter to be used against Role fields. All fields are combined with a logical ‘and.’ */
export type RoleFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Role>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Role>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Role>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Role>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Role>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Role>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Role>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Role>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Role>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Role>>;
};

/** All input for the `setDiscordEventLink` mutation. */
export type SetDiscordEventLinkInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  ctfId?: InputMaybe<Scalars['Int']>;
  link?: InputMaybe<Scalars['String']>;
};

/** The output of our `setDiscordEventLink` mutation. */
export type SetDiscordEventLinkPayload = {
  __typename?: 'SetDiscordEventLinkPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

export type Setting = Node & {
  __typename?: 'Setting';
  discordIntegrationEnabled: Scalars['Boolean'];
  icalPassword?: Maybe<Scalars['String']>;
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
  discordIntegrationEnabled?: InputMaybe<Scalars['Boolean']>;
  icalPassword?: InputMaybe<Scalars['String']>;
  registrationAllowed?: InputMaybe<Scalars['Boolean']>;
  registrationDefaultRole?: InputMaybe<Role>;
  registrationPassword?: InputMaybe<Scalars['String']>;
  registrationPasswordAllowed?: InputMaybe<Scalars['Boolean']>;
  style?: InputMaybe<Scalars['JSON']>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
  taskId?: InputMaybe<Scalars['Int']>;
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
  orderBy?: InputMaybe<Array<WorkOnTasksOrderBy>>;
};

/** All input for the `stopWorkingOn` mutation. */
export type StopWorkingOnInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  taskId?: InputMaybe<Scalars['Int']>;
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
  orderBy?: InputMaybe<Array<WorkOnTasksOrderBy>>;
};

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: InputMaybe<Scalars['String']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: InputMaybe<Scalars['String']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: InputMaybe<Scalars['String']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: InputMaybe<Scalars['String']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['String']>>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Array<Scalars['String']>>;
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: InputMaybe<Scalars['String']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: InputMaybe<Scalars['String']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: InputMaybe<Scalars['String']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: InputMaybe<Scalars['String']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['String']>>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Array<Scalars['String']>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: InputMaybe<Scalars['String']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: InputMaybe<Scalars['String']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: InputMaybe<Scalars['String']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: InputMaybe<Scalars['String']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: InputMaybe<Scalars['String']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: InputMaybe<Scalars['String']>;
};

/** The root subscription type: contains realtime events you can subscribe to with the `subscription` operation. */
export type Subscription = {
  __typename?: 'Subscription';
  currentProfileCreated?: Maybe<PublicProfileSubscriptionPayload>;
  currentProfileDeleted?: Maybe<PublicProfileSubscriptionPayload>;
  currentProfileUpdated?: Maybe<PublicProfileSubscriptionPayload>;
  listen: ListenPayload;
};


/** The root subscription type: contains realtime events you can subscribe to with the `subscription` operation. */
export type SubscriptionListenArgs = {
  topic: Scalars['String'];
};

export type Tag = Node & {
  __typename?: 'Tag';
  /** Reads and enables pagination through a set of `AssignedTag`. */
  assignedTags: AssignedTagsConnection;
  id: Scalars['Int'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  tag: Scalars['String'];
  /** Reads and enables pagination through a set of `Task`. */
  tasksByAssignedTagTagIdAndTaskId: TagTasksByAssignedTagTagIdAndTaskIdManyToManyConnection;
};


export type TagAssignedTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<AssignedTagCondition>;
  filter?: InputMaybe<AssignedTagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<AssignedTagsOrderBy>>;
};


export type TagTasksByAssignedTagTagIdAndTaskIdArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TaskCondition>;
  filter?: InputMaybe<TaskFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TasksOrderBy>>;
};

/** A condition to be used against `Tag` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TagCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `tag` field. */
  tag?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `Tag` object types. All fields are combined with a logical ‘and.’ */
export type TagFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TagFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TagFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TagFilter>>;
  /** Filter by the object’s `tag` field. */
  tag?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `Tag` */
export type TagInput = {
  id?: InputMaybe<Scalars['Int']>;
  tag: Scalars['String'];
};

/** A connection to a list of `Task` values, with data from `AssignedTag`. */
export type TagTasksByAssignedTagTagIdAndTaskIdManyToManyConnection = {
  __typename?: 'TagTasksByAssignedTagTagIdAndTaskIdManyToManyConnection';
  /** A list of edges which contains the `Task`, info from the `AssignedTag`, and the cursor to aid in pagination. */
  edges: Array<TagTasksByAssignedTagTagIdAndTaskIdManyToManyEdge>;
  /** A list of `Task` objects. */
  nodes: Array<Task>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Task` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Task` edge in the connection, with data from `AssignedTag`. */
export type TagTasksByAssignedTagTagIdAndTaskIdManyToManyEdge = {
  __typename?: 'TagTasksByAssignedTagTagIdAndTaskIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Task` at the end of the edge. */
  node: Task;
};

/** A connection to a list of `Tag` values. */
export type TagsConnection = {
  __typename?: 'TagsConnection';
  /** A list of edges which contains the `Tag` and cursor to aid in pagination. */
  edges: Array<TagsEdge>;
  /** A list of `Tag` objects. */
  nodes: Array<Tag>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Tag` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Tag` edge in the connection. */
export type TagsEdge = {
  __typename?: 'TagsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Tag` at the end of the edge. */
  node: Tag;
};

/** Methods to use when ordering `Tag`. */
export enum TagsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TagAsc = 'TAG_ASC',
  TagDesc = 'TAG_DESC'
}

export type Task = Node & {
  __typename?: 'Task';
  /** Reads and enables pagination through a set of `AssignedTag`. */
  assignedTags: AssignedTagsConnection;
  /** Reads a single `Ctf` that is related to this `Task`. */
  ctf?: Maybe<Ctf>;
  ctfId: Scalars['Int'];
  description: Scalars['String'];
  flag: Scalars['String'];
  id: Scalars['Int'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  padUrl: Scalars['String'];
  /** Reads and enables pagination through a set of `Profile`. */
  profilesByWorkOnTaskTaskIdAndProfileId: TaskProfilesByWorkOnTaskTaskIdAndProfileIdManyToManyConnection;
  solved?: Maybe<Scalars['Boolean']>;
  /** Reads and enables pagination through a set of `Tag`. */
  tagsByAssignedTagTaskIdAndTagId: TaskTagsByAssignedTagTaskIdAndTagIdManyToManyConnection;
  title: Scalars['String'];
  /** Reads and enables pagination through a set of `WorkOnTask`. */
  workOnTasks: WorkOnTasksConnection;
};


export type TaskAssignedTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<AssignedTagCondition>;
  filter?: InputMaybe<AssignedTagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<AssignedTagsOrderBy>>;
};


export type TaskProfilesByWorkOnTaskTaskIdAndProfileIdArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ProfileCondition>;
  filter?: InputMaybe<ProfileFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ProfilesOrderBy>>;
};


export type TaskTagsByAssignedTagTaskIdAndTagIdArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TagCondition>;
  filter?: InputMaybe<TagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TagsOrderBy>>;
};


export type TaskWorkOnTasksArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<WorkOnTaskCondition>;
  filter?: InputMaybe<WorkOnTaskFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<WorkOnTasksOrderBy>>;
};

/** A condition to be used against `Task` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TaskCondition = {
  /** Checks for equality with the object’s `ctfId` field. */
  ctfId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `Task` object types. All fields are combined with a logical ‘and.’ */
export type TaskFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TaskFilter>>;
  /** Filter by the object’s `ctfId` field. */
  ctfId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TaskFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TaskFilter>>;
  /** Filter by the object’s `solved` field. */
  solved?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
};

/** Represents an update to a `Task`. Fields that are set will be updated. */
export type TaskPatch = {
  description?: InputMaybe<Scalars['String']>;
  flag?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

/** A connection to a list of `Profile` values, with data from `WorkOnTask`. */
export type TaskProfilesByWorkOnTaskTaskIdAndProfileIdManyToManyConnection = {
  __typename?: 'TaskProfilesByWorkOnTaskTaskIdAndProfileIdManyToManyConnection';
  /** A list of edges which contains the `Profile`, info from the `WorkOnTask`, and the cursor to aid in pagination. */
  edges: Array<TaskProfilesByWorkOnTaskTaskIdAndProfileIdManyToManyEdge>;
  /** A list of `Profile` objects. */
  nodes: Array<Profile>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Profile` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Profile` edge in the connection, with data from `WorkOnTask`. */
export type TaskProfilesByWorkOnTaskTaskIdAndProfileIdManyToManyEdge = {
  __typename?: 'TaskProfilesByWorkOnTaskTaskIdAndProfileIdManyToManyEdge';
  active: Scalars['Boolean'];
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Profile` at the end of the edge. */
  node: Profile;
};

/** A connection to a list of `Tag` values, with data from `AssignedTag`. */
export type TaskTagsByAssignedTagTaskIdAndTagIdManyToManyConnection = {
  __typename?: 'TaskTagsByAssignedTagTaskIdAndTagIdManyToManyConnection';
  /** A list of edges which contains the `Tag`, info from the `AssignedTag`, and the cursor to aid in pagination. */
  edges: Array<TaskTagsByAssignedTagTaskIdAndTagIdManyToManyEdge>;
  /** A list of `Tag` objects. */
  nodes: Array<Tag>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Tag` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Tag` edge in the connection, with data from `AssignedTag`. */
export type TaskTagsByAssignedTagTaskIdAndTagIdManyToManyEdge = {
  __typename?: 'TaskTagsByAssignedTagTaskIdAndTagIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Tag` at the end of the edge. */
  node: Tag;
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
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC'
}

/** All input for the `updateCtfByNodeId` mutation. */
export type UpdateCtfByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  orderBy?: InputMaybe<Array<CtfsOrderBy>>;
};

/** All input for the `updateCtfSecretByNodeId` mutation. */
export type UpdateCtfSecretByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  orderBy?: InputMaybe<Array<CtfSecretsOrderBy>>;
};

/** All input for the `updateLastActive` mutation. */
export type UpdateLastActiveInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** The output of our `updateLastActive` mutation. */
export type UpdateLastActivePayload = {
  __typename?: 'UpdateLastActivePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `updateProfileByDiscordId` mutation. */
export type UpdateProfileByDiscordIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  discordId: Scalars['String'];
  /** An object where the defined keys will be set on the `Profile` being updated. */
  patch: ProfilePatch;
};

/** All input for the `updateProfileByNodeId` mutation. */
export type UpdateProfileByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  orderBy?: InputMaybe<Array<ProfilesOrderBy>>;
};

/** All input for the `updateSettingByNodeId` mutation. */
export type UpdateSettingByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  orderBy?: InputMaybe<Array<SettingsOrderBy>>;
};

/** All input for the `updateTaskByNodeId` mutation. */
export type UpdateTaskByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  orderBy?: InputMaybe<Array<TasksOrderBy>>;
};

/** All input for the `updateUserRole` mutation. */
export type UpdateUserRoleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Role>;
  userId?: InputMaybe<Scalars['Int']>;
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

/** All input for the `updateWorkOnTaskByNodeId` mutation. */
export type UpdateWorkOnTaskByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `WorkOnTask` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `WorkOnTask` being updated. */
  patch: WorkOnTaskPatch;
};

/** All input for the `updateWorkOnTask` mutation. */
export type UpdateWorkOnTaskInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `WorkOnTask` being updated. */
  patch: WorkOnTaskPatch;
  profileId: Scalars['Int'];
  taskId: Scalars['Int'];
};

/** The output of our update `WorkOnTask` mutation. */
export type UpdateWorkOnTaskPayload = {
  __typename?: 'UpdateWorkOnTaskPayload';
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
  /** The `WorkOnTask` that was updated by this mutation. */
  workOnTask?: Maybe<WorkOnTask>;
  /** An edge for our `WorkOnTask`. May be used by Relay 1. */
  workOnTaskEdge?: Maybe<WorkOnTasksEdge>;
};


/** The output of our update `WorkOnTask` mutation. */
export type UpdateWorkOnTaskPayloadWorkOnTaskEdgeArgs = {
  orderBy?: InputMaybe<Array<WorkOnTasksOrderBy>>;
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
  active: Scalars['Boolean'];
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
  profileId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `taskId` field. */
  taskId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `WorkOnTask` object types. All fields are combined with a logical ‘and.’ */
export type WorkOnTaskFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<WorkOnTaskFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<WorkOnTaskFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<WorkOnTaskFilter>>;
  /** Filter by the object’s `profileId` field. */
  profileId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `taskId` field. */
  taskId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `WorkOnTask` */
export type WorkOnTaskInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  profileId: Scalars['Int'];
  taskId: Scalars['Int'];
};

/** Represents an update to a `WorkOnTask`. Fields that are set will be updated. */
export type WorkOnTaskPatch = {
  active?: InputMaybe<Scalars['Boolean']>;
  profileId?: InputMaybe<Scalars['Int']>;
  taskId?: InputMaybe<Scalars['Int']>;
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

export type UserFragment = { __typename?: 'User', nodeId?: string | null, login?: string | null, role?: Role | null, id?: number | null, profile?: { __typename?: 'Profile', id: number, username: string, lastactive: string, color?: string | null, description: string, role?: Role | null, discordId?: string | null, nodeId: string } | null };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users?: { __typename?: 'UsersConnection', nodes: Array<{ __typename?: 'User', nodeId?: string | null, login?: string | null, role?: Role | null, id?: number | null, profile?: { __typename?: 'Profile', id: number, username: string, lastactive: string, color?: string | null, description: string, role?: Role | null, discordId?: string | null, nodeId: string } | null }> } | null };

export type CreateInvitationTokenMutationVariables = Exact<{
  role: Role;
}>;


export type CreateInvitationTokenMutation = { __typename?: 'Mutation', createInvitationLink?: { __typename?: 'CreateInvitationLinkPayload', invitationLinkResponse?: { __typename?: 'InvitationLinkResponse', token?: string | null } | null } | null };

export type CreateResetPasswordTokenMutationVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type CreateResetPasswordTokenMutation = { __typename?: 'Mutation', createResetPasswordLink?: { __typename?: 'CreateResetPasswordLinkPayload', resetPasswordLinkResponse?: { __typename?: 'ResetPasswordLinkResponse', token?: string | null } | null } | null };

export type DeleteUserByIdMutationVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type DeleteUserByIdMutation = { __typename?: 'Mutation', deleteUser?: { __typename?: 'DeleteUserPayload', userResponse?: { __typename?: 'UserResponse', id?: number | null, login?: string | null, role?: Role | null } | null } | null };

export type UpdateRoleForUserIdMutationVariables = Exact<{
  userId: Scalars['Int'];
  role: Role;
}>;


export type UpdateRoleForUserIdMutation = { __typename?: 'Mutation', updateUserRole?: { __typename?: 'UpdateUserRolePayload', role?: Role | null } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'Profile', id: number, username: string, lastactive: string, color?: string | null, description: string, role?: Role | null, discordId?: string | null, nodeId: string } | null };

export type NewTokenQueryVariables = Exact<{ [key: string]: never; }>;


export type NewTokenQuery = { __typename?: 'Query', newToken?: string | null };

export type ProfileTokenQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileTokenQuery = { __typename?: 'Query', profileToken?: string | null };

export type ResetProfileTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type ResetProfileTokenMutation = { __typename?: 'Mutation', resetProfileToken?: { __typename?: 'ResetProfileTokenPayload', string?: string | null } | null };

export type ResetDiscordIdMutationVariables = Exact<{ [key: string]: never; }>;


export type ResetDiscordIdMutation = { __typename?: 'Mutation', resetDiscordId?: { __typename?: 'ResetDiscordIdPayload', string?: string | null } | null };

export type LoginMutationVariables = Exact<{
  login: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'LoginPayload', jwt?: string | null } | null };

export type RegisterMutationVariables = Exact<{
  login: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register?: { __typename?: 'RegisterPayload', jwt?: string | null } | null };

export type RegisterWithTokenMutationVariables = Exact<{
  login: Scalars['String'];
  password: Scalars['String'];
  token: Scalars['String'];
}>;


export type RegisterWithTokenMutation = { __typename?: 'Mutation', registerWithToken?: { __typename?: 'RegisterWithTokenPayload', jwt?: string | null } | null };

export type RegisterWithPasswordMutationVariables = Exact<{
  login: Scalars['String'];
  password: Scalars['String'];
  ctfnotePassword: Scalars['String'];
}>;


export type RegisterWithPasswordMutation = { __typename?: 'Mutation', registerWithPassword?: { __typename?: 'RegisterWithPasswordPayload', jwt?: string | null } | null };

export type ResetPasswordMutationVariables = Exact<{
  password: Scalars['String'];
  token: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword?: { __typename?: 'ResetPasswordPayload', jwt?: string | null } | null };

export type CtfFragment = { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null };

export type FullCtfFragment = { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null, tasks: { __typename?: 'TasksConnection', nodes: Array<{ __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } }> }, secrets?: { __typename?: 'CtfSecret', nodeId: string, credentials?: string | null } | null, invitations: { __typename?: 'InvitationsConnection', nodes: Array<{ __typename?: 'Invitation', nodeId: string, ctfId: number, profileId: number }> } };

export type CtfsQueryVariables = Exact<{ [key: string]: never; }>;


export type CtfsQuery = { __typename?: 'Query', ctfs?: { __typename?: 'CtfsConnection', nodes: Array<{ __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null }> } | null };

export type SubscribeToCtfSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToCtfSubscription = { __typename?: 'Subscription', listen: { __typename?: 'ListenPayload', relatedNodeId?: string | null, relatedNode?: { __typename?: 'AssignedTag', nodeId: string } | { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null, tasks: { __typename?: 'TasksConnection', nodes: Array<{ __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } }> }, secrets?: { __typename?: 'CtfSecret', nodeId: string, credentials?: string | null } | null, invitations: { __typename?: 'InvitationsConnection', nodes: Array<{ __typename?: 'Invitation', nodeId: string, ctfId: number, profileId: number }> } } | { __typename?: 'CtfSecret', nodeId: string } | { __typename?: 'Invitation', nodeId: string } | { __typename?: 'Profile', nodeId: string } | { __typename?: 'Query', nodeId: string } | { __typename?: 'Setting', nodeId: string } | { __typename?: 'Tag', nodeId: string } | { __typename?: 'Task', nodeId: string } | { __typename?: 'WorkOnTask', nodeId: string } | null } };

export type GetFullCtfQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetFullCtfQuery = { __typename?: 'Query', ctf?: { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null, tasks: { __typename?: 'TasksConnection', nodes: Array<{ __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } }> }, secrets?: { __typename?: 'CtfSecret', nodeId: string, credentials?: string | null } | null, invitations: { __typename?: 'InvitationsConnection', nodes: Array<{ __typename?: 'Invitation', nodeId: string, ctfId: number, profileId: number }> } } | null };

export type IncomingCtfsQueryVariables = Exact<{ [key: string]: never; }>;


export type IncomingCtfsQuery = { __typename?: 'Query', incomingCtf?: { __typename?: 'CtfsConnection', nodes: Array<{ __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null }> } | null };

export type PastCtfsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type PastCtfsQuery = { __typename?: 'Query', pastCtf?: { __typename?: 'CtfsConnection', totalCount: number, nodes: Array<{ __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null }> } | null };

export type CreateCtfMutationVariables = Exact<{
  title: Scalars['String'];
  startTime: Scalars['Datetime'];
  endTime: Scalars['Datetime'];
  weight?: InputMaybe<Scalars['Float']>;
  ctfUrl?: InputMaybe<Scalars['String']>;
  ctftimeUrl?: InputMaybe<Scalars['String']>;
  logoUrl?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
}>;


export type CreateCtfMutation = { __typename?: 'Mutation', createCtf?: { __typename?: 'CreateCtfPayload', ctf?: { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null } | null } | null };

export type DeleteCtfbyIdMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteCtfbyIdMutation = { __typename?: 'Mutation', deleteCtf?: { __typename?: 'DeleteCtfPayload', deletedCtfNodeId?: string | null } | null };

export type ImportctfMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ImportctfMutation = { __typename?: 'Mutation', importCtf?: { __typename?: 'ImportCtfPayload', ctf?: { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null } | null } | null };

export type UpdateCtfByIdMutationVariables = Exact<{
  id: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
  weight?: InputMaybe<Scalars['Float']>;
  ctfUrl?: InputMaybe<Scalars['String']>;
  ctftimeUrl?: InputMaybe<Scalars['String']>;
  logoUrl?: InputMaybe<Scalars['String']>;
  startTime?: InputMaybe<Scalars['Datetime']>;
  endTime?: InputMaybe<Scalars['Datetime']>;
  description?: InputMaybe<Scalars['String']>;
}>;


export type UpdateCtfByIdMutation = { __typename?: 'Mutation', updateCtf?: { __typename?: 'UpdateCtfPayload', ctf?: { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null } | null } | null };

export type SetDiscordEventLinkMutationVariables = Exact<{
  id: Scalars['Int'];
  link: Scalars['String'];
}>;


export type SetDiscordEventLinkMutation = { __typename?: 'Mutation', setDiscordEventLink?: { __typename?: 'SetDiscordEventLinkPayload', clientMutationId?: string | null } | null };

export type SubscribeToCtfCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToCtfCreatedSubscription = { __typename?: 'Subscription', listen: { __typename?: 'ListenPayload', relatedNodeId?: string | null, relatedNode?: { __typename?: 'AssignedTag' } | { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null } | { __typename?: 'CtfSecret' } | { __typename?: 'Invitation' } | { __typename?: 'Profile' } | { __typename?: 'Query' } | { __typename?: 'Setting' } | { __typename?: 'Tag' } | { __typename?: 'Task' } | { __typename?: 'WorkOnTask' } | null } };

export type SubscribeToCtfDeletedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToCtfDeletedSubscription = { __typename?: 'Subscription', listen: { __typename?: 'ListenPayload', relatedNodeId?: string | null, relatedNode?: { __typename?: 'AssignedTag' } | { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null } | { __typename?: 'CtfSecret' } | { __typename?: 'Invitation' } | { __typename?: 'Profile' } | { __typename?: 'Query' } | { __typename?: 'Setting' } | { __typename?: 'Tag' } | { __typename?: 'Task' } | { __typename?: 'WorkOnTask' } | null } };

export type SubscribeToFlagSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToFlagSubscription = { __typename?: 'Subscription', listen: { __typename?: 'ListenPayload', relatedNodeId?: string | null, relatedNode?: { __typename?: 'AssignedTag' } | { __typename?: 'Ctf' } | { __typename?: 'CtfSecret' } | { __typename?: 'Invitation' } | { __typename?: 'Profile' } | { __typename?: 'Query' } | { __typename?: 'Setting' } | { __typename?: 'Tag' } | { __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } } | { __typename?: 'WorkOnTask' } | null } };

export type InvitationFragment = { __typename?: 'Invitation', nodeId: string, ctfId: number, profileId: number };

export type InviteUserToCtfMutationVariables = Exact<{
  ctfId: Scalars['Int'];
  profileId: Scalars['Int'];
}>;


export type InviteUserToCtfMutation = { __typename?: 'Mutation', createInvitation?: { __typename?: 'CreateInvitationPayload', invitation?: { __typename?: 'Invitation', nodeId: string, ctfId: number, profileId: number } | null } | null };

export type UninviteUserToCtfMutationVariables = Exact<{
  ctfId: Scalars['Int'];
  profileId: Scalars['Int'];
}>;


export type UninviteUserToCtfMutation = { __typename?: 'Mutation', deleteInvitation?: { __typename?: 'DeleteInvitationPayload', deletedInvitationNodeId?: string | null } | null };

export type PublicProfileFragment = { __typename?: 'PublicProfile', id?: number | null, username?: string | null, color?: string | null, description?: string | null, role?: Role | null, nodeId?: string | null };

export type ProfileFragment = { __typename?: 'Profile', id: number, username: string, lastactive: string, color?: string | null, description: string, role?: Role | null, discordId?: string | null, nodeId: string };

export type RestrictedProfileFragment = { __typename?: 'Profile', id: number, username: string, color?: string | null, description: string, role?: Role | null, nodeId: string };

export type UpdatePasswordMutationVariables = Exact<{
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type UpdatePasswordMutation = { __typename?: 'Mutation', changePassword?: { __typename?: 'ChangePasswordPayload', changePasswordResponse?: { __typename?: 'ChangePasswordResponse', ok?: boolean | null } | null } | null };

export type UpdateProfileMutationVariables = Exact<{
  id: Scalars['Int'];
  patch: ProfilePatch;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile?: { __typename?: 'UpdateProfilePayload', profile?: { __typename?: 'Profile', id: number, username: string, lastactive: string, color?: string | null, description: string, role?: Role | null, discordId?: string | null, nodeId: string } | null } | null };

export type GetTeamQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTeamQuery = { __typename?: 'Query', publicProfiles?: { __typename?: 'PublicProfilesConnection', nodes: Array<{ __typename?: 'PublicProfile', id?: number | null, username?: string | null, color?: string | null, description?: string | null, role?: Role | null, nodeId?: string | null }> } | null };

export type GetTeamAdminQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTeamAdminQuery = { __typename?: 'Query', profiles?: { __typename?: 'ProfilesConnection', nodes: Array<{ __typename?: 'Profile', id: number, username: string, lastactive: string, color?: string | null, description: string, role?: Role | null, discordId?: string | null, nodeId: string }> } | null };

export type PublicProfileSubscriptionPayloadSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type PublicProfileSubscriptionPayloadSubscription = { __typename?: 'Subscription', currentProfileUpdated?: { __typename?: 'PublicProfileSubscriptionPayload', publicProfile?: { __typename?: 'PublicProfile', id?: number | null, username?: string | null, color?: string | null, description?: string | null, role?: Role | null, nodeId?: string | null } | null } | null };

export type SubscribeToProfileSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToProfileSubscription = { __typename?: 'Subscription', listen: { __typename?: 'ListenPayload', relatedNode?: { __typename?: 'AssignedTag', nodeId: string } | { __typename?: 'Ctf', nodeId: string } | { __typename?: 'CtfSecret', nodeId: string } | { __typename?: 'Invitation', nodeId: string } | { __typename?: 'Profile', nodeId: string, id: number, username: string, lastactive: string, color?: string | null, description: string, role?: Role | null, discordId?: string | null } | { __typename?: 'Query', nodeId: string } | { __typename?: 'Setting', nodeId: string } | { __typename?: 'Tag', nodeId: string } | { __typename?: 'Task', nodeId: string } | { __typename?: 'WorkOnTask', nodeId: string } | null } };

export type SubscribeToProfileCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToProfileCreatedSubscription = { __typename?: 'Subscription', listen: { __typename?: 'ListenPayload', relatedNodeId?: string | null, relatedNode?: { __typename?: 'AssignedTag', nodeId: string } | { __typename?: 'Ctf', nodeId: string } | { __typename?: 'CtfSecret', nodeId: string } | { __typename?: 'Invitation', nodeId: string } | { __typename?: 'Profile', nodeId: string, id: number, username: string, lastactive: string, color?: string | null, description: string, role?: Role | null, discordId?: string | null } | { __typename?: 'Query', nodeId: string } | { __typename?: 'Setting', nodeId: string } | { __typename?: 'Tag', nodeId: string } | { __typename?: 'Task', nodeId: string } | { __typename?: 'WorkOnTask', nodeId: string } | null } };

export type SubscribeToProfileDeletedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToProfileDeletedSubscription = { __typename?: 'Subscription', listen: { __typename?: 'ListenPayload', relatedNodeId?: string | null, relatedNode?: { __typename?: 'AssignedTag', nodeId: string } | { __typename?: 'Ctf', nodeId: string } | { __typename?: 'CtfSecret', nodeId: string } | { __typename?: 'Invitation', nodeId: string } | { __typename?: 'Profile', nodeId: string, id: number, username: string, lastactive: string, color?: string | null, description: string, role?: Role | null, discordId?: string | null } | { __typename?: 'Query', nodeId: string } | { __typename?: 'Setting', nodeId: string } | { __typename?: 'Tag', nodeId: string } | { __typename?: 'Task', nodeId: string } | { __typename?: 'WorkOnTask', nodeId: string } | null } };

export type SearchCtFsQueryVariables = Exact<{
  search: Scalars['String'];
}>;


export type SearchCtFsQuery = { __typename?: 'Query', ctfs?: { __typename?: 'CtfsConnection', nodes: Array<{ __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null }> } | null };

export type SearchTasksQueryVariables = Exact<{
  search: Scalars['String'];
}>;


export type SearchTasksQuery = { __typename?: 'Query', tasks?: { __typename?: 'TasksConnection', nodes: Array<{ __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, ctf?: { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null } | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } }> } | null };

export type SearchTagsQueryVariables = Exact<{
  search: Scalars['String'];
}>;


export type SearchTagsQuery = { __typename?: 'Query', tags?: { __typename?: 'TagsConnection', nodes: Array<{ __typename?: 'Tag', tasksByAssignedTagTagIdAndTaskId: { __typename?: 'TagTasksByAssignedTagTagIdAndTaskIdManyToManyConnection', nodes: Array<{ __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, ctf?: { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null } | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } }> } }> } | null };

export type SearchAllQueryVariables = Exact<{
  search: Scalars['String'];
}>;


export type SearchAllQuery = { __typename?: 'Query', tags?: { __typename?: 'TagsConnection', nodes: Array<{ __typename?: 'Tag', tasksByAssignedTagTagIdAndTaskId: { __typename?: 'TagTasksByAssignedTagTagIdAndTaskIdManyToManyConnection', nodes: Array<{ __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, ctf?: { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null } | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } }> } }> } | null, tasks?: { __typename?: 'TasksConnection', nodes: Array<{ __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, ctf?: { __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null } | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } }> } | null, ctfs?: { __typename?: 'CtfsConnection', nodes: Array<{ __typename?: 'Ctf', nodeId: string, id: number, granted?: boolean | null, ctfUrl?: string | null, ctftimeUrl?: string | null, description: string, endTime: string, logoUrl?: string | null, startTime: string, weight: number, title: string, discordEventLink?: string | null }> } | null };

export type CtfSecretFragment = { __typename?: 'CtfSecret', nodeId: string, credentials?: string | null };

export type GetCredentialsForCtfIdQueryVariables = Exact<{
  ctfId: Scalars['Int'];
}>;


export type GetCredentialsForCtfIdQuery = { __typename?: 'Query', ctfSecret?: { __typename?: 'CtfSecret', nodeId: string, credentials?: string | null } | null };

export type UpdateCredentialsForCtfIdMutationVariables = Exact<{
  ctfId: Scalars['Int'];
  credentials?: InputMaybe<Scalars['String']>;
}>;


export type UpdateCredentialsForCtfIdMutation = { __typename?: 'Mutation', updateCtfSecret?: { __typename?: 'UpdateCtfSecretPayload', ctfSecret?: { __typename?: 'CtfSecret', nodeId: string, credentials?: string | null } | null } | null };

export type SettingsInfoFragment = { __typename?: 'Setting', nodeId: string, registrationAllowed: boolean, registrationPasswordAllowed: boolean, style: string, discordIntegrationEnabled: boolean };

export type AdminSettingsInfoFragment = { __typename?: 'Setting', nodeId: string, registrationPassword: string, registrationDefaultRole: Role, icalPassword?: string | null, registrationAllowed: boolean, registrationPasswordAllowed: boolean, style: string, discordIntegrationEnabled: boolean };

export type GetSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSettingsQuery = { __typename?: 'Query', settings?: { __typename?: 'SettingsConnection', nodes: Array<{ __typename?: 'Setting', nodeId: string, registrationAllowed: boolean, registrationPasswordAllowed: boolean, style: string, discordIntegrationEnabled: boolean }> } | null };

export type GetIcalPasswordQueryVariables = Exact<{ [key: string]: never; }>;


export type GetIcalPasswordQuery = { __typename?: 'Query', settings?: { __typename?: 'SettingsConnection', nodes: Array<{ __typename?: 'Setting', nodeId: string, icalPassword?: string | null }> } | null };

export type GetAdminSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminSettingsQuery = { __typename?: 'Query', settings?: { __typename?: 'SettingsConnection', nodes: Array<{ __typename?: 'Setting', nodeId: string, registrationPassword: string, registrationDefaultRole: Role, icalPassword?: string | null, registrationAllowed: boolean, registrationPasswordAllowed: boolean, style: string, discordIntegrationEnabled: boolean }> } | null };

export type UpdateSettingsMutationVariables = Exact<{
  nodeId: Scalars['ID'];
  patch: SettingPatch;
}>;


export type UpdateSettingsMutation = { __typename?: 'Mutation', updateSettingByNodeId?: { __typename?: 'UpdateSettingPayload', setting?: { __typename?: 'Setting', nodeId: string, registrationPassword: string, registrationDefaultRole: Role, icalPassword?: string | null, registrationAllowed: boolean, registrationPasswordAllowed: boolean, style: string, discordIntegrationEnabled: boolean } | null } | null };

export type TagFragment = { __typename?: 'Tag', nodeId: string, id: number, tag: string };

export type GetTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTagsQuery = { __typename?: 'Query', tags?: { __typename?: 'TagsConnection', nodes: Array<{ __typename?: 'Tag', nodeId: string, id: number, tag: string }> } | null };

export type GetTagByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetTagByIdQuery = { __typename?: 'Query', tag?: { __typename?: 'Tag', tag: string, id: number } | null };

export type AssignedTagsFragment = { __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null };

export type TaskForTagsFragementFragment = { __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, task?: { __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } } | null };

export type AddTagsForTaskMutationVariables = Exact<{
  tags?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  taskId: Scalars['Int'];
}>;


export type AddTagsForTaskMutation = { __typename?: 'Mutation', addTagsForTask?: { __typename?: 'AddTagsForTaskPayload', clientMutationId?: string | null } | null };

export type SubscribeToTagSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToTagSubscription = { __typename?: 'Subscription', listen: { __typename?: 'ListenPayload', relatedNodeId?: string | null, relatedNode?: { __typename?: 'AssignedTag', nodeId: string } | { __typename?: 'Ctf', nodeId: string } | { __typename?: 'CtfSecret', nodeId: string } | { __typename?: 'Invitation', nodeId: string } | { __typename?: 'Profile', nodeId: string } | { __typename?: 'Query', nodeId: string } | { __typename?: 'Setting', nodeId: string } | { __typename?: 'Tag', nodeId: string, id: number, tag: string } | { __typename?: 'Task', nodeId: string } | { __typename?: 'WorkOnTask', nodeId: string } | null } };

export type SubscribeToTagCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToTagCreatedSubscription = { __typename?: 'Subscription', listen: { __typename?: 'ListenPayload', relatedNodeId?: string | null, relatedNode?: { __typename?: 'AssignedTag', nodeId: string } | { __typename?: 'Ctf', nodeId: string } | { __typename?: 'CtfSecret', nodeId: string } | { __typename?: 'Invitation', nodeId: string } | { __typename?: 'Profile', nodeId: string } | { __typename?: 'Query', nodeId: string } | { __typename?: 'Setting', nodeId: string } | { __typename?: 'Tag', nodeId: string, id: number, tag: string } | { __typename?: 'Task', nodeId: string } | { __typename?: 'WorkOnTask', nodeId: string } | null } };

export type SubscribeToTagDeletedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToTagDeletedSubscription = { __typename?: 'Subscription', listen: { __typename?: 'ListenPayload', relatedNodeId?: string | null, relatedNode?: { __typename?: 'AssignedTag', nodeId: string } | { __typename?: 'Ctf', nodeId: string } | { __typename?: 'CtfSecret', nodeId: string } | { __typename?: 'Invitation', nodeId: string } | { __typename?: 'Profile', nodeId: string } | { __typename?: 'Query', nodeId: string } | { __typename?: 'Setting', nodeId: string } | { __typename?: 'Tag', nodeId: string, id: number, tag: string } | { __typename?: 'Task', nodeId: string } | { __typename?: 'WorkOnTask', nodeId: string } | null } };

export type WorkingOnFragment = { __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number };

export type TaskFragment = { __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } };

export type GetTasksForCtfIdQueryVariables = Exact<{
  ctfId: Scalars['Int'];
}>;


export type GetTasksForCtfIdQuery = { __typename?: 'Query', tasks?: { __typename?: 'TasksConnection', nodes: Array<{ __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } }> } | null };

export type TaskByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type TaskByIdQuery = { __typename?: 'Query', task?: { __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } } | null };

export type UpdateTaskMutationVariables = Exact<{
  id: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  flag?: InputMaybe<Scalars['String']>;
}>;


export type UpdateTaskMutation = { __typename?: 'Mutation', updateTask?: { __typename?: 'UpdateTaskPayload', task?: { __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } } | null } | null };

export type CreateTaskForCtfIdMutationVariables = Exact<{
  ctfId: Scalars['Int'];
  title: Scalars['String'];
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  description?: InputMaybe<Scalars['String']>;
  flag?: InputMaybe<Scalars['String']>;
}>;


export type CreateTaskForCtfIdMutation = { __typename?: 'Mutation', createTask?: { __typename?: 'CreateTaskPayload', task?: { __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } } | null } | null };

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteTaskMutation = { __typename?: 'Mutation', deleteTask?: { __typename?: 'DeleteTaskPayload', deletedTaskNodeId?: string | null } | null };

export type StartWorkingOnMutationVariables = Exact<{
  taskId: Scalars['Int'];
}>;


export type StartWorkingOnMutation = { __typename?: 'Mutation', startWorkingOn?: { __typename?: 'StartWorkingOnPayload', task?: { __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } } | null } | null };

export type StopWorkingOnMutationVariables = Exact<{
  taskId: Scalars['Int'];
}>;


export type StopWorkingOnMutation = { __typename?: 'Mutation', stopWorkingOn?: { __typename?: 'StopWorkingOnPayload', task?: { __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } } | null } | null };

export type CancelWorkingOnMutationVariables = Exact<{
  taskId: Scalars['Int'];
}>;


export type CancelWorkingOnMutation = { __typename?: 'Mutation', cancelWorkingOn?: { __typename?: 'CancelWorkingOnPayload', task?: { __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } } | null } | null };

export type SubscribeToTaskSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToTaskSubscription = { __typename?: 'Subscription', listen: { __typename?: 'ListenPayload', relatedNode?: { __typename?: 'AssignedTag', nodeId: string } | { __typename?: 'Ctf', nodeId: string } | { __typename?: 'CtfSecret', nodeId: string } | { __typename?: 'Invitation', nodeId: string } | { __typename?: 'Profile', nodeId: string } | { __typename?: 'Query', nodeId: string } | { __typename?: 'Setting', nodeId: string } | { __typename?: 'Tag', nodeId: string } | { __typename?: 'Task', nodeId: string, id: number, title: string, ctfId: number, padUrl: string, description: string, flag: string, solved?: boolean | null, assignedTags: { __typename?: 'AssignedTagsConnection', nodes: Array<{ __typename?: 'AssignedTag', nodeId: string, taskId: number, tagId: number, tag?: { __typename?: 'Tag', nodeId: string, id: number, tag: string } | null }> }, workOnTasks: { __typename?: 'WorkOnTasksConnection', nodes: Array<{ __typename?: 'WorkOnTask', nodeId: string, profileId: number, active: boolean, taskId: number }> } } | { __typename?: 'WorkOnTask', nodeId: string } | null } };

export type UploadLogoMutationVariables = Exact<{
  logo: Scalars['Upload'];
}>;


export type UploadLogoMutation = { __typename?: 'Mutation', uploadCtfLogo: string };

export const ProfileFragmentDoc = gql`
    fragment ProfileFragment on Profile {
  id
  username
  lastactive
  color
  description
  role
  discordId
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
  discordEventLink
}
    `;
export const TagFragmentDoc = gql`
    fragment TagFragment on Tag {
  nodeId
  id
  tag
}
    `;
export const AssignedTagsFragmentDoc = gql`
    fragment AssignedTagsFragment on AssignedTag {
  nodeId
  taskId
  tagId
  tag {
    ...TagFragment
  }
}
    ${TagFragmentDoc}`;
export const WorkingOnFragmentDoc = gql`
    fragment WorkingOnFragment on WorkOnTask {
  nodeId
  profileId
  active
  taskId
}
    `;
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
  assignedTags {
    nodes {
      ...AssignedTagsFragment
    }
  }
  workOnTasks {
    nodes {
      ...WorkingOnFragment
    }
  }
}
    ${AssignedTagsFragmentDoc}
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
export const PublicProfileFragmentDoc = gql`
    fragment PublicProfileFragment on PublicProfile {
  id
  username
  color
  description
  role
  nodeId
}
    `;
export const RestrictedProfileFragmentDoc = gql`
    fragment RestrictedProfile on Profile {
  id
  username
  color
  description
  role
  nodeId
}
    `;
export const SettingsInfoFragmentDoc = gql`
    fragment SettingsInfo on Setting {
  nodeId
  registrationAllowed
  registrationPasswordAllowed
  style
  discordIntegrationEnabled
}
    `;
export const AdminSettingsInfoFragmentDoc = gql`
    fragment AdminSettingsInfo on Setting {
  nodeId
  ...SettingsInfo
  registrationPassword
  registrationDefaultRole
  icalPassword
}
    ${SettingsInfoFragmentDoc}`;
export const TaskForTagsFragementFragmentDoc = gql`
    fragment TaskForTagsFragement on AssignedTag {
  nodeId
  taskId
  tagId
  task {
    ...TaskFragment
  }
}
    ${TaskFragmentDoc}`;
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
export function useGetUsersLazyQuery(options: VueApolloComposable.UseQueryOptions<GetUsersQuery, GetUsersQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetUsersQuery, GetUsersQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetUsersQuery, GetUsersQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, {}, options);
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
export function useCreateInvitationTokenMutation(options: VueApolloComposable.UseMutationOptions<CreateInvitationTokenMutation, CreateInvitationTokenMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateInvitationTokenMutation, CreateInvitationTokenMutationVariables>> = {}) {
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
export function useCreateResetPasswordTokenMutation(options: VueApolloComposable.UseMutationOptions<CreateResetPasswordTokenMutation, CreateResetPasswordTokenMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateResetPasswordTokenMutation, CreateResetPasswordTokenMutationVariables>> = {}) {
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
export function useDeleteUserByIdMutation(options: VueApolloComposable.UseMutationOptions<DeleteUserByIdMutation, DeleteUserByIdMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteUserByIdMutation, DeleteUserByIdMutationVariables>> = {}) {
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
export function useUpdateRoleForUserIdMutation(options: VueApolloComposable.UseMutationOptions<UpdateRoleForUserIdMutation, UpdateRoleForUserIdMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateRoleForUserIdMutation, UpdateRoleForUserIdMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdateRoleForUserIdMutation, UpdateRoleForUserIdMutationVariables>(UpdateRoleForUserIdDocument, options);
}
export type UpdateRoleForUserIdMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateRoleForUserIdMutation, UpdateRoleForUserIdMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...ProfileFragment
  }
}
    ${ProfileFragmentDoc}`;

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
export function useMeLazyQuery(options: VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, {}, options);
}
export type MeQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<MeQuery, MeQueryVariables>;
export const NewTokenDocument = gql`
    query newToken {
  newToken
}
    `;

/**
 * __useNewTokenQuery__
 *
 * To run a query within a Vue component, call `useNewTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewTokenQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useNewTokenQuery();
 */
export function useNewTokenQuery(options: VueApolloComposable.UseQueryOptions<NewTokenQuery, NewTokenQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<NewTokenQuery, NewTokenQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<NewTokenQuery, NewTokenQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<NewTokenQuery, NewTokenQueryVariables>(NewTokenDocument, {}, options);
}
export function useNewTokenLazyQuery(options: VueApolloComposable.UseQueryOptions<NewTokenQuery, NewTokenQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<NewTokenQuery, NewTokenQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<NewTokenQuery, NewTokenQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<NewTokenQuery, NewTokenQueryVariables>(NewTokenDocument, {}, options);
}
export type NewTokenQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<NewTokenQuery, NewTokenQueryVariables>;
export const ProfileTokenDocument = gql`
    query profileToken {
  profileToken
}
    `;

/**
 * __useProfileTokenQuery__
 *
 * To run a query within a Vue component, call `useProfileTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileTokenQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useProfileTokenQuery();
 */
export function useProfileTokenQuery(options: VueApolloComposable.UseQueryOptions<ProfileTokenQuery, ProfileTokenQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<ProfileTokenQuery, ProfileTokenQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<ProfileTokenQuery, ProfileTokenQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<ProfileTokenQuery, ProfileTokenQueryVariables>(ProfileTokenDocument, {}, options);
}
export function useProfileTokenLazyQuery(options: VueApolloComposable.UseQueryOptions<ProfileTokenQuery, ProfileTokenQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<ProfileTokenQuery, ProfileTokenQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<ProfileTokenQuery, ProfileTokenQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<ProfileTokenQuery, ProfileTokenQueryVariables>(ProfileTokenDocument, {}, options);
}
export type ProfileTokenQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<ProfileTokenQuery, ProfileTokenQueryVariables>;
export const ResetProfileTokenDocument = gql`
    mutation resetProfileToken {
  resetProfileToken(input: {}) {
    string
  }
}
    `;

/**
 * __useResetProfileTokenMutation__
 *
 * To run a mutation, you first call `useResetProfileTokenMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useResetProfileTokenMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useResetProfileTokenMutation();
 */
export function useResetProfileTokenMutation(options: VueApolloComposable.UseMutationOptions<ResetProfileTokenMutation, ResetProfileTokenMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<ResetProfileTokenMutation, ResetProfileTokenMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<ResetProfileTokenMutation, ResetProfileTokenMutationVariables>(ResetProfileTokenDocument, options);
}
export type ResetProfileTokenMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<ResetProfileTokenMutation, ResetProfileTokenMutationVariables>;
export const ResetDiscordIdDocument = gql`
    mutation resetDiscordId {
  resetDiscordId(input: {}) {
    string
  }
}
    `;

/**
 * __useResetDiscordIdMutation__
 *
 * To run a mutation, you first call `useResetDiscordIdMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useResetDiscordIdMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useResetDiscordIdMutation();
 */
export function useResetDiscordIdMutation(options: VueApolloComposable.UseMutationOptions<ResetDiscordIdMutation, ResetDiscordIdMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<ResetDiscordIdMutation, ResetDiscordIdMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<ResetDiscordIdMutation, ResetDiscordIdMutationVariables>(ResetDiscordIdDocument, options);
}
export type ResetDiscordIdMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<ResetDiscordIdMutation, ResetDiscordIdMutationVariables>;
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
export function useLoginMutation(options: VueApolloComposable.UseMutationOptions<LoginMutation, LoginMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<LoginMutation, LoginMutationVariables>> = {}) {
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
export function useRegisterMutation(options: VueApolloComposable.UseMutationOptions<RegisterMutation, RegisterMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RegisterMutation, RegisterMutationVariables>> = {}) {
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
export function useRegisterWithTokenMutation(options: VueApolloComposable.UseMutationOptions<RegisterWithTokenMutation, RegisterWithTokenMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RegisterWithTokenMutation, RegisterWithTokenMutationVariables>> = {}) {
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
export function useRegisterWithPasswordMutation(options: VueApolloComposable.UseMutationOptions<RegisterWithPasswordMutation, RegisterWithPasswordMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RegisterWithPasswordMutation, RegisterWithPasswordMutationVariables>> = {}) {
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
export function useResetPasswordMutation(options: VueApolloComposable.UseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>> = {}) {
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
export function useCtfsLazyQuery(options: VueApolloComposable.UseQueryOptions<CtfsQuery, CtfsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<CtfsQuery, CtfsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<CtfsQuery, CtfsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<CtfsQuery, CtfsQueryVariables>(CtfsDocument, {}, options);
}
export type CtfsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<CtfsQuery, CtfsQueryVariables>;
export const SubscribeToCtfDocument = gql`
    subscription subscribeToCtf {
  listen(topic: "update:ctfs") {
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
 * __useSubscribeToCtfSubscription__
 *
 * To run a query within a Vue component, call `useSubscribeToCtfSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToCtfSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useSubscribeToCtfSubscription();
 */
export function useSubscribeToCtfSubscription(options: VueApolloComposable.UseSubscriptionOptions<SubscribeToCtfSubscription, SubscribeToCtfSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<SubscribeToCtfSubscription, SubscribeToCtfSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<SubscribeToCtfSubscription, SubscribeToCtfSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<SubscribeToCtfSubscription, SubscribeToCtfSubscriptionVariables>(SubscribeToCtfDocument, {}, options);
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
export function useGetFullCtfLazyQuery(variables: GetFullCtfQueryVariables | VueCompositionApi.Ref<GetFullCtfQueryVariables> | ReactiveFunction<GetFullCtfQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetFullCtfQuery, GetFullCtfQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetFullCtfQuery, GetFullCtfQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetFullCtfQuery, GetFullCtfQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetFullCtfQuery, GetFullCtfQueryVariables>(GetFullCtfDocument, variables, options);
}
export type GetFullCtfQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetFullCtfQuery, GetFullCtfQueryVariables>;
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
export function useIncomingCtfsLazyQuery(options: VueApolloComposable.UseQueryOptions<IncomingCtfsQuery, IncomingCtfsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<IncomingCtfsQuery, IncomingCtfsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<IncomingCtfsQuery, IncomingCtfsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<IncomingCtfsQuery, IncomingCtfsQueryVariables>(IncomingCtfsDocument, {}, options);
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
export function usePastCtfsLazyQuery(variables: PastCtfsQueryVariables | VueCompositionApi.Ref<PastCtfsQueryVariables> | ReactiveFunction<PastCtfsQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<PastCtfsQuery, PastCtfsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<PastCtfsQuery, PastCtfsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<PastCtfsQuery, PastCtfsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<PastCtfsQuery, PastCtfsQueryVariables>(PastCtfsDocument, variables, options);
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
export function useCreateCtfMutation(options: VueApolloComposable.UseMutationOptions<CreateCtfMutation, CreateCtfMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateCtfMutation, CreateCtfMutationVariables>> = {}) {
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
export function useDeleteCtfbyIdMutation(options: VueApolloComposable.UseMutationOptions<DeleteCtfbyIdMutation, DeleteCtfbyIdMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteCtfbyIdMutation, DeleteCtfbyIdMutationVariables>> = {}) {
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
export function useImportctfMutation(options: VueApolloComposable.UseMutationOptions<ImportctfMutation, ImportctfMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<ImportctfMutation, ImportctfMutationVariables>> = {}) {
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
export function useUpdateCtfByIdMutation(options: VueApolloComposable.UseMutationOptions<UpdateCtfByIdMutation, UpdateCtfByIdMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateCtfByIdMutation, UpdateCtfByIdMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdateCtfByIdMutation, UpdateCtfByIdMutationVariables>(UpdateCtfByIdDocument, options);
}
export type UpdateCtfByIdMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateCtfByIdMutation, UpdateCtfByIdMutationVariables>;
export const SetDiscordEventLinkDocument = gql`
    mutation setDiscordEventLink($id: Int!, $link: String!) {
  setDiscordEventLink(input: {ctfId: $id, link: $link}) {
    clientMutationId
  }
}
    `;

/**
 * __useSetDiscordEventLinkMutation__
 *
 * To run a mutation, you first call `useSetDiscordEventLinkMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useSetDiscordEventLinkMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useSetDiscordEventLinkMutation({
 *   variables: {
 *     id: // value for 'id'
 *     link: // value for 'link'
 *   },
 * });
 */
export function useSetDiscordEventLinkMutation(options: VueApolloComposable.UseMutationOptions<SetDiscordEventLinkMutation, SetDiscordEventLinkMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<SetDiscordEventLinkMutation, SetDiscordEventLinkMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<SetDiscordEventLinkMutation, SetDiscordEventLinkMutationVariables>(SetDiscordEventLinkDocument, options);
}
export type SetDiscordEventLinkMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<SetDiscordEventLinkMutation, SetDiscordEventLinkMutationVariables>;
export const SubscribeToCtfCreatedDocument = gql`
    subscription subscribeToCtfCreated {
  listen(topic: "created:ctfs") {
    relatedNodeId
    relatedNode {
      ... on Ctf {
        ...CtfFragment
      }
    }
  }
}
    ${CtfFragmentDoc}`;

/**
 * __useSubscribeToCtfCreatedSubscription__
 *
 * To run a query within a Vue component, call `useSubscribeToCtfCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToCtfCreatedSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useSubscribeToCtfCreatedSubscription();
 */
export function useSubscribeToCtfCreatedSubscription(options: VueApolloComposable.UseSubscriptionOptions<SubscribeToCtfCreatedSubscription, SubscribeToCtfCreatedSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<SubscribeToCtfCreatedSubscription, SubscribeToCtfCreatedSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<SubscribeToCtfCreatedSubscription, SubscribeToCtfCreatedSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<SubscribeToCtfCreatedSubscription, SubscribeToCtfCreatedSubscriptionVariables>(SubscribeToCtfCreatedDocument, {}, options);
}
export type SubscribeToCtfCreatedSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<SubscribeToCtfCreatedSubscription, SubscribeToCtfCreatedSubscriptionVariables>;
export const SubscribeToCtfDeletedDocument = gql`
    subscription subscribeToCtfDeleted {
  listen(topic: "deleted:ctfs") {
    relatedNodeId
    relatedNode {
      ... on Ctf {
        ...CtfFragment
      }
    }
  }
}
    ${CtfFragmentDoc}`;

/**
 * __useSubscribeToCtfDeletedSubscription__
 *
 * To run a query within a Vue component, call `useSubscribeToCtfDeletedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToCtfDeletedSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useSubscribeToCtfDeletedSubscription();
 */
export function useSubscribeToCtfDeletedSubscription(options: VueApolloComposable.UseSubscriptionOptions<SubscribeToCtfDeletedSubscription, SubscribeToCtfDeletedSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<SubscribeToCtfDeletedSubscription, SubscribeToCtfDeletedSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<SubscribeToCtfDeletedSubscription, SubscribeToCtfDeletedSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<SubscribeToCtfDeletedSubscription, SubscribeToCtfDeletedSubscriptionVariables>(SubscribeToCtfDeletedDocument, {}, options);
}
export type SubscribeToCtfDeletedSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<SubscribeToCtfDeletedSubscription, SubscribeToCtfDeletedSubscriptionVariables>;
export const SubscribeToFlagDocument = gql`
    subscription subscribeToFlag {
  listen(topic: "task-solved:tasks") {
    relatedNodeId
    relatedNode {
      ... on Task {
        ...TaskFragment
      }
    }
  }
}
    ${TaskFragmentDoc}`;

/**
 * __useSubscribeToFlagSubscription__
 *
 * To run a query within a Vue component, call `useSubscribeToFlagSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToFlagSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useSubscribeToFlagSubscription();
 */
export function useSubscribeToFlagSubscription(options: VueApolloComposable.UseSubscriptionOptions<SubscribeToFlagSubscription, SubscribeToFlagSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<SubscribeToFlagSubscription, SubscribeToFlagSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<SubscribeToFlagSubscription, SubscribeToFlagSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<SubscribeToFlagSubscription, SubscribeToFlagSubscriptionVariables>(SubscribeToFlagDocument, {}, options);
}
export type SubscribeToFlagSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<SubscribeToFlagSubscription, SubscribeToFlagSubscriptionVariables>;
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
export function useInviteUserToCtfMutation(options: VueApolloComposable.UseMutationOptions<InviteUserToCtfMutation, InviteUserToCtfMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<InviteUserToCtfMutation, InviteUserToCtfMutationVariables>> = {}) {
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
export function useUninviteUserToCtfMutation(options: VueApolloComposable.UseMutationOptions<UninviteUserToCtfMutation, UninviteUserToCtfMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UninviteUserToCtfMutation, UninviteUserToCtfMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UninviteUserToCtfMutation, UninviteUserToCtfMutationVariables>(UninviteUserToCtfDocument, options);
}
export type UninviteUserToCtfMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UninviteUserToCtfMutation, UninviteUserToCtfMutationVariables>;
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
export function useUpdatePasswordMutation(options: VueApolloComposable.UseMutationOptions<UpdatePasswordMutation, UpdatePasswordMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdatePasswordMutation, UpdatePasswordMutationVariables>> = {}) {
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
export function useUpdateProfileMutation(options: VueApolloComposable.UseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, options);
}
export type UpdateProfileMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const GetTeamDocument = gql`
    query getTeam {
  publicProfiles {
    nodes {
      ...PublicProfileFragment
    }
  }
}
    ${PublicProfileFragmentDoc}`;

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
export function useGetTeamLazyQuery(options: VueApolloComposable.UseQueryOptions<GetTeamQuery, GetTeamQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTeamQuery, GetTeamQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTeamQuery, GetTeamQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetTeamQuery, GetTeamQueryVariables>(GetTeamDocument, {}, options);
}
export type GetTeamQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetTeamQuery, GetTeamQueryVariables>;
export const GetTeamAdminDocument = gql`
    query getTeamAdmin {
  profiles {
    nodes {
      ...ProfileFragment
    }
  }
}
    ${ProfileFragmentDoc}`;

/**
 * __useGetTeamAdminQuery__
 *
 * To run a query within a Vue component, call `useGetTeamAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamAdminQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetTeamAdminQuery();
 */
export function useGetTeamAdminQuery(options: VueApolloComposable.UseQueryOptions<GetTeamAdminQuery, GetTeamAdminQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTeamAdminQuery, GetTeamAdminQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTeamAdminQuery, GetTeamAdminQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetTeamAdminQuery, GetTeamAdminQueryVariables>(GetTeamAdminDocument, {}, options);
}
export function useGetTeamAdminLazyQuery(options: VueApolloComposable.UseQueryOptions<GetTeamAdminQuery, GetTeamAdminQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTeamAdminQuery, GetTeamAdminQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTeamAdminQuery, GetTeamAdminQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetTeamAdminQuery, GetTeamAdminQueryVariables>(GetTeamAdminDocument, {}, options);
}
export type GetTeamAdminQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetTeamAdminQuery, GetTeamAdminQueryVariables>;
export const PublicProfileSubscriptionPayloadDocument = gql`
    subscription PublicProfileSubscriptionPayload {
  currentProfileUpdated {
    publicProfile {
      ...PublicProfileFragment
    }
  }
}
    ${PublicProfileFragmentDoc}`;

/**
 * __usePublicProfileSubscriptionPayload__
 *
 * To run a query within a Vue component, call `usePublicProfileSubscriptionPayload` and pass it any options that fit your needs.
 * When your component renders, `usePublicProfileSubscriptionPayload` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = usePublicProfileSubscriptionPayload();
 */
export function usePublicProfileSubscriptionPayload(options: VueApolloComposable.UseSubscriptionOptions<PublicProfileSubscriptionPayloadSubscription, PublicProfileSubscriptionPayloadSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<PublicProfileSubscriptionPayloadSubscription, PublicProfileSubscriptionPayloadSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<PublicProfileSubscriptionPayloadSubscription, PublicProfileSubscriptionPayloadSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<PublicProfileSubscriptionPayloadSubscription, PublicProfileSubscriptionPayloadSubscriptionVariables>(PublicProfileSubscriptionPayloadDocument, {}, options);
}
export type PublicProfileSubscriptionPayloadCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<PublicProfileSubscriptionPayloadSubscription, PublicProfileSubscriptionPayloadSubscriptionVariables>;
export const SubscribeToProfileDocument = gql`
    subscription subscribeToProfile {
  listen(topic: "update:profiles") {
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
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useSubscribeToProfileSubscription();
 */
export function useSubscribeToProfileSubscription(options: VueApolloComposable.UseSubscriptionOptions<SubscribeToProfileSubscription, SubscribeToProfileSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<SubscribeToProfileSubscription, SubscribeToProfileSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<SubscribeToProfileSubscription, SubscribeToProfileSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<SubscribeToProfileSubscription, SubscribeToProfileSubscriptionVariables>(SubscribeToProfileDocument, {}, options);
}
export type SubscribeToProfileSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<SubscribeToProfileSubscription, SubscribeToProfileSubscriptionVariables>;
export const SubscribeToProfileCreatedDocument = gql`
    subscription subscribeToProfileCreated {
  listen(topic: "created:profiles") {
    relatedNodeId
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
 * __useSubscribeToProfileCreatedSubscription__
 *
 * To run a query within a Vue component, call `useSubscribeToProfileCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToProfileCreatedSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useSubscribeToProfileCreatedSubscription();
 */
export function useSubscribeToProfileCreatedSubscription(options: VueApolloComposable.UseSubscriptionOptions<SubscribeToProfileCreatedSubscription, SubscribeToProfileCreatedSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<SubscribeToProfileCreatedSubscription, SubscribeToProfileCreatedSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<SubscribeToProfileCreatedSubscription, SubscribeToProfileCreatedSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<SubscribeToProfileCreatedSubscription, SubscribeToProfileCreatedSubscriptionVariables>(SubscribeToProfileCreatedDocument, {}, options);
}
export type SubscribeToProfileCreatedSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<SubscribeToProfileCreatedSubscription, SubscribeToProfileCreatedSubscriptionVariables>;
export const SubscribeToProfileDeletedDocument = gql`
    subscription subscribeToProfileDeleted {
  listen(topic: "deleted:profiles") {
    relatedNodeId
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
 * __useSubscribeToProfileDeletedSubscription__
 *
 * To run a query within a Vue component, call `useSubscribeToProfileDeletedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToProfileDeletedSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useSubscribeToProfileDeletedSubscription();
 */
export function useSubscribeToProfileDeletedSubscription(options: VueApolloComposable.UseSubscriptionOptions<SubscribeToProfileDeletedSubscription, SubscribeToProfileDeletedSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<SubscribeToProfileDeletedSubscription, SubscribeToProfileDeletedSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<SubscribeToProfileDeletedSubscription, SubscribeToProfileDeletedSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<SubscribeToProfileDeletedSubscription, SubscribeToProfileDeletedSubscriptionVariables>(SubscribeToProfileDeletedDocument, {}, options);
}
export type SubscribeToProfileDeletedSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<SubscribeToProfileDeletedSubscription, SubscribeToProfileDeletedSubscriptionVariables>;
export const SearchCtFsDocument = gql`
    query SearchCTFs($search: String!) {
  ctfs(filter: {title: {includesInsensitive: $search}}) {
    nodes {
      ...CtfFragment
    }
  }
}
    ${CtfFragmentDoc}`;

/**
 * __useSearchCtFsQuery__
 *
 * To run a query within a Vue component, call `useSearchCtFsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCtFsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useSearchCtFsQuery({
 *   search: // value for 'search'
 * });
 */
export function useSearchCtFsQuery(variables: SearchCtFsQueryVariables | VueCompositionApi.Ref<SearchCtFsQueryVariables> | ReactiveFunction<SearchCtFsQueryVariables>, options: VueApolloComposable.UseQueryOptions<SearchCtFsQuery, SearchCtFsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<SearchCtFsQuery, SearchCtFsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<SearchCtFsQuery, SearchCtFsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<SearchCtFsQuery, SearchCtFsQueryVariables>(SearchCtFsDocument, variables, options);
}
export function useSearchCtFsLazyQuery(variables: SearchCtFsQueryVariables | VueCompositionApi.Ref<SearchCtFsQueryVariables> | ReactiveFunction<SearchCtFsQueryVariables>, options: VueApolloComposable.UseQueryOptions<SearchCtFsQuery, SearchCtFsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<SearchCtFsQuery, SearchCtFsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<SearchCtFsQuery, SearchCtFsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<SearchCtFsQuery, SearchCtFsQueryVariables>(SearchCtFsDocument, variables, options);
}
export type SearchCtFsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<SearchCtFsQuery, SearchCtFsQueryVariables>;
export const SearchTasksDocument = gql`
    query SearchTasks($search: String!) {
  tasks(filter: {title: {includesInsensitive: $search}}) {
    nodes {
      ...TaskFragment
      ctf {
        ...CtfFragment
      }
    }
  }
}
    ${TaskFragmentDoc}
${CtfFragmentDoc}`;

/**
 * __useSearchTasksQuery__
 *
 * To run a query within a Vue component, call `useSearchTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchTasksQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useSearchTasksQuery({
 *   search: // value for 'search'
 * });
 */
export function useSearchTasksQuery(variables: SearchTasksQueryVariables | VueCompositionApi.Ref<SearchTasksQueryVariables> | ReactiveFunction<SearchTasksQueryVariables>, options: VueApolloComposable.UseQueryOptions<SearchTasksQuery, SearchTasksQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<SearchTasksQuery, SearchTasksQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<SearchTasksQuery, SearchTasksQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<SearchTasksQuery, SearchTasksQueryVariables>(SearchTasksDocument, variables, options);
}
export function useSearchTasksLazyQuery(variables: SearchTasksQueryVariables | VueCompositionApi.Ref<SearchTasksQueryVariables> | ReactiveFunction<SearchTasksQueryVariables>, options: VueApolloComposable.UseQueryOptions<SearchTasksQuery, SearchTasksQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<SearchTasksQuery, SearchTasksQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<SearchTasksQuery, SearchTasksQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<SearchTasksQuery, SearchTasksQueryVariables>(SearchTasksDocument, variables, options);
}
export type SearchTasksQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<SearchTasksQuery, SearchTasksQueryVariables>;
export const SearchTagsDocument = gql`
    query SearchTags($search: String!) {
  tags(filter: {tag: {includesInsensitive: $search}}) {
    nodes {
      tasksByAssignedTagTagIdAndTaskId {
        nodes {
          ...TaskFragment
          ctf {
            ...CtfFragment
          }
        }
      }
    }
  }
}
    ${TaskFragmentDoc}
${CtfFragmentDoc}`;

/**
 * __useSearchTagsQuery__
 *
 * To run a query within a Vue component, call `useSearchTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchTagsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useSearchTagsQuery({
 *   search: // value for 'search'
 * });
 */
export function useSearchTagsQuery(variables: SearchTagsQueryVariables | VueCompositionApi.Ref<SearchTagsQueryVariables> | ReactiveFunction<SearchTagsQueryVariables>, options: VueApolloComposable.UseQueryOptions<SearchTagsQuery, SearchTagsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<SearchTagsQuery, SearchTagsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<SearchTagsQuery, SearchTagsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<SearchTagsQuery, SearchTagsQueryVariables>(SearchTagsDocument, variables, options);
}
export function useSearchTagsLazyQuery(variables: SearchTagsQueryVariables | VueCompositionApi.Ref<SearchTagsQueryVariables> | ReactiveFunction<SearchTagsQueryVariables>, options: VueApolloComposable.UseQueryOptions<SearchTagsQuery, SearchTagsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<SearchTagsQuery, SearchTagsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<SearchTagsQuery, SearchTagsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<SearchTagsQuery, SearchTagsQueryVariables>(SearchTagsDocument, variables, options);
}
export type SearchTagsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<SearchTagsQuery, SearchTagsQueryVariables>;
export const SearchAllDocument = gql`
    query SearchAll($search: String!) {
  tags(filter: {tag: {includesInsensitive: $search}}) {
    nodes {
      tasksByAssignedTagTagIdAndTaskId {
        nodes {
          ...TaskFragment
          ctf {
            ...CtfFragment
          }
        }
      }
    }
  }
  tasks(filter: {title: {includesInsensitive: $search}}) {
    nodes {
      ...TaskFragment
      ctf {
        ...CtfFragment
      }
    }
  }
  ctfs(filter: {title: {includesInsensitive: $search}}) {
    nodes {
      ...CtfFragment
    }
  }
}
    ${TaskFragmentDoc}
${CtfFragmentDoc}`;

/**
 * __useSearchAllQuery__
 *
 * To run a query within a Vue component, call `useSearchAllQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchAllQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useSearchAllQuery({
 *   search: // value for 'search'
 * });
 */
export function useSearchAllQuery(variables: SearchAllQueryVariables | VueCompositionApi.Ref<SearchAllQueryVariables> | ReactiveFunction<SearchAllQueryVariables>, options: VueApolloComposable.UseQueryOptions<SearchAllQuery, SearchAllQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<SearchAllQuery, SearchAllQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<SearchAllQuery, SearchAllQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<SearchAllQuery, SearchAllQueryVariables>(SearchAllDocument, variables, options);
}
export function useSearchAllLazyQuery(variables: SearchAllQueryVariables | VueCompositionApi.Ref<SearchAllQueryVariables> | ReactiveFunction<SearchAllQueryVariables>, options: VueApolloComposable.UseQueryOptions<SearchAllQuery, SearchAllQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<SearchAllQuery, SearchAllQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<SearchAllQuery, SearchAllQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<SearchAllQuery, SearchAllQueryVariables>(SearchAllDocument, variables, options);
}
export type SearchAllQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<SearchAllQuery, SearchAllQueryVariables>;
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
export function useGetCredentialsForCtfIdLazyQuery(variables: GetCredentialsForCtfIdQueryVariables | VueCompositionApi.Ref<GetCredentialsForCtfIdQueryVariables> | ReactiveFunction<GetCredentialsForCtfIdQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetCredentialsForCtfIdQuery, GetCredentialsForCtfIdQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetCredentialsForCtfIdQuery, GetCredentialsForCtfIdQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetCredentialsForCtfIdQuery, GetCredentialsForCtfIdQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetCredentialsForCtfIdQuery, GetCredentialsForCtfIdQueryVariables>(GetCredentialsForCtfIdDocument, variables, options);
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
export function useUpdateCredentialsForCtfIdMutation(options: VueApolloComposable.UseMutationOptions<UpdateCredentialsForCtfIdMutation, UpdateCredentialsForCtfIdMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateCredentialsForCtfIdMutation, UpdateCredentialsForCtfIdMutationVariables>> = {}) {
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
export function useGetSettingsLazyQuery(options: VueApolloComposable.UseQueryOptions<GetSettingsQuery, GetSettingsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetSettingsQuery, GetSettingsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetSettingsQuery, GetSettingsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetSettingsQuery, GetSettingsQueryVariables>(GetSettingsDocument, {}, options);
}
export type GetSettingsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetSettingsQuery, GetSettingsQueryVariables>;
export const GetIcalPasswordDocument = gql`
    query getIcalPassword {
  settings {
    nodes {
      nodeId
      icalPassword
    }
  }
}
    `;

/**
 * __useGetIcalPasswordQuery__
 *
 * To run a query within a Vue component, call `useGetIcalPasswordQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIcalPasswordQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetIcalPasswordQuery();
 */
export function useGetIcalPasswordQuery(options: VueApolloComposable.UseQueryOptions<GetIcalPasswordQuery, GetIcalPasswordQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetIcalPasswordQuery, GetIcalPasswordQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetIcalPasswordQuery, GetIcalPasswordQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetIcalPasswordQuery, GetIcalPasswordQueryVariables>(GetIcalPasswordDocument, {}, options);
}
export function useGetIcalPasswordLazyQuery(options: VueApolloComposable.UseQueryOptions<GetIcalPasswordQuery, GetIcalPasswordQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetIcalPasswordQuery, GetIcalPasswordQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetIcalPasswordQuery, GetIcalPasswordQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetIcalPasswordQuery, GetIcalPasswordQueryVariables>(GetIcalPasswordDocument, {}, options);
}
export type GetIcalPasswordQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetIcalPasswordQuery, GetIcalPasswordQueryVariables>;
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
export function useGetAdminSettingsLazyQuery(options: VueApolloComposable.UseQueryOptions<GetAdminSettingsQuery, GetAdminSettingsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAdminSettingsQuery, GetAdminSettingsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAdminSettingsQuery, GetAdminSettingsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetAdminSettingsQuery, GetAdminSettingsQueryVariables>(GetAdminSettingsDocument, {}, options);
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
export function useUpdateSettingsMutation(options: VueApolloComposable.UseMutationOptions<UpdateSettingsMutation, UpdateSettingsMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateSettingsMutation, UpdateSettingsMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdateSettingsMutation, UpdateSettingsMutationVariables>(UpdateSettingsDocument, options);
}
export type UpdateSettingsMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateSettingsMutation, UpdateSettingsMutationVariables>;
export const GetTagsDocument = gql`
    query getTags {
  tags {
    nodes {
      ...TagFragment
    }
  }
}
    ${TagFragmentDoc}`;

/**
 * __useGetTagsQuery__
 *
 * To run a query within a Vue component, call `useGetTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTagsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetTagsQuery();
 */
export function useGetTagsQuery(options: VueApolloComposable.UseQueryOptions<GetTagsQuery, GetTagsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTagsQuery, GetTagsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTagsQuery, GetTagsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, {}, options);
}
export function useGetTagsLazyQuery(options: VueApolloComposable.UseQueryOptions<GetTagsQuery, GetTagsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTagsQuery, GetTagsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTagsQuery, GetTagsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, {}, options);
}
export type GetTagsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetTagsQuery, GetTagsQueryVariables>;
export const GetTagByIdDocument = gql`
    query getTagById($id: Int!) {
  tag(id: $id) {
    tag
    id
  }
}
    `;

/**
 * __useGetTagByIdQuery__
 *
 * To run a query within a Vue component, call `useGetTagByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTagByIdQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetTagByIdQuery({
 *   id: // value for 'id'
 * });
 */
export function useGetTagByIdQuery(variables: GetTagByIdQueryVariables | VueCompositionApi.Ref<GetTagByIdQueryVariables> | ReactiveFunction<GetTagByIdQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetTagByIdQuery, GetTagByIdQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTagByIdQuery, GetTagByIdQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTagByIdQuery, GetTagByIdQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetTagByIdQuery, GetTagByIdQueryVariables>(GetTagByIdDocument, variables, options);
}
export function useGetTagByIdLazyQuery(variables: GetTagByIdQueryVariables | VueCompositionApi.Ref<GetTagByIdQueryVariables> | ReactiveFunction<GetTagByIdQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetTagByIdQuery, GetTagByIdQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTagByIdQuery, GetTagByIdQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTagByIdQuery, GetTagByIdQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetTagByIdQuery, GetTagByIdQueryVariables>(GetTagByIdDocument, variables, options);
}
export type GetTagByIdQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetTagByIdQuery, GetTagByIdQueryVariables>;
export const AddTagsForTaskDocument = gql`
    mutation addTagsForTask($tags: [String!], $taskId: Int!) {
  addTagsForTask(input: {tags: $tags, taskid: $taskId}) {
    clientMutationId
  }
}
    `;

/**
 * __useAddTagsForTaskMutation__
 *
 * To run a mutation, you first call `useAddTagsForTaskMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useAddTagsForTaskMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useAddTagsForTaskMutation({
 *   variables: {
 *     tags: // value for 'tags'
 *     taskId: // value for 'taskId'
 *   },
 * });
 */
export function useAddTagsForTaskMutation(options: VueApolloComposable.UseMutationOptions<AddTagsForTaskMutation, AddTagsForTaskMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<AddTagsForTaskMutation, AddTagsForTaskMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<AddTagsForTaskMutation, AddTagsForTaskMutationVariables>(AddTagsForTaskDocument, options);
}
export type AddTagsForTaskMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<AddTagsForTaskMutation, AddTagsForTaskMutationVariables>;
export const SubscribeToTagDocument = gql`
    subscription subscribeToTag {
  listen(topic: "update:tag") {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Tag {
        ...TagFragment
      }
    }
  }
}
    ${TagFragmentDoc}`;

/**
 * __useSubscribeToTagSubscription__
 *
 * To run a query within a Vue component, call `useSubscribeToTagSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToTagSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useSubscribeToTagSubscription();
 */
export function useSubscribeToTagSubscription(options: VueApolloComposable.UseSubscriptionOptions<SubscribeToTagSubscription, SubscribeToTagSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<SubscribeToTagSubscription, SubscribeToTagSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<SubscribeToTagSubscription, SubscribeToTagSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<SubscribeToTagSubscription, SubscribeToTagSubscriptionVariables>(SubscribeToTagDocument, {}, options);
}
export type SubscribeToTagSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<SubscribeToTagSubscription, SubscribeToTagSubscriptionVariables>;
export const SubscribeToTagCreatedDocument = gql`
    subscription subscribeToTagCreated {
  listen(topic: "created:tag") {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Tag {
        ...TagFragment
      }
    }
  }
}
    ${TagFragmentDoc}`;

/**
 * __useSubscribeToTagCreatedSubscription__
 *
 * To run a query within a Vue component, call `useSubscribeToTagCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToTagCreatedSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useSubscribeToTagCreatedSubscription();
 */
export function useSubscribeToTagCreatedSubscription(options: VueApolloComposable.UseSubscriptionOptions<SubscribeToTagCreatedSubscription, SubscribeToTagCreatedSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<SubscribeToTagCreatedSubscription, SubscribeToTagCreatedSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<SubscribeToTagCreatedSubscription, SubscribeToTagCreatedSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<SubscribeToTagCreatedSubscription, SubscribeToTagCreatedSubscriptionVariables>(SubscribeToTagCreatedDocument, {}, options);
}
export type SubscribeToTagCreatedSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<SubscribeToTagCreatedSubscription, SubscribeToTagCreatedSubscriptionVariables>;
export const SubscribeToTagDeletedDocument = gql`
    subscription subscribeToTagDeleted {
  listen(topic: "deleted:tag") {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Tag {
        ...TagFragment
      }
    }
  }
}
    ${TagFragmentDoc}`;

/**
 * __useSubscribeToTagDeletedSubscription__
 *
 * To run a query within a Vue component, call `useSubscribeToTagDeletedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToTagDeletedSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useSubscribeToTagDeletedSubscription();
 */
export function useSubscribeToTagDeletedSubscription(options: VueApolloComposable.UseSubscriptionOptions<SubscribeToTagDeletedSubscription, SubscribeToTagDeletedSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<SubscribeToTagDeletedSubscription, SubscribeToTagDeletedSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<SubscribeToTagDeletedSubscription, SubscribeToTagDeletedSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<SubscribeToTagDeletedSubscription, SubscribeToTagDeletedSubscriptionVariables>(SubscribeToTagDeletedDocument, {}, options);
}
export type SubscribeToTagDeletedSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<SubscribeToTagDeletedSubscription, SubscribeToTagDeletedSubscriptionVariables>;
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
export function useGetTasksForCtfIdLazyQuery(variables: GetTasksForCtfIdQueryVariables | VueCompositionApi.Ref<GetTasksForCtfIdQueryVariables> | ReactiveFunction<GetTasksForCtfIdQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetTasksForCtfIdQuery, GetTasksForCtfIdQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTasksForCtfIdQuery, GetTasksForCtfIdQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTasksForCtfIdQuery, GetTasksForCtfIdQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetTasksForCtfIdQuery, GetTasksForCtfIdQueryVariables>(GetTasksForCtfIdDocument, variables, options);
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
export function useTaskByIdLazyQuery(variables: TaskByIdQueryVariables | VueCompositionApi.Ref<TaskByIdQueryVariables> | ReactiveFunction<TaskByIdQueryVariables>, options: VueApolloComposable.UseQueryOptions<TaskByIdQuery, TaskByIdQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<TaskByIdQuery, TaskByIdQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<TaskByIdQuery, TaskByIdQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<TaskByIdQuery, TaskByIdQueryVariables>(TaskByIdDocument, variables, options);
}
export type TaskByIdQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<TaskByIdQuery, TaskByIdQueryVariables>;
export const UpdateTaskDocument = gql`
    mutation updateTask($id: Int!, $title: String, $description: String, $flag: String) {
  updateTask(
    input: {id: $id, patch: {title: $title, description: $description, flag: $flag}}
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
 *     flag: // value for 'flag'
 *   },
 * });
 */
export function useUpdateTaskMutation(options: VueApolloComposable.UseMutationOptions<UpdateTaskMutation, UpdateTaskMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateTaskMutation, UpdateTaskMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument, options);
}
export type UpdateTaskMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const CreateTaskForCtfIdDocument = gql`
    mutation createTaskForCtfId($ctfId: Int!, $title: String!, $tags: [String], $description: String, $flag: String) {
  createTask(
    input: {ctfId: $ctfId, title: $title, tags: $tags, description: $description, flag: $flag}
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
 *     tags: // value for 'tags'
 *     description: // value for 'description'
 *     flag: // value for 'flag'
 *   },
 * });
 */
export function useCreateTaskForCtfIdMutation(options: VueApolloComposable.UseMutationOptions<CreateTaskForCtfIdMutation, CreateTaskForCtfIdMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateTaskForCtfIdMutation, CreateTaskForCtfIdMutationVariables>> = {}) {
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
export function useDeleteTaskMutation(options: VueApolloComposable.UseMutationOptions<DeleteTaskMutation, DeleteTaskMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteTaskMutation, DeleteTaskMutationVariables>> = {}) {
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
export function useStartWorkingOnMutation(options: VueApolloComposable.UseMutationOptions<StartWorkingOnMutation, StartWorkingOnMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<StartWorkingOnMutation, StartWorkingOnMutationVariables>> = {}) {
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
export function useStopWorkingOnMutation(options: VueApolloComposable.UseMutationOptions<StopWorkingOnMutation, StopWorkingOnMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<StopWorkingOnMutation, StopWorkingOnMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<StopWorkingOnMutation, StopWorkingOnMutationVariables>(StopWorkingOnDocument, options);
}
export type StopWorkingOnMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<StopWorkingOnMutation, StopWorkingOnMutationVariables>;
export const CancelWorkingOnDocument = gql`
    mutation cancelWorkingOn($taskId: Int!) {
  cancelWorkingOn(input: {taskId: $taskId}) {
    task {
      ...TaskFragment
    }
  }
}
    ${TaskFragmentDoc}`;

/**
 * __useCancelWorkingOnMutation__
 *
 * To run a mutation, you first call `useCancelWorkingOnMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCancelWorkingOnMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCancelWorkingOnMutation({
 *   variables: {
 *     taskId: // value for 'taskId'
 *   },
 * });
 */
export function useCancelWorkingOnMutation(options: VueApolloComposable.UseMutationOptions<CancelWorkingOnMutation, CancelWorkingOnMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CancelWorkingOnMutation, CancelWorkingOnMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CancelWorkingOnMutation, CancelWorkingOnMutationVariables>(CancelWorkingOnDocument, options);
}
export type CancelWorkingOnMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CancelWorkingOnMutation, CancelWorkingOnMutationVariables>;
export const SubscribeToTaskDocument = gql`
    subscription subscribeToTask {
  listen(topic: "update:tasks") {
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
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useSubscribeToTaskSubscription();
 */
export function useSubscribeToTaskSubscription(options: VueApolloComposable.UseSubscriptionOptions<SubscribeToTaskSubscription, SubscribeToTaskSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<SubscribeToTaskSubscription, SubscribeToTaskSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<SubscribeToTaskSubscription, SubscribeToTaskSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<SubscribeToTaskSubscription, SubscribeToTaskSubscriptionVariables>(SubscribeToTaskDocument, {}, options);
}
export type SubscribeToTaskSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<SubscribeToTaskSubscription, SubscribeToTaskSubscriptionVariables>;
export const UploadLogoDocument = gql`
    mutation uploadLogo($logo: Upload!) {
  uploadCtfLogo(logo: $logo)
}
    `;

/**
 * __useUploadLogoMutation__
 *
 * To run a mutation, you first call `useUploadLogoMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUploadLogoMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUploadLogoMutation({
 *   variables: {
 *     logo: // value for 'logo'
 *   },
 * });
 */
export function useUploadLogoMutation(options: VueApolloComposable.UseMutationOptions<UploadLogoMutation, UploadLogoMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UploadLogoMutation, UploadLogoMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UploadLogoMutation, UploadLogoMutationVariables>(UploadLogoDocument, options);
}
export type UploadLogoMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UploadLogoMutation, UploadLogoMutationVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "Node": [
      "AssignedTag",
      "Ctf",
      "CtfSecret",
      "Invitation",
      "Profile",
      "Query",
      "Setting",
      "Tag",
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
  lastactive
  color
  description
  role
  discordId
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
  discordEventLink
}
    `;
export const TagFragment = gql`
    fragment TagFragment on Tag {
  nodeId
  id
  tag
}
    `;
export const AssignedTagsFragment = gql`
    fragment AssignedTagsFragment on AssignedTag {
  nodeId
  taskId
  tagId
  tag {
    ...TagFragment
  }
}
    ${TagFragment}`;
export const WorkingOnFragment = gql`
    fragment WorkingOnFragment on WorkOnTask {
  nodeId
  profileId
  active
  taskId
}
    `;
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
  assignedTags {
    nodes {
      ...AssignedTagsFragment
    }
  }
  workOnTasks {
    nodes {
      ...WorkingOnFragment
    }
  }
}
    ${AssignedTagsFragment}
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
export const PublicProfileFragment = gql`
    fragment PublicProfileFragment on PublicProfile {
  id
  username
  color
  description
  role
  nodeId
}
    `;
export const RestrictedProfile = gql`
    fragment RestrictedProfile on Profile {
  id
  username
  color
  description
  role
  nodeId
}
    `;
export const SettingsInfo = gql`
    fragment SettingsInfo on Setting {
  nodeId
  registrationAllowed
  registrationPasswordAllowed
  style
  discordIntegrationEnabled
}
    `;
export const AdminSettingsInfo = gql`
    fragment AdminSettingsInfo on Setting {
  nodeId
  ...SettingsInfo
  registrationPassword
  registrationDefaultRole
  icalPassword
}
    ${SettingsInfo}`;
export const TaskForTagsFragement = gql`
    fragment TaskForTagsFragement on AssignedTag {
  nodeId
  taskId
  tagId
  task {
    ...TaskFragment
  }
}
    ${TaskFragment}`;
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
    ...ProfileFragment
  }
}
    ${ProfileFragment}`;
export const NewToken = gql`
    query newToken {
  newToken
}
    `;
export const ProfileToken = gql`
    query profileToken {
  profileToken
}
    `;
export const ResetProfileToken = gql`
    mutation resetProfileToken {
  resetProfileToken(input: {}) {
    string
  }
}
    `;
export const ResetDiscordId = gql`
    mutation resetDiscordId {
  resetDiscordId(input: {}) {
    string
  }
}
    `;
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
    subscription subscribeToCtf {
  listen(topic: "update:ctfs") {
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
export const GetFullCtf = gql`
    query GetFullCtf($id: Int!) {
  ctf(id: $id) {
    ...FullCtfFragment
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
export const SetDiscordEventLink = gql`
    mutation setDiscordEventLink($id: Int!, $link: String!) {
  setDiscordEventLink(input: {ctfId: $id, link: $link}) {
    clientMutationId
  }
}
    `;
export const SubscribeToCtfCreated = gql`
    subscription subscribeToCtfCreated {
  listen(topic: "created:ctfs") {
    relatedNodeId
    relatedNode {
      ... on Ctf {
        ...CtfFragment
      }
    }
  }
}
    ${CtfFragment}`;
export const SubscribeToCtfDeleted = gql`
    subscription subscribeToCtfDeleted {
  listen(topic: "deleted:ctfs") {
    relatedNodeId
    relatedNode {
      ... on Ctf {
        ...CtfFragment
      }
    }
  }
}
    ${CtfFragment}`;
export const SubscribeToFlag = gql`
    subscription subscribeToFlag {
  listen(topic: "task-solved:tasks") {
    relatedNodeId
    relatedNode {
      ... on Task {
        ...TaskFragment
      }
    }
  }
}
    ${TaskFragment}`;
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
  publicProfiles {
    nodes {
      ...PublicProfileFragment
    }
  }
}
    ${PublicProfileFragment}`;
export const GetTeamAdmin = gql`
    query getTeamAdmin {
  profiles {
    nodes {
      ...ProfileFragment
    }
  }
}
    ${ProfileFragment}`;
export const PublicProfileSubscriptionPayload = gql`
    subscription PublicProfileSubscriptionPayload {
  currentProfileUpdated {
    publicProfile {
      ...PublicProfileFragment
    }
  }
}
    ${PublicProfileFragment}`;
export const SubscribeToProfile = gql`
    subscription subscribeToProfile {
  listen(topic: "update:profiles") {
    relatedNode {
      nodeId
      ... on Profile {
        ...ProfileFragment
      }
    }
  }
}
    ${ProfileFragment}`;
export const SubscribeToProfileCreated = gql`
    subscription subscribeToProfileCreated {
  listen(topic: "created:profiles") {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Profile {
        ...ProfileFragment
      }
    }
  }
}
    ${ProfileFragment}`;
export const SubscribeToProfileDeleted = gql`
    subscription subscribeToProfileDeleted {
  listen(topic: "deleted:profiles") {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Profile {
        ...ProfileFragment
      }
    }
  }
}
    ${ProfileFragment}`;
export const SearchCtFs = gql`
    query SearchCTFs($search: String!) {
  ctfs(filter: {title: {includesInsensitive: $search}}) {
    nodes {
      ...CtfFragment
    }
  }
}
    ${CtfFragment}`;
export const SearchTasks = gql`
    query SearchTasks($search: String!) {
  tasks(filter: {title: {includesInsensitive: $search}}) {
    nodes {
      ...TaskFragment
      ctf {
        ...CtfFragment
      }
    }
  }
}
    ${TaskFragment}
${CtfFragment}`;
export const SearchTags = gql`
    query SearchTags($search: String!) {
  tags(filter: {tag: {includesInsensitive: $search}}) {
    nodes {
      tasksByAssignedTagTagIdAndTaskId {
        nodes {
          ...TaskFragment
          ctf {
            ...CtfFragment
          }
        }
      }
    }
  }
}
    ${TaskFragment}
${CtfFragment}`;
export const SearchAll = gql`
    query SearchAll($search: String!) {
  tags(filter: {tag: {includesInsensitive: $search}}) {
    nodes {
      tasksByAssignedTagTagIdAndTaskId {
        nodes {
          ...TaskFragment
          ctf {
            ...CtfFragment
          }
        }
      }
    }
  }
  tasks(filter: {title: {includesInsensitive: $search}}) {
    nodes {
      ...TaskFragment
      ctf {
        ...CtfFragment
      }
    }
  }
  ctfs(filter: {title: {includesInsensitive: $search}}) {
    nodes {
      ...CtfFragment
    }
  }
}
    ${TaskFragment}
${CtfFragment}`;
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
export const GetIcalPassword = gql`
    query getIcalPassword {
  settings {
    nodes {
      nodeId
      icalPassword
    }
  }
}
    `;
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
export const GetTags = gql`
    query getTags {
  tags {
    nodes {
      ...TagFragment
    }
  }
}
    ${TagFragment}`;
export const GetTagById = gql`
    query getTagById($id: Int!) {
  tag(id: $id) {
    tag
    id
  }
}
    `;
export const AddTagsForTask = gql`
    mutation addTagsForTask($tags: [String!], $taskId: Int!) {
  addTagsForTask(input: {tags: $tags, taskid: $taskId}) {
    clientMutationId
  }
}
    `;
export const SubscribeToTag = gql`
    subscription subscribeToTag {
  listen(topic: "update:tag") {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Tag {
        ...TagFragment
      }
    }
  }
}
    ${TagFragment}`;
export const SubscribeToTagCreated = gql`
    subscription subscribeToTagCreated {
  listen(topic: "created:tag") {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Tag {
        ...TagFragment
      }
    }
  }
}
    ${TagFragment}`;
export const SubscribeToTagDeleted = gql`
    subscription subscribeToTagDeleted {
  listen(topic: "deleted:tag") {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Tag {
        ...TagFragment
      }
    }
  }
}
    ${TagFragment}`;
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
    mutation updateTask($id: Int!, $title: String, $description: String, $flag: String) {
  updateTask(
    input: {id: $id, patch: {title: $title, description: $description, flag: $flag}}
  ) {
    task {
      ...TaskFragment
    }
  }
}
    ${TaskFragment}`;
export const CreateTaskForCtfId = gql`
    mutation createTaskForCtfId($ctfId: Int!, $title: String!, $tags: [String], $description: String, $flag: String) {
  createTask(
    input: {ctfId: $ctfId, title: $title, tags: $tags, description: $description, flag: $flag}
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
export const CancelWorkingOn = gql`
    mutation cancelWorkingOn($taskId: Int!) {
  cancelWorkingOn(input: {taskId: $taskId}) {
    task {
      ...TaskFragment
    }
  }
}
    ${TaskFragment}`;
export const SubscribeToTask = gql`
    subscription subscribeToTask {
  listen(topic: "update:tasks") {
    relatedNode {
      nodeId
      ... on Task {
        ...TaskFragment
      }
    }
  }
}
    ${TaskFragment}`;
export const UploadLogo = gql`
    mutation uploadLogo($logo: Upload!) {
  uploadCtfLogo(logo: $logo)
}
    `;