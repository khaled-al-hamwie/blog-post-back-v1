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
import { CreateFollowDto } from "./dto/create-follow.dto";
import { FollowAction } from "./enums/follow.actions.enum";
import { CannotFollowYourselfException } from "./exceptions/cannot-follow-yourself.exception";
import { followsAbilityFactory } from "./factories/follow-ability.factory";
import { FollowsService } from "./follows.service";

@UseGuards(LoggedInGuard)
@Controller("follows")
export class FollowsController {
    constructor(
        private readonly followersService: FollowsService,
        private readonly followAbilityFactory: followsAbilityFactory,
        private readonly usersService: UsersService,
    ) {}

    @Post()
    async create(
        @Body() createFollowsDto: CreateFollowDto,
        @UserDecorator() user: User,
    ) {
        if (createFollowsDto.user_id == user.user_id)
            throw new CannotFollowYourselfException();
        const ability = this.followAbilityFactory.createForUser(user);
        if (ability.can(FollowAction.Follow, User)) {
            createFollowsDto.follower_id = user.user_id;
            return this.followersService.create(createFollowsDto);
        }
        throw new UnauthorizedException();
    }

    @Get()
    showFollowing() {
        return this.followersService.findAll();
    }

    @Get()
    showFollowers() {
        return "";
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.followersService.remove(+id);
    }
}
