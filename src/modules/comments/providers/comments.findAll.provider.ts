import { Injectable } from "@nestjs/common";
import { FindManyOptions, FindOptionsOrder } from "typeorm";
import { FindAllCommentsDto } from "../dto/findAll-comment.dto";
import { Comment } from "../entities/comment.entity";

@Injectable()
export class CommentsFindAllProvider {
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
}
