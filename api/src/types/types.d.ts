import "fs-capacitor";

declare module "fs-capacitor" {
  export interface ReadStream {
    truncated: boolean;
  }
}
