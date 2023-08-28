import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/services/users.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterAdminDto } from "./dto/register-admin.dto";

@Injectable()
export class AuthService {
    constructor(private readonly UsersService: UsersService) {}
    async register(registerUserDto: RegisterAdminDto) {
        const user = await this.UsersService.create(registerUserDto);
        delete user.password;
        delete user.role;
        return user;
    }

    async login(loginUserDto: LoginUserDto) {
        return `This action returns all auth`;
    }
}
