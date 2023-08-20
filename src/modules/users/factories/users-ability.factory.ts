import {
    AbilityBuilder,
    ExtractSubjectType,
    InferSubjects,
    createMongoAbility,
    defineAbility,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "src/modules/auth/enums/actions.enum";
import { User } from "../entities/user.entity";

// type Subjects = InferSubjects<typeof User> | 'all';

@Injectable()
export class UsersAbilityFactory {
    createForUser(user: User) {
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
        // if (user.role.name == "admin") {
        //     cannot(Action.Create, User, {
        //         first_name: "khaled",
        //     });
        //     can(Action.Create, User, { first_name: "booo" });
        //     // can(Action.Create, User, { role: { role_id: 2 } });
        // } else if (user.role.name == "super admin") {
        //     can(Action.Create, User);
        // }
        return build({
            detectSubjectType: item =>
                item.constructor as ExtractSubjectType<typeof User>,
        });
    }
}
// if the user is admin or supper-admin he can create an admin
//
