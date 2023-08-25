import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogsModule } from "../blogs/blogs.module";
import { UsersModule } from "../users/users.module";
import { Like } from "./entities/like.entity";
import { likesAbilityFactory } from "./factories/like-ability.factory";
import { LikesController } from "./likes.controller";
import { LikesService } from "./likes.service";

@Module({
    imports: [TypeOrmModule.forFeature([Like]), BlogsModule, UsersModule],
    controllers: [LikesController],
    providers: [LikesService, likesAbilityFactory],
})
export class LikesModule {}
