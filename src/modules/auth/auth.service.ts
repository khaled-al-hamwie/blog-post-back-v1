import { Injectable } from "@nestjs/common";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterAdminDto } from "./dto/register-admin.dto";
import { RegisterUserDto } from "./dto/register-user.dto";

@Injectable()
export class AuthService {
    constructor(private readonly UsersService: UsersService) {}
    async register(
        registerUserDto: RegisterUserDto | RegisterAdminDto,
        adminUser?: User,
    ) {
        const user = await this.UsersService.create({
            ...registerUserDto,
            user: adminUser,
        });
        delete user.password;
        delete user.role;
        return user;
    }

    async login(loginUserDto: LoginUserDto) {
        return `This action returns all auth`;
    }
}
