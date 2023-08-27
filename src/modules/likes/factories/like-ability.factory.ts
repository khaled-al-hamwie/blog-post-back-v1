import {
    AbilityBuilder,
    ExtractSubjectType,
    createMongoAbility,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Blog } from "src/modules/blogs/entities/blog.entity";
import { BlogAction } from "src/modules/blogs/enums/blogs.actions.enum";
import { Comment } from "src/modules/comments/entities/comment.entity";
import { CommentAction } from "src/modules/comments/enums/comments.actions.enum";
import { User } from "src/modules/users/entities/user.entity";
import { BlogLike } from "../entities/blog-like.entity";
import { CommentLike } from "../entities/comment-like.entity";

@Injectable()
export class likesAbilityFactory {
    createForUser(user: User) {
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
        if (user.role.name == "admin" || user.role.name == "super admin") {
            cannot(BlogAction.LikeBlog, Blog);
            cannot(CommentAction.LikeComment, Comment);
        } else {
            can(BlogAction.LikeBlog, Blog);
            can(CommentAction.LikeComment, Comment);
        }
        return build({
            detectSubjectType: item =>
                item.constructor as ExtractSubjectType<
                    typeof BlogLike | typeof CommentLike
                >,
        });
    }
}
