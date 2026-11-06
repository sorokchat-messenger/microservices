import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { firstValueFrom, type Observable } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";

export interface RmqEmitOptions {
    eventId?: string,
    timestamp?: string;
    headers?: Record<string, unknown>;
}

export interface RmqEnvelope<T = unknown> {
    eventId: string;
    occurredOn: string;
    headers?: Record<string, unknown>;
    data: T;
}

export const RMQ_NAME: string = "RMQ_CLIENT";

@Injectable()
export class RmqService implements OnModuleInit {
    public constructor(
        @Inject(RMQ_NAME) private readonly client: ClientProxy
    ) { }

    public static createCustom(client: ClientProxy): RmqService {
        return new RmqService(client);
    }

    public async onModuleInit(): Promise<void> {
        await this.client.connect();
    }

    public async emit<Payload = unknown>(pattern: string, payload: Payload, options?: RmqEmitOptions): Promise<void> {
        const envelope = this.createEnvelope(payload, options);
        const source$: Observable<void> = this.client.emit<void, RmqEnvelope<Payload>>(pattern, envelope);
        await firstValueFrom(source$);
    }

    public async send<Result = unknown, Input = unknown>(pattern: string, payload: Input, options?: RmqEmitOptions): Promise<Result> {
        const envelope = this.createEnvelope(payload, options);
        return await firstValueFrom(this.client.send<Result, RmqEnvelope<Input>>(pattern, envelope));
    }

    private createEnvelope<T>(payload: T, options?: RmqEmitOptions): RmqEnvelope<T> {
        const envelope: RmqEnvelope<T> = {
            eventId: options?.eventId ?? crypto.randomUUID(),
            occurredOn: options?.timestamp ?? new Date().toISOString(),
            data: payload,
        };

        if (options?.headers !== undefined) {
            envelope.headers = options.headers;
        }

        return envelope;
    }
}