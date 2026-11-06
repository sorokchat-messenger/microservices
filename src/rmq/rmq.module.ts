import { type DynamicModule, Module } from "@nestjs/common";
import { ClientsModule, Transport, type RmqOptions } from "@nestjs/microservices";
import { RmqService } from "./rmq.service.js";

export interface RmqModuleOptions {
    queue: string;
    urls?: string[];
    queueOptions?: Record<string, unknown>;
    prefetchCount?: number;
}

export interface RmqModuleAsyncOptions {
    queue: string;
    useFactory: (...args: any[]) => Promise<Omit<RmqModuleOptions, "queue">> | Omit<RmqModuleOptions, "queue">;
    inject?: any[];
    imports?: any[];
}

const DEFAULT_RMQ_OPTIONS: Partial<RmqModuleOptions> = {
    queueOptions: {
        durable: false,
    },
    prefetchCount: 1,
};

export const RMQ_NAME: string = "RMQ_CLIENT";

@Module({})
export class RmqModule {
    public static register(options: RmqModuleOptions): DynamicModule {
        const mergedOptions = this.mergeOptions(options);

        return {
            module: RmqModule,
            imports: [
                ClientsModule.registerAsync([
                    {
                        name: RMQ_NAME,
                        useFactory: () => this.createRmqClientOptions(mergedOptions),
                    },
                ]),
            ],
            providers: [RmqService],
            exports: [ClientsModule, RmqService],
        };
    }

    public static registerAsync(asyncOptions: RmqModuleAsyncOptions): DynamicModule {
        return {
            module: RmqModule,
            imports: [
                ...(asyncOptions.imports || []),
                ClientsModule.registerAsync([
                    {
                        name: RMQ_NAME,
                        imports: asyncOptions.imports || [],
                        inject: asyncOptions.inject || [],
                        useFactory: async (...args: any[]) => {
                            const factoryOptions = await asyncOptions.useFactory(...args);

                            const mergedOptions = this.mergeOptions({
                                queue: asyncOptions.queue,
                                ...factoryOptions,
                            });

                            return this.createRmqClientOptions(mergedOptions);
                        },
                    },
                ]),
            ],
            providers: [RmqService],
            exports: [ClientsModule, RmqService],
        };
    }

    private static mergeOptions(options: RmqModuleOptions): RmqModuleOptions {
        return {
            ...DEFAULT_RMQ_OPTIONS,
            ...options,
            queueOptions: {
                ...DEFAULT_RMQ_OPTIONS.queueOptions,
                ...options.queueOptions,
            },
        };
    }

    private static createRmqClientOptions(options: RmqModuleOptions): RmqOptions {
        const rmqOptions: RmqOptions['options'] = {};
        if (options.prefetchCount !== undefined) {
            rmqOptions.prefetchCount = options.prefetchCount
        }
        if (options.queue !== undefined) {
            rmqOptions.queue = options.queue
        }
        if (options.queueOptions !== undefined) {
            rmqOptions.queueOptions = options.queueOptions
        }
        if (options.urls !== undefined) {
            rmqOptions.urls = options.urls;
        }

        return {
            transport: Transport.RMQ,
            options: rmqOptions,
        };
    }
}