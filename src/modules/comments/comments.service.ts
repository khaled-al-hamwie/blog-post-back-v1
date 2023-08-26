import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, IsNull, Repository } from "typeorm";
import { Blog } from "../blogs/entities/blog.entity";
import { UsersService } from "../users/services/users.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Comment } from "./entities/comment.entity";
import { CommentNotFoundException } from "./exceptions/commnets-notFound.exception";

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commnetRepositry: Repository<Comment>,
        private readonly usersService: UsersService,
    ) {}
    async create(createCommentDto: CreateCommentDto, blog: Blog) {
        const comment = this.commnetRepositry.create({
            comment: createCommentDto.comment,
        });
        comment.user = await this.usersService.findOne({
            where: {
                user_id: createCommentDto.user_id,
            },
        });
        comment.blog = blog;
        if (createCommentDto.comment_id) {
            const parentComment = await this.findOne({
                where: {
                    comment_id: createCommentDto.comment_id,
                    parent: IsNull(),
                },
            });
            if (!parentComment) throw new CommentNotFoundException();
            comment.parent = parentComment;
        }
        this.commnetRepositry.save(comment);
        return { message: "comment has been added" };
    }

    findAll(options: FindManyOptions<Comment>) {
        return this.commnetRepositry.find(options);
    }

    findOne(options: FindOneOptions<Comment>) {
        return this.commnetRepositry.findOne(options);
    }

    update(comment: Comment, updateCommentDto: UpdateCommentDto) {
        if (updateCommentDto.user_id) delete updateCommentDto.user_id;
        this.commnetRepositry.save({ ...comment, ...updateCommentDto });
        return { message: "comment has been updated" };
    }

    async remove(comment: Comment) {
        console.log(comment);
        await this.commnetRepositry.remove(comment);
        return { message: "comment has been deleted" };
    }
}
