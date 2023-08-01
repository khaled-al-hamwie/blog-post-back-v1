import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";

import { Role } from "../roles/entities/role.entity";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { payloadInterface } from "./interfaces/payload.interface";

@Injectable()
export class AuthSerializer extends PassportSerializer {
    constructor(private readonly usersService: UsersService) {
        super();
    }
    serializeUser(
        user: User,
        done: (err: Error, user: payloadInterface) => void,
    ) {
        done(null, { user_id: user.user_id, user_name: user.user_name });
    }

    async deserializeUser(
        payload: payloadInterface,
        done: (err: Error, user: Omit<User, "password">) => void,
    ) {
        const user = await this.usersService.findOne({
            where: { user_id: payload.user_id },
            relations: {
                role: true,
            },
        });
        delete user["password"];
        delete user["first_name"];
        delete user["last_name"];
        delete user["profile"];
        delete user["avatar"];
        done(null, user);
    }
}
