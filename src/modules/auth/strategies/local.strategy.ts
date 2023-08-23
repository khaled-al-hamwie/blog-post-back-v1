import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UsersService } from "src/modules/users/services/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
    constructor(private readonly usersService: UsersService) {
        super({
            usernameField: "user_name",
        });
    }

    async validate(user_name: string, password: string) {
        const sendUser = await this.usersService.findOne(
            {
                where: { user_name },
            },
            false,
        );
        const user = await this.usersService.validate(sendUser, password);

        if (!user) {
            throw new ForbiddenException("credentails don't match");
        }
        return user;
    }
}
