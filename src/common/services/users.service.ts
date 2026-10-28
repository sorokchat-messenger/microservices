import { join } from "path";
import type { Service } from "../../types/index.js";
import { PROTO_PATH } from "../path.js";

const name: string = "UsersService";
const packageName: string = "users.v1";
const path: string = join(PROTO_PATH, "users.proto");

export const USERS_SERVICE = {
    NAME: name,
    CREATE: "Create",
    GET_BY_ID: "GetById",
    GET_BY_TERM: "GetByTerm",
    UPDATE: "Update",
    DELETE: "Delete"
} as const;

export const USERS_CLIENT: Omit<Service, "url"> = {
    name,
    package: packageName,
    path,
};

export function createUsersService(url: string): Service {
    return {
        name,
        package: packageName,
        path,
        url,
    };
}
