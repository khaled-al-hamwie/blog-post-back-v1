import {
    AbilityBuilder,
    ExtractSubjectType,
    createMongoAbility,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { User } from "src/modules/users/entities/user.entity";
import { AuthAction } from "../enums/acth.actions.enum";

@Injectable()
export class AuthAbilityFactory {
    createForUser(user: User) {
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
        if (user.role.name == "super admin") {
            can(AuthAction.registerSuperAdmin, User);
            can(AuthAction.registerAdmin, User);
        } else if (user.role.name == "admin") {
            cannot(AuthAction.registerSuperAdmin, User);
            can(AuthAction.registerAdmin, User);
        } else {
            cannot(AuthAction.registerSuperAdmin, User);
            cannot(AuthAction.registerAdmin, User);
        }
        return build({
            detectSubjectType: item =>
                item.constructor as ExtractSubjectType<typeof User>,
        });
    }
}
