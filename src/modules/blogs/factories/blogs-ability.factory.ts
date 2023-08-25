import {
    AbilityBuilder,
    ExtractSubjectType,
    createMongoAbility,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { User } from "src/modules/users/entities/user.entity";
import { Blog } from "../entities/blog.entity";
import { BlogAction } from "../enums/blogs.actions.enum";

@Injectable()
export class BlogsAbilityFactory {
    createForUser(user: User) {
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
        if (user.role.name == "admin" || user.role.name == "super admin") {
            can(BlogAction.ReadBlog, Blog);
            can(BlogAction.ReadDeletedBlog, Blog);

            cannot(BlogAction.CreateBlog, Blog);
            cannot(BlogAction.UpdateBlog, Blog);
            can(BlogAction.DeleteBlog, Blog);
        } else {
            can(BlogAction.ReadBlog, Blog, { deleted_at: null });
            can(BlogAction.ReadBlog, Blog, {
                "user.user_id": user.user_id,
                deleted_at: { $ne: null },
            } as any);
            cannot(BlogAction.ReadBlog, Blog, {
                "user.user_id": { $ne: user.user_id },
                deleted_at: { $ne: null },
            } as any);

            cannot(BlogAction.ReadDeletedBlog, Blog);

            can(BlogAction.CreateBlog, Blog);

            can(BlogAction.UpdateBlog, Blog, {
                "user.user_id": user.user_id,
            } as any);

            can(BlogAction.DeleteBlog, Blog, {
                "user.user_id": user.user_id,
            } as any);
        }
        return build({
            detectSubjectType: item =>
                item.constructor as ExtractSubjectType<typeof Blog>,
        });
    }
}
