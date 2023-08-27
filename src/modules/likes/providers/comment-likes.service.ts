import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "src/modules/comments/entities/comment.entity";
import { FindOneOptions, Repository } from "typeorm";
import { UsersService } from "../../users/services/users.service";
import { CommentLike } from "../entities/comment-like.entity";

@Injectable()
export class CommentLikesService {
    constructor(
        @InjectRepository(CommentLike)
        private likeRepositry: Repository<CommentLike>,
        private readonly usersService: UsersService,
    ) {}
    async create(comment: Comment, user_id: number) {
        const like = this.likeRepositry.create();
        like.comment = comment;
        like.user = await this.usersService.findOne({
            where: {
                user_id,
            },
        });
        this.likeRepositry.save(like);
        return { message: "like has been added" };
    }

    findOne(options: FindOneOptions<CommentLike>) {
        return this.likeRepositry.findOne(options);
    }

    async isLiked(comment_id: number, user_id: number): Promise<boolean> {
        return (await this.findOne({
            where: { comment: { comment_id }, user: { user_id } },
        }))
            ? true
            : false;
    }

    likeCount(commnet_id: number) {
        return this.likeRepositry
            .createQueryBuilder("like")
            .where("like.blog = :blog_id", { commnet_id })
            .loadRelationCountAndMap("likeCount", "like.blog")
            .getCount();
    }

    remove(like: CommentLike) {
        this.likeRepositry.delete(like);
        return { message: "liked has been removed" };
    }
}
