import { Module } from "@nestjs/common";
import * as Redis from "redis";
import { REDIS } from "./redis.constants";

@Module({
    providers: [
        {
            provide: REDIS,
            useFactory: async () => {
                const client = Redis.createClient({
                    url: "rediss://emqx:public@127.0.0.1:6379",
                    legacyMode: true,
                });
                await client.connect();
                return client;
            },
        },
    ],
    exports: [REDIS],
})
export class RediusModule {}
