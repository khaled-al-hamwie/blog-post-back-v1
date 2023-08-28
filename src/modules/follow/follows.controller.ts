import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
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
import { NoFollowerException } from "./exceptions/no-follower.exception";
import { NoFollowingException } from "./exceptions/no-following.exception";
import { followsAbilityFactory } from "./factories/follow-ability.factory";
import { FollowsService } from "./follows.service";
import { FollowShowFollowerProvider } from "./providers/follows.show-follower.provider";
import { FollowShowFollowingProvider } from "./providers/follows.show-following.provider";

@UseGuards(LoggedInGuard)
@Controller("follows")
export class FollowsController {
    constructor(
        private readonly followersService: FollowsService,
        private readonly followAbilityFactory: followsAbilityFactory,
        private readonly followsShowFollowingProvider: FollowShowFollowingProvider,
        private readonly followsShowFollowerProvider: FollowShowFollowerProvider,
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
    async showFollowing(@UserDecorator("user_id") user_id: number) {
        const options = this.followsShowFollowingProvider.GetOptions(user_id);
        const following = await this.followersService.findAll(options);
        if (following.length < 1) throw new NoFollowingException();
        return {
            following,
            following_count: await this.followersService.count({
                where: { follower: { user_id } },
            }),
        };
    }

    @Get("followers")
    async showFollowers(@UserDecorator("user_id") user_id: number) {
        const options = this.followsShowFollowerProvider.GetOptions(user_id);
        const followers = await this.followersService.findAll(options);
        if (followers.length < 1) throw new NoFollowerException();
        return {
            followers,
            followers_count: await this.followersService.count({
                where: { user: { user_id } },
            }),
        };
    }

    @Delete(":follow_id")
    async remove(
        @Param("follow_id", ParseIntPipe) follow_id: number,
        @UserDecorator("user_id") user_id: number,
    ) {
        if ((FollowAction.UnFollow, User)) {
            const follow = await this.followersService.findOne({
                where: { follow_id, follower: { user_id } },
            });
            if (!follow) throw new NoFollowerException();
            return this.followersService.remove(follow);
        }
        throw new UnauthorizedException();
    }
}
