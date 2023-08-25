import {
    AbilityBuilder,
    ExtractSubjectType,
    createMongoAbility,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Blog } from "src/modules/blogs/entities/blog.entity";
import { BlogAction } from "src/modules/blogs/enums/blogs.actions.enum";
import { User } from "src/modules/users/entities/user.entity";
import { Like } from "../entities/like.entity";

@Injectable()
export class likesAbilityFactory {
    createForUser(user: User) {
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
        if (user.role.name == "admin" || user.role.name == "super admin") {
            cannot(BlogAction.LikeBlog, Blog);
        } else {
            can(BlogAction.LikeBlog, Blog);
        }
        return build({
            detectSubjectType: item =>
                item.constructor as ExtractSubjectType<typeof Like>,
        });
    }
}
