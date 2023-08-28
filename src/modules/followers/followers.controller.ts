import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { UserDecorator } from "src/core/common/decorators/user.decorator";
import { LoggedInGuard } from "src/core/common/guards/logged-in.guard";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/services/users.service";
import { CreateFollowerDto } from "./dto/create-follower.dto";
import { FollowAction } from "./enums/follow.actions.enum";
import { CannotFollowYourselfException } from "./exceptions/cannot-follow-yourself.exception";
import { followsAbilityFactory } from "./factories/follow-ability.factory";
import { FollowersService } from "./followers.service";

@UseGuards(LoggedInGuard)
@Controller("followers")
export class FollowersController {
    constructor(
        private readonly followersService: FollowersService,
        private readonly followAbilityFactory: followsAbilityFactory,
        private readonly usersService: UsersService,
    ) {}

    @Post()
    async create(
        @Body() createFollowerDto: CreateFollowerDto,
        @UserDecorator() user: User,
    ) {
        if (createFollowerDto.user_id == user.user_id)
            throw new CannotFollowYourselfException();
        const ability = this.followAbilityFactory.createForUser(user);
        if (ability.can(FollowAction.Follow, User)) {
            createFollowerDto.follower_id = user.user_id;
            return this.followersService.create(createFollowerDto);
        }
        throw new UnauthorizedException();
    }

    @Get()
    findAll() {
        return this.followersService.findAll();
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.followersService.remove(+id);
    }
}
