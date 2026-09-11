import { type INestMicroservice } from "@nestjs/common";
import { NestFactory, type IEntryNestModule } from "@nestjs/core";
import type { Service } from "../types/index.js";
import { Transport, type GrpcOptions } from "@nestjs/microservices";
import { LOADER_OPTIONS } from "../common/index.js";

export async function createServer(
  entryModule: IEntryNestModule,
  service: Service,
): Promise<INestMicroservice> {
  const application = await NestFactory.createMicroservice<GrpcOptions>(
    entryModule,
    {
      transport: Transport.GRPC,
      options: {
        package: service.package,
        protoPath: service.path,
        loader: LOADER_OPTIONS,
        url: service.url,
      },
    },
  );
  return application;
}
