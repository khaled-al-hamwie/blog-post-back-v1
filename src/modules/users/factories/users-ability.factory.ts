import {
    AbilityBuilder,
    ExtractSubjectType,
    createMongoAbility,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "src/modules/auth/enums/actions.enum";
import { User } from "../entities/user.entity";
import { UsersRolesService } from "../services/users.roles.service";

// type Subjects = InferSubjects<typeof User> | 'all';

@Injectable()
export class UsersAbilityFactory {
    constructor(private readonly usersRolesService: UsersRolesService) {}
    createForUser(user: User) {
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
        if (this.usersRolesService.IsSuperAdmin(user)) {
            can(Action.Manage, User);
        } else if (this.usersRolesService.IsAdmin(user)) {
            can(Action.Read, User);
            cannot(Action.Read, User, "password");
            cannot(Action.Read, User, { "role.role_id": 3 } as any);

            can(Action.Delete, User);
            cannot(Action.Delete, User, { "role.role_id": 3 } as any);
            cannot(Action.Delete, User, { "role.role_id": 2 } as any);

            can(Action.Restore, User);
            cannot(Action.Restore, User, { "role.role_id": 3 } as any);
            cannot(Action.Restore, User, { "role.role_id": 2 } as any);
        } else {
            cannot(Action.Read, User, { user_id: { $ne: user.user_id } });
            cannot(Action.Read, User, "role");
            cannot(Action.Delete, User);
            cannot(Action.Restore, User);
        }
        return build({
            detectSubjectType: item =>
                item.constructor as ExtractSubjectType<typeof User>,
        });
    }
}
// if the user is admin or supper-admin he can create an admin
//
