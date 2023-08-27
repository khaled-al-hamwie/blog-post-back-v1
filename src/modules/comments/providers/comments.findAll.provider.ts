import { Injectable } from "@nestjs/common";
import { Blog } from "src/modules/blogs/entities/blog.entity";
import { CommentLikesService } from "src/modules/likes/providers/comment-likes.service";
import { FindManyOptions, FindOptionsOrder } from "typeorm";
import { CommentsService } from "../comments.service";
import { FindAllCommentsDto } from "../dto/findAll-comment.dto";
import { Comment } from "../entities/comment.entity";
import { CommentNotFoundException } from "../exceptions/commnets-notFound.exception";

@Injectable()
export class CommentsFindAllProvider {
    constructor(
        private readonly commentsService: CommentsService,
        private readonly commentLikesService: CommentLikesService,
    ) {}
    GetOption(
        { page, sort }: FindAllCommentsDto,
        blog_id: number,
    ): FindManyOptions<Comment> {
        const options: FindManyOptions<Comment> = {};
        options.where = { blog: { blog_id } };
        options.take = 40;
        options.skip = page ? page * 40 : 0;
        options.order = this.GetOrder(sort);
        options.relations = { user: true };
        options.select = {
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
        };
        return options;
    }

    GetOrder(sort: string) {
        let order: FindOptionsOrder<Comment> = {};
        if (sort == "oldest") order = { created_at: "ASC" };
        else if (sort == "newest") order = { created_at: "DESC" };
        else order = { created_at: "DESC" };
        return order;
    }

    async provideComments(
        blog: Blog,
        findAllCommentsDto: FindAllCommentsDto,
        user_id: number,
    ) {
        const option = this.GetOption(findAllCommentsDto, blog.blog_id);
        const comments = await this.commentsService.findAll(option);
        if (comments.length == 0) throw new CommentNotFoundException();
        const commentsWihtLikes = [];
        for (let i = 0; i < comments.length; i++) {
            const element = comments[i];
            commentsWihtLikes.push({
                comment: element,
                is_liked: await this.commentLikesService.isLiked(
                    element.comment_id,
                    user_id,
                ),
                like_count: await this.commentLikesService.likeCount(
                    element.comment_id,
                ),
            });
        }
        return commentsWihtLikes;
    }
}
