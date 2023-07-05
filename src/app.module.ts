import { Module } from "@nestjs/common";
import { RediusModule } from "./redius/redius.module";

@Module({
    imports: [RediusModule],
})
export class AppModule {}
