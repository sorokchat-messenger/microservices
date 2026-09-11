import type { GrpcOptions } from "@nestjs/microservices";

export const LOADER_OPTIONS: NonNullable<GrpcOptions["options"]["loader"]> = {
  keepCase: false,
  longs: String,
  enums: String,
  oneofs: true,
};
