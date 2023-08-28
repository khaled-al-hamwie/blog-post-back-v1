import { Injectable } from "@nestjs/common";
import { FindManyOptions } from "typeorm";
import { Follow } from "../entities/follow.entity";

@Injectable()
export class FollowShowFollowerProvider {
    GetOptions(user_id: number) {
        const options: FindManyOptions<Follow> = {};
        options.relations = { follower: true };
        options.where = { user: { user_id } };
        options.select = {
            follower: {
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
