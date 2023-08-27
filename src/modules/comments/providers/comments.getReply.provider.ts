import { Injectable } from "@nestjs/common";
import { CommentLikesService } from "src/modules/likes/providers/comment-likes.service";
import { FindManyOptions, FindOptionsSelect } from "typeorm";
import { CommentsService } from "../comments.service";
import { Comment } from "../entities/comment.entity";
import { CommentNotFoundException } from "../exceptions/commnets-notFound.exception";

@Injectable()
export class CommentsGetReplyProvider {
    constructor(
        private readonly commentsService: CommentsService,
        private readonly commentLikesService: CommentLikesService,
    ) {}
    GetOption(comment_id: number): FindManyOptions<Comment> {
        const options: FindManyOptions<Comment> = {};
        options.where = { comment_id };
        options.relations = { user: true, replies: { user: true } };
        options.select = this.GetSelect();
        return options;
    }

    GetSelect(): FindOptionsSelect<Comment> {
        const select: FindOptionsSelect<Comment> = {
            comment: true,
            comment_id: true,
            created_at: true,
            updated_at: true,
            user: {
                avatar: true,
                user_id: true,
                user_name: true,
                first_name: true,
                last_name: true,
            },
            replies: {
                comment: true,
                comment_id: true,
                created_at: true,
                updated_at: true,
                user: {
                    avatar: true,
                    user_id: true,
                    user_name: true,
                    first_name: true,
                    last_name: true,
                },
            },
        };
        return select;
    }

    async privideComment(comment_id: number, user_id: number) {
        const option = this.GetOption(comment_id);
        const comment = await this.commentsService.findOne(option);
        if (!comment) throw new CommentNotFoundException();
        const commentsWithLikes: any = {
            comment,
            is_liked: await this.commentLikesService.isLiked(
                comment_id,
                user_id,
            ),
            like_count: await this.commentLikesService.likeCount(comment_id),
        };
        if (comment.replies.length > 0) {
            for (let i = 0; i < comment.replies.length; i++) {
                const element = comment.replies[i];
                commentsWithLikes.comment.replies[i] = {
                    ...element,
                    is_like: await this.commentLikesService.isLiked(
                        element.comment_id,
                        user_id,
                    ),
                    like_count: await this.commentLikesService.likeCount(
                        element.comment_id,
                    ),
                };
            }
        }
        return commentsWithLikes;
    }
}
