import crypto from "crypto";
import fs from "fs";
import { gql, makeExtendSchemaPlugin } from "graphile-utils";
import { FileUpload, ReadStream } from "graphql-upload-ts";
import path from "path";
import { Client } from "pg";

function isManager(pgRole: string): boolean {
  return pgRole == "user_manager" || isAdmin(pgRole);
}

function isAdmin(pgRole: string): boolean {
  return pgRole == "user_admin";
}

const UPLOAD_DIR_NAME = "uploads";

export interface Context {
  pgClient: Client;
  pgRole: string;
  jwtClaims: {
    user_id: number;
    role: string;
    exp: number;
    iat: number;
    aud: string;
    iss: string;
  } | null;
}

function saveLocal(
  stream: ReadStream,
  filename: string,
  folder = ""
): Promise<string> {
  const folderPath = path.join(UPLOAD_DIR_NAME, folder);
  const filePath = path.join(folderPath, filename);
  const fsPath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  return new Promise((resolve, reject) =>
    stream
      .on("error", (error) => {
        fs.unlinkSync(fsPath);
        reject(error);
      })
      .on("end", () => resolve(filePath))
      .pipe(fs.createWriteStream(fsPath))
  );
}

export default makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      extend type Mutation {
        uploadCtfLogo(logo: Upload!): String!
      }
    `,
    resolvers: {
      Mutation: {
        uploadCtfLogo: async (
          _query,
          { logo }: { logo: Promise<FileUpload> },
          context: Context
        ) => {
          const { pgRole } = context;

          const { filename, createReadStream } = await logo;

          const random = crypto.randomBytes(8).toString("hex");
          const stream = createReadStream();

          if (!isManager(pgRole)) {
            throw new Error("No enough privileges");
          }
          const path = await saveLocal(
            stream,
            `${random}-${filename}`,
            `logos`
          );
          return `/${path}`;
        },
      },
    },
  };
});
