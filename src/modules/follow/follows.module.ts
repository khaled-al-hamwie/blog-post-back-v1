import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { Follow } from "./entities/follow.entity";
import { followsAbilityFactory } from "./factories/follow-ability.factory";
import { FollowsController } from "./follows.controller";
import { FollowsService } from "./follows.service";
import { FollowShowFollowingProvider } from "./providers/follows.show-following.provider";

@Module({
    imports: [TypeOrmModule.forFeature([Follow]), UsersModule],
    controllers: [FollowsController],
    providers: [
        FollowsService,
        followsAbilityFactory,
        FollowShowFollowingProvider,
    ],
})
export class FollowsModule {}
