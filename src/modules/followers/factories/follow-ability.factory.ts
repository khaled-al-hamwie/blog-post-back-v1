import {
    AbilityBuilder,
    ExtractSubjectType,
    createMongoAbility,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { User } from "src/modules/users/entities/user.entity";
import { FollowAction } from "../enums/follow.actions.enum";

@Injectable()
export class followsAbilityFactory {
    createForUser(user: User) {
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
        if (user.role.name == "admin" || user.role.name == "super admin") {
            cannot(FollowAction.Follow, User);
            cannot(FollowAction.UnFollow, User);
        } else {
            can(FollowAction.Follow, User);
            can(FollowAction.UnFollow, User);
        }
        return build({
            detectSubjectType: item =>
                item.constructor as ExtractSubjectType<typeof User>,
        });
    }
}
