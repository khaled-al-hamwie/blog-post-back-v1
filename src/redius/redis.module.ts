import { Module } from "@nestjs/common";
import { createClient } from "redis";
import { REDIS } from "./redis.constants";

@Module({
    providers: [
        {
            provide: REDIS,
            useFactory: async () => {
                const client = createClient({
                    legacyMode: true,
                });
                await client.connect();
                return client;
            },
        },
    ],
    exports: [REDIS],
})
export class RedisModule {}
