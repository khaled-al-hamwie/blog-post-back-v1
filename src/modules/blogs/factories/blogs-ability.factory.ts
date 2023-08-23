import {
    AbilityBuilder,
    ExtractSubjectType,
    createMongoAbility,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "src/modules/auth/enums/actions.enum";
import { User } from "src/modules/users/entities/user.entity";
import { Blog } from "../entities/blog.entity";

// type Subjects = InferSubjects<typeof User> | 'all';

@Injectable()
export class BlogsAbilityFactory {
    createForUser(user: User) {
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
        if (user.role.name == "super admin") {
            can(Action.Manage, Blog);
        } else if (user.role.name == "admin") {
            can(Action.Read, Blog);
            cannot(Action.Create, Blog);
            cannot(Action.Update, Blog);
            can(Action.Delete, Blog);
        } else {
            can(Action.Create, Blog);
            can(Action.Update, Blog);
            cannot(Action.Read, Blog);

            cannot(Action.Delete, Blog);
        }
        return build({
            detectSubjectType: item =>
                item.constructor as ExtractSubjectType<typeof Blog>,
        });
    }
}
// if the user is admin or supper-admin he can create an admin
//
