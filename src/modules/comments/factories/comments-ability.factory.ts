import {
    AbilityBuilder,
    ExtractSubjectType,
    createMongoAbility,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Blog } from "src/modules/blogs/entities/blog.entity";
import { BlogAction } from "src/modules/blogs/enums/blogs.actions.enum";
import { User } from "src/modules/users/entities/user.entity";

@Injectable()
export class CommentsAbilityFactory {
    createForUser(user: User) {
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
        if (user.role.name == "admin" || user.role.name == "super admin") {
            cannot(BlogAction.CommentBlog, Blog);
        } else {
            can(BlogAction.CommentBlog, Blog);
        }
        return build({
            detectSubjectType: item =>
                item.constructor as ExtractSubjectType<typeof Comment>,
        });
    }
}
