import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Session,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { LoggedInGuard } from "src/core/common/guards/logged-in.guard";
import { LocalGuard } from "../../core/common/guards/local.guard";
import { AuthService } from "./auth.service";

import { UserDecorator } from "src/core/common/decorators/user.decorator";
import { AdminGuard } from "src/core/common/guards/admin.guard";
import { User, User as UserEntity } from "../users/entities/user.entity";
import { RegisterAdminDto } from "./dto/register-admin.dto";
import { RegisterUserDto } from "./dto/register-user.dto";
import { AuthAction } from "./enums/acth.actions.enum";
import { AuthAbilityFactory } from "./factories/auth-ability.factory";

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly authAbilityFactory: AuthAbilityFactory,
    ) {}

    @Post("register")
    register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register({ ...registerUserDto, role_id: 1 });
    }

    @Post("admin/register")
    @UseGuards(AdminGuard)
    registerAdmin(
        @Body() registerAdminDto: RegisterAdminDto,
        @UserDecorator() user: UserEntity,
    ) {
        const ability = this.authAbilityFactory.createForUser(user);
        if (
            registerAdminDto.role_id == 3 &&
            ability.can(AuthAction.registerSuperAdmin, User)
        )
            return this.authService.register(registerAdminDto);
        else if (
            registerAdminDto.role_id == 2 &&
            ability.can(AuthAction.registerAdmin, User)
        )
            return this.authService.register(registerAdminDto);
        else throw new UnauthorizedException();
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
