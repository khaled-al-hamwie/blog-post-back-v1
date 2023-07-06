import { Injectable } from "@nestjs/common";
import { LoginUserDto } from "./dto/login-user.dto";

@Injectable()
export class AuthService {
    register() {
        return "This action adds a new auth";
    }

    login() {
        return `This action returns all auth`;
    }

    validateUser(user: LoginUserDto) {
        console.log("hi");
    }
}
