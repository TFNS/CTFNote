import { SchemaBuilder } from "graphile-build";
import { Upload } from "graphql-upload";

export default function (builder: SchemaBuilder): void {
  builder.hook("build", (_, build) => {
    const {
      addType,
      graphql: { GraphQLScalarType, GraphQLError },
    } = build;

    const GraphQLUpload = new GraphQLScalarType({
      name: "Upload",
      description: "The `Upload` scalar type represents a file upload.",
      parseValue(value: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (value instanceof Upload) return (value as any).promise;
        throw new GraphQLError("Upload value invalid.");
      },
      parseLiteral() {
        throw new GraphQLError("Upload literal unsupported.");
      },
      serialize() {
        throw new GraphQLError("Upload serialization unsupported.");
      },
    });

    addType(GraphQLUpload);

    return _;
  });
}
