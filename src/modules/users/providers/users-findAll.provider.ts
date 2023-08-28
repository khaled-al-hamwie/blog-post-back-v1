import { Injectable } from "@nestjs/common";
import { FindManyOptions } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class UsersFindAllProvider {
    GetOptions(): FindManyOptions<User> {
        const options: FindManyOptions<User> = {};
        options.select = {
            user_id: true,
            first_name: true,
            last_name: true,
            avatar: true,
        };
        return options;
    }
}
