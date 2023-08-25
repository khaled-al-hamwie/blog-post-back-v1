import {
    Controller,
    Delete,
    Param,
    ParseIntPipe,
    Post,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { UserDecorator } from "src/core/common/decorators/user.decorator";
import { LoggedInGuard } from "src/core/common/guards/logged-in.guard";
import { BlogsService } from "../blogs/blogs.service";
import { BlogAction } from "../blogs/enums/blogs.actions.enum";
import { BlogNotFoundException } from "../blogs/exceptions/BlogNotFound.exception";
import { User } from "../users/entities/user.entity";
import { LikeCreatedException } from "./exceptions/likeCreated.exception";
import { likesAbilityFactory } from "./factories/like-ability.factory";
import { LikesService } from "./likes.service";

@UseGuards(LoggedInGuard)
@Controller("likes")
export class LikesController {
    constructor(
        private readonly likesService: LikesService,
        private readonly blogsService: BlogsService,
        private readonly likesAbilityFactory: likesAbilityFactory,
    ) {}

    @Post(":blog_id")
    async create(
        @Param("blog_id", ParseIntPipe) blog_id: number,
        @UserDecorator() user: User,
    ) {
        const blog = await this.blogsService.findOne({ where: { blog_id } });
        if (!blog) throw new BlogNotFoundException();
        const ability = this.likesAbilityFactory.createForUser(user);
        if (ability.cannot(BlogAction.LikeBlog, blog))
            throw new UnauthorizedException();
        const blogLiked = await this.likesService.findOne({
            where: { blog: { blog_id }, user: { user_id: user.user_id } },
        });
        if (blogLiked) throw new LikeCreatedException();
        return this.likesService.create(blog, user.user_id);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.likesService.remove(+id);
    }
}
