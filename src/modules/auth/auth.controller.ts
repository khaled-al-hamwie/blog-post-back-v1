import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Session,
    UseGuards,
} from "@nestjs/common";
import { LoggedInGuard } from "src/core/common/guards/logged-in.guard";
import { LocalGuard } from "../../core/common/guards/local.guard";
import { AuthService } from "./auth.service";

import { UserDecorator } from "src/core/common/decorators/user.decorator";
import { AdminGuard } from "src/core/common/guards/admin.guard";
import { User as UserEntity } from "../users/entities/user.entity";
import { RegisterAdminDto } from "./dto/register-admin.dto";
import { RegisterUserDto } from "./dto/register-user.dto";

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @Post("admin/register")
    @UseGuards(AdminGuard)
    registerAdmin(
        @Body() registerAdminDto: RegisterAdminDto,
        @UserDecorator() user: UserEntity,
    ) {
        return this.authService.register(registerAdminDto, user);
    }

    @HttpCode(HttpStatus.OK)
    @Post("login")
    @UseGuards(LocalGuard)
    login() {
        return { message: "logged in done" };
    }

    @HttpCode(HttpStatus.OK)
    @Post("logout")
    @UseGuards(LoggedInGuard)
    logout(@Session() session: any) {
        session.destroy();
        return { message: "logged out done" };
    }
}
