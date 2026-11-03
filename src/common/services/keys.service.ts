import { join } from "path";
import type { Service } from "../../types/index.js";
import { PROTO_PATH } from "../path.js";

const name: string = "KeysService";
const packageName: string = "keys.v1";
const path: string = join(PROTO_PATH, "keys.proto");

export const KEYS_SERVICE = {
    NAME: name,
    REGISTER_IDENTITY_KEY: "RegisterIdentityKey",
    UPLOAD_KEY_PACKAGES: "UploadKeyPackages",
    CONSUME_KEY_PACKAGE: "ConsumeKeyPackage"
} as const;

export const KEYS_CLIENT: Omit<Service, "url"> = {
    name,
    package: packageName,
    path,
};

export function createKeysService(url: string): Service {
    return {
        name,
        package: packageName,
        path,
        url,
    };
}
