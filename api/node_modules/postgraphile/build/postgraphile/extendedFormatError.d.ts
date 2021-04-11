import { GraphQLError } from 'graphql';
import { GraphQLFormattedErrorExtended } from '../interfaces';
/**
 * Given a GraphQLError, format it according to the rules described by the
 * Response Format, Errors section of the GraphQL Specification, plus it can
 * extract additional error codes from the postgres error, such as 'hint',
 * 'detail', 'errcode', 'where', etc. - see `extendedErrors` option.
 */
export declare function extendedFormatError(error: GraphQLError, fields: Array<string>): GraphQLFormattedErrorExtended;
