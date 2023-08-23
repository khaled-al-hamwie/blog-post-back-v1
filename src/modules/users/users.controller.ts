import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { UserDecorator } from "src/core/common/decorators/user.decorator";
import { LoggedInGuard } from "src/core/common/guards/logged-in.guard";
import { Action } from "../auth/enums/actions.enum";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UserNotFoundException } from "./exceptions/userNotFound.exception";
import { UserUnauthorizedException } from "./exceptions/userUnauthorized.exception";
import { UsersAbilityFactory } from "./factories/users-ability.factory";
import { UsersService } from "./users.service";
@UseGuards(LoggedInGuard)
@Controller("users")
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly usersAbilityFactory: UsersAbilityFactory,
    ) {}

    @Get()
    findAll(@UserDecorator() user: User) {
        const ability = this.usersAbilityFactory.createForUser(user);
        if (ability.can(Action.Read, User))
            return this.usersService.findAll({
                select: {
                    user_id: true,
                    first_name: true,
                    last_name: true,
                },
            });
        throw new UnauthorizedException();
    }
    @Get("profile")
    async showProfile(@UserDecorator() user: User) {
        const ability = this.usersAbilityFactory.createForUser(user);
        const profile = await this.usersService.findOne({
            where: { user_id: user.user_id },
            relations: { role: ability.can(Action.Read, User, "role") },
        });
        return profile;
    }
    @Get(":id")
    async findOne(
        @UserDecorator() user: User,
        @Param("id", ParseIntPipe) user_id: number,
    ) {
        const ability = this.usersAbilityFactory.createForUser(user);
        if (ability.can(Action.Read, User)) {
            const requiredUser = await this.usersService.findOne({
                where: { user_id },
                relations: { role: true },
            });
            if (!requiredUser || ability.cannot(Action.Read, requiredUser))
                throw new UserNotFoundException();
            return requiredUser;
        }
        throw new UserUnauthorizedException();
    }

    @Patch()
    async update(
        @UserDecorator() user: User,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        await this.usersService.update(user, updateUserDto);
    }

    @Delete()
    async remove(@UserDecorator("user_id") user_id: number) {
        const wantedUser = await this.usersService.findOne({
            where: { user_id },
        });
        return this.usersService.remove(wantedUser);
    }

    @Delete(":id")
    async block(
        @UserDecorator() user: User,
        @Param("id", ParseIntPipe) user_id: number,
    ) {
        const ability = this.usersAbilityFactory.createForUser(user);
        if (ability.cannot(Action.Delete, User))
            throw new UnauthorizedException();
        const wantedUser = await this.usersService.findOne({
            where: { user_id },
            relations: { role: true },
        });
        if (!wantedUser) throw new UserNotFoundException();
        console.log(ability.can(Action.Delete, wantedUser));
        if (ability.can(Action.Delete, wantedUser)) {
            return this.usersService.remove(wantedUser);
        }
        throw new UserNotFoundException();
    }
}
