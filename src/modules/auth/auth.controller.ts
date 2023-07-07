import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Session,
    UseGuards,
} from "@nestjs/common";
import { LoggedInGuard } from "src/core/common/guards/logged-in.guard";
import { LocalGuard } from "../../core/common/guards/local.guard";
import { AuthService } from "./auth.service";

import { RegisterUserDto } from "./dto/register-user.dto";

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post("login")
    @UseGuards(LocalGuard)
    login() {
        return { message: "logged in done" };
    }

    @Get("test")
    @UseGuards(LoggedInGuard)
    protect() {
        return "protected";
    }

    @HttpCode(HttpStatus.OK)
    @Post("logout")
    @UseGuards(LoggedInGuard)
    logout(@Session() session: any) {
        session.destroy();
        return { message: "logged out done" };
    }
}
