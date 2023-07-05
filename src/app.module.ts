import { Module } from "@nestjs/common";
import { RedisModule } from "./redius/redis.module";

@Module({
    imports: [RedisModule],
})
export class AppModule {}
