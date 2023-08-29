import { Injectable } from "@nestjs/common";
import { FindOneOptions } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class UsersShowProfileProvider {
    GetOptions(user_id: number): FindOneOptions<User> {
        const options: FindOneOptions<User> = {};
        options.where = { user_id };
        options.select = {
            user_id: true,
            user_name: true,
            first_name: true,
            last_name: true,
            avatar: true,
            profile: true,
        };
        return options;
    }
}
