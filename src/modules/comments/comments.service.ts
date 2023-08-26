import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { Blog } from "../blogs/entities/blog.entity";
import { UsersService } from "../users/services/users.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Comment } from "./entities/comment.entity";

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
        this.commnetRepositry.save(comment);
        return { message: "blog has been added" };
    }

    findAll(options: FindManyOptions<Comment>) {
        return this.commnetRepositry.find(options);
    }

    findOne(id: number) {
        return `This action returns a #${id} comment`;
    }

    update(id: number, updateCommentDto: UpdateCommentDto) {
        return `This action updates a #${id} comment`;
    }

    remove(id: number) {
        return `This action removes a #${id} comment`;
    }
}
