import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: "user_name",
        });
    }

    async validate(user_name: string, password: string) {
        return this.authService.validateUser({
            user_name: user_name,
            password,
        });
    }
}
