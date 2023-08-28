import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Follower } from "./entities/follower.entity";
import { FollowersController } from "./followers.controller";
import { FollowersService } from "./followers.service";

@Module({
    imports: [TypeOrmModule.forFeature([Follower])],
    controllers: [FollowersController],
    providers: [FollowersService],
})
export class FollowersModule {}
