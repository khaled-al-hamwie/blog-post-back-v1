import {
    AbilityBuilder,
    ExtractSubjectType,
    createMongoAbility,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "src/modules/auth/enums/actions.enum";
import { User } from "../entities/user.entity";

// type Subjects = InferSubjects<typeof User> | 'all';

@Injectable()
export class UsersAbilityFactory {
    createForUser(user: User) {
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
        if (user.role.name == "super admin") {
            can(Action.Manage, "all");
        } else if (user.role.name == "admin") {
            can(Action.Read, User);
            cannot(Action.Read, User, "password");
            cannot(Action.Read, User, { "role.role_id": 3 });
        } else {
            cannot(Action.Read, User, { user_id: { $ne: user.user_id } });
            cannot(Action.Read, User, "role");
        }
        return build({
            detectSubjectType: item =>
                item.constructor as ExtractSubjectType<typeof User>,
        });
    }
}
// if the user is admin or supper-admin he can create an admin
//
