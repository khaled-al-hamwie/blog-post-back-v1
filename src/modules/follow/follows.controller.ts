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
import { CreateFollowDto } from "./dto/create-follow.dto";
import { FollowAction } from "./enums/follow.actions.enum";
import { CannotFollowYourselfException } from "./exceptions/cannot-follow-yourself.exception";
import { followsAbilityFactory } from "./factories/follow-ability.factory";
import { FollowsService } from "./follows.service";
import { FollowShowFollowingProvider } from "./providers/follows.show-following.provider";

@UseGuards(LoggedInGuard)
@Controller("follows")
export class FollowsController {
    constructor(
        private readonly followersService: FollowsService,
        private readonly followAbilityFactory: followsAbilityFactory,
        private readonly followsShowFollowingProvider: FollowShowFollowingProvider,
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

    @Get("following")
    showFollowing(@UserDecorator("user_id") user_id: number) {
        const options = this.followsShowFollowingProvider.GetOptions(user_id);
        return this.followersService.findAll(options);
    }

    @Get("followers")
    showFollowers() {
        return "";
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.followersService.remove(+id);
    }
}
