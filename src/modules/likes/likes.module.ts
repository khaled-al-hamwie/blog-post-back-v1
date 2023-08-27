import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogsModule } from "../blogs/blogs.module";
import { CommentsModule } from "../comments/comments.module";
import { UsersModule } from "../users/users.module";
import { BlogLikesController } from "./controllers/blog-likes.controller";
import { CommentLikesController } from "./controllers/comment-likes.controller";
import { BlogLike } from "./entities/blog-like.entity";
import { CommentLike } from "./entities/comment-like.entity";
import { likesAbilityFactory } from "./factories/like-ability.factory";
import { BlogLikesService } from "./providers/blog-likes.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([BlogLike, CommentLike]),
        BlogsModule,
        CommentsModule,
        UsersModule,
    ],
    controllers: [BlogLikesController, CommentLikesController],
    providers: [BlogLikesService, likesAbilityFactory],
})
export class LikesModule {}
