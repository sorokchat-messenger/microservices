import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const PROTO_PATH: string = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "proto",
);
