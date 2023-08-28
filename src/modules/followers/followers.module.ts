import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { Follower } from "./entities/follower.entity";
import { followsAbilityFactory } from "./factories/follow-ability.factory";
import { FollowersController } from "./followers.controller";
import { FollowersService } from "./followers.service";

@Module({
    imports: [TypeOrmModule.forFeature([Follower]), UsersModule],
    controllers: [FollowersController],
    providers: [FollowersService, followsAbilityFactory],
})
export class FollowersModule {}
