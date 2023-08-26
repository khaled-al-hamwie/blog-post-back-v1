import {
    AbilityBuilder,
    ExtractSubjectType,
    createMongoAbility,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Blog } from "src/modules/blogs/entities/blog.entity";
import { BlogAction } from "src/modules/blogs/enums/blogs.actions.enum";
import { User } from "src/modules/users/entities/user.entity";
import { Comment } from "../entities/comment.entity";
import { CommentAction } from "../enums/comments.actions.enum";

@Injectable()
export class CommentsAbilityFactory {
    createForUser(user: User) {
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
        if (user.role.name == "admin" || user.role.name == "super admin") {
            cannot(BlogAction.CommentBlog, Blog);
            cannot(CommentAction.UpdateComment, Comment);
        } else {
            can(BlogAction.CommentBlog, Blog);
            can(CommentAction.UpdateComment, Comment);
            can(CommentAction.UpdateComment, Comment, {
                "user.user_id": user.user_id,
            } as any);
            cannot(CommentAction.UpdateComment, Comment, {
                "user.user_id": { $ne: user.user_id },
            } as any);
        }
        return build({
            detectSubjectType: item =>
                item.constructor as ExtractSubjectType<typeof Comment>,
        });
    }
}
