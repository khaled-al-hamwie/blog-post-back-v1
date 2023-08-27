import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Put,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { UserDecorator } from "src/core/common/decorators/user.decorator";
import { LoggedInGuard } from "src/core/common/guards/logged-in.guard";
import { BlogAction } from "../../blogs/enums/blogs.actions.enum";
import { BlogNotFoundException } from "../../blogs/exceptions/BlogNotFound.exception";
import { User } from "../../users/entities/user.entity";
import { BlogLike } from "../entities/blog-like.entity";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CommentsService } from "src/modules/comments/comments.service";
import { CommentAction } from "src/modules/comments/enums/comments.actions.enum";
import { CommentLike } from "../entities/comment-like.entity";
import { likesAbilityFactory } from "../factories/like-ability.factory";
import { BlogLikesService } from "../providers/blog-likes.service";

@UseGuards(LoggedInGuard)
@Controller("likes/comments")
export class CommentLikesController {
    constructor(
        private readonly commentsService: CommentsService,
        private readonly likesService: BlogLikesService,
        private readonly likesAbilityFactory: likesAbilityFactory,
    ) {}

    @Put(":comment_id")
    async putLike(
        @Param("comment_id", ParseIntPipe) comment_id: number,
        @UserDecorator() user: User,
    ) {
        return "hi";
        // const comment = await this.commentsService.findOne({ where: { comment_id } });
        // if (!comment) throw new BlogNotFoundException();
        // const ability = this.likesAbilityFactory.createForUser(user);
        // if (ability.cannot(CommentAction.LikeComment, comment))
        //     throw new UnauthorizedException();
        // const likedComment: CommentLike = await this.likesService.findOne({
        //     where: { blog: { blog_id: comment_id }, user: { user_id: user.user_id } },
        // });
        // if (likedComment) return this.likesService.remove(likedBlog);
        // return this.likesService.create(comment, user.user_id);
    }

    // @Get(":blog_id")
    // async getLikes(
    //     @Param("blog_id", ParseIntPipe) blog_id: number,
    //     @UserDecorator("user_id") user_id: number,
    // ) {
    //     const isLiked = await this.likesService.isLiked(blog_id, user_id);
    //     const likeCount = await this.likesService.likeCount(blog_id);
    //     return { is_liked: isLiked, like_count: likeCount };
    // }
}
