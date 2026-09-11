import { join } from "path";
import type { Service } from "../../types/index.js";
import { PROTO_PATH } from "../path.js";

const name: string = "AuthorizationService";
const packageName: string = "authorization.v1";
const path: string = join(PROTO_PATH, "authorization.proto");

export const AUTHORIZATION_SERVICE = {
  NAME: name,
  REGISTER: "Register",
  LOGIN: "Login",
  REFRESH_TOKENS: "RefreshTokens",
  PROFILE: "Profile",
} as const;

export const AUTHORIZATION_CLIENT: Omit<Service, "url"> = {
  name,
  package: packageName,
  path,
};

export function createAuthorizationService(url: string): Service {
  return {
    name,
    package: packageName,
    path,
    url,
  };
}
