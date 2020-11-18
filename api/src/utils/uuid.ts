import * as uuid from "uuid";

export default function genUUID(): string {
  return uuid.v4();
}
