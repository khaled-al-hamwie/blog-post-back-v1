import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogsModule } from "../blogs/blogs.module";
import { LikesModule } from "../likes/likes.module";
import { UsersModule } from "../users/users.module";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { Comment } from "./entities/comment.entity";
import { CommentsAbilityFactory } from "./factories/comments-ability.factory";
import { CommentsFindAllProvider } from "./providers/comments.findAll.provider";
import { CommentsGetReplyProvider } from "./providers/comments.getReply.provider";

@Module({
    imports: [
        TypeOrmModule.forFeature([Comment]),
        forwardRef(() => BlogsModule),
        UsersModule,
        forwardRef(() => LikesModule),
    ],
    controllers: [CommentsController],
    providers: [
        CommentsService,
        CommentsAbilityFactory,
        CommentsFindAllProvider,
        CommentsGetReplyProvider,
    ],
    exports: [CommentsService],
})
export class CommentsModule {}
