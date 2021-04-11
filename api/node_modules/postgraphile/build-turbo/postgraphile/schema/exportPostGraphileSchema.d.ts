import { GraphQLSchema } from 'graphql';
import { PostGraphileOptions } from '../../interfaces';
/**
 * Exports a PostGraphile schema by looking at a Postgres client.
 */
export default function exportPostGraphileSchema(schema: GraphQLSchema, options?: PostGraphileOptions): Promise<void>;
