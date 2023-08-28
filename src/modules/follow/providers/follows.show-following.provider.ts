import { Injectable } from "@nestjs/common";
import { FindManyOptions } from "typeorm";
import { Follow } from "../entities/follow.entity";

@Injectable()
export class FollowShowFollowingProvider {
    GetOptions(user_id: number) {
        const options: FindManyOptions<Follow> = {};
        options.relations = { user: true };
        options.where = { follower: { user_id } };
        options.select = {
            user: {
                user_id: true,
                user_name: true,
                first_name: true,
                last_name: true,
                avatar: true,
            },
        };
        return options;
    }
}
