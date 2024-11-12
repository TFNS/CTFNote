import { GraphQLResolveInfoWithMessages } from "@graphile/operation-hooks";
import { Build, Context } from "postgraphile";

export interface Hooks {
  operationHook: (_build: Build) => (fieldContext: Context<unknown>) => {
    before: {
      priority: number;
      callback: (
        input: unknown,
        args: unknown,
        context: unknown,
        _resolveInfo: GraphQLResolveInfoWithMessages
      ) => Promise<unknown>;
    }[];
    after: {
      priority: number;
      callback: (
        input: unknown,
        args: unknown,
        context: unknown,
        _resolveInfo: GraphQLResolveInfoWithMessages
      ) => Promise<unknown>;
    }[];
  } | null;
}
