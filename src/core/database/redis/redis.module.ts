import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Redis from "redis";
import { REDIS } from "src/core/constants/redis";

@Module({
    providers: [
        {
            provide: REDIS,
            useFactory: async (configService: ConfigService) => {
                const client = Redis.createClient({
                    url: configService.get<string>("REDIS_URL"),
                    legacyMode: true,
                });
                await client.connect();
                return client;
            },
            inject: [ConfigService],
        },
    ],
    exports: [REDIS],
})
export class RedisModule {}
