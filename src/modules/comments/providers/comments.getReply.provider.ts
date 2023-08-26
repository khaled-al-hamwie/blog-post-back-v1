import { Injectable } from "@nestjs/common";
import { FindManyOptions, FindOptionsSelect } from "typeorm";
import { Comment } from "../entities/comment.entity";

@Injectable()
export class CommentsGetReplyProvider {
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
}
