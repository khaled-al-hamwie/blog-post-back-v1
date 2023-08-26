import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogsModule } from "../blogs/blogs.module";
import { UsersModule } from "../users/users.module";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { Comment } from "./entities/comment.entity";
import { CommentsAbilityFactory } from "./factories/comments-ability.factory";
import { CommentsFindAllProvider } from "./providers/comments.findAll.provider";

@Module({
    imports: [TypeOrmModule.forFeature([Comment]), BlogsModule, UsersModule],
    controllers: [CommentsController],
    providers: [
        CommentsService,
        CommentsAbilityFactory,
        CommentsFindAllProvider,
    ],
})
export class CommentsModule {}
