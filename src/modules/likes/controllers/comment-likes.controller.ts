import {
    Controller,
    Param,
    ParseIntPipe,
    Put,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { UserDecorator } from "src/core/common/decorators/user.decorator";
import { LoggedInGuard } from "src/core/common/guards/logged-in.guard";
import { CommentsService } from "src/modules/comments/comments.service";
import { CommentAction } from "src/modules/comments/enums/comments.actions.enum";
import { BlogNotFoundException } from "../../blogs/exceptions/BlogNotFound.exception";
import { User } from "../../users/entities/user.entity";
import { CommentLike } from "../entities/comment-like.entity";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { likesAbilityFactory } from "../factories/like-ability.factory";
import { CommentLikesService } from "../providers/comment-likes.service";

@UseGuards(LoggedInGuard)
@Controller("likes/comments")
export class CommentLikesController {
    constructor(
        private readonly commentsService: CommentsService,
        private readonly likesService: CommentLikesService,
        private readonly likesAbilityFactory: likesAbilityFactory,
    ) {}

    @Put(":comment_id")
    async putLike(
        @Param("comment_id", ParseIntPipe) comment_id: number,
        @UserDecorator() user: User,
    ) {
        const comment = await this.commentsService.findOne({
            where: { comment_id },
        });
        if (!comment) throw new BlogNotFoundException();
        const ability = this.likesAbilityFactory.createForUser(user);
        if (ability.cannot(CommentAction.LikeComment, comment))
            throw new UnauthorizedException();
        const likedComment: CommentLike = await this.likesService.findOne({
            where: { comment: { comment_id }, user: { user_id: user.user_id } },
        });
        if (likedComment) return this.likesService.remove(likedComment);
        return this.likesService.create(comment, user.user_id);
    }
}
