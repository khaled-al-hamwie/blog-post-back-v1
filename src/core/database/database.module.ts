import { Module } from "@nestjs/common";
import { MysqlModule } from "./mysql/mysql.module";
import { RedisModule } from "./redis/redis.module";
@Module({
    imports: [MysqlModule, RedisModule],
})
export class DatabaseModule {}
