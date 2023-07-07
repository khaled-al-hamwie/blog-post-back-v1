import { Inject, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";

@Injectable()
export class AuthService {
    constructor(private readonly UsersService: UsersService) {}
    register(registerUserDto: RegisterUserDto) {
        return this.UsersService.create(registerUserDto);
    }

    async login(loginUserDto: LoginUserDto) {
        return `This action returns all auth`;
    }
}
