import {
  ClientsModule,
  Transport,
  type ClientsProviderAsyncOptions,
} from "@nestjs/microservices";
import type { Service } from "../types/index.js";
import type { DynamicModule, ForwardReference, Type } from "@nestjs/common";
import { LOADER_OPTIONS } from "../common/index.js";

type Options = {
  inject?: any[];
  imports?: (
    Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference<any>
  )[];
  urlFactory: (...args: any[]) => string;
};

export function createClientModule(
  services: (Omit<Service, "url"> & Options)[],
): ClientsModule {
  return ClientsModule.registerAsync({
    isGlobal: true,
    clients: services.map(
      ({
        name,
        package: packageName,
        path,
        urlFactory,
        imports,
        inject,
      }): ClientsProviderAsyncOptions => ({
        name,
        imports: imports || [],
        inject: inject || [],
        useFactory(...args) {
          const url: string = urlFactory(...args);
          return {
            transport: Transport.GRPC,
            options: {
              package: packageName,
              loader: LOADER_OPTIONS,
              url,
              protoPath: path,
            },
          };
        },
      }),
    ),
  });
}
