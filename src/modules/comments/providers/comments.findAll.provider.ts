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
